<template>
  <div class="search">
    <h1>
      <span class="total">{{ totalResults }}</span>
      locations in
      <span class="location">{{ location }}</span>
    </h1>

    <router-link to="/">go back</router-link>
    <br /><br />

    <input type="checkbox" v-model="inStockOnly" />
    in stock only

    <input type="checkbox" v-model="includeCVS" />
    include CVS

    <page-navigation v-if="isPaginated" :totalResults="totalResults" />

    <h2 v-if="isLoading">loading...</h2>
    <div v-else>
      <search-result
        v-for="result in results"
        :key="result[':id']"
        :result="result"
      />
      <p v-if="!results.length">
        No results found.
        <span v-if="filtersEnabled">
          Try changing some filters or searching another location.
        </span>
        <span v-else>
          Check your spelling or try again with (or without) an abbreviation.<br />
          For example, <strong>Fort Worth</strong> instead of
          <strong>Ft. Worth</strong>.
        </span>
      </p>
    </div>

    <page-navigation v-if="isPaginated" :totalResults="totalResults" />
  </div>
</template>

<script>
import startCase from 'lodash/startCase'

import PageNavigation from '@/components/PageNavigation.vue'
import SearchResult from '@/components/SearchResult'
import { CDC_API_RESULT_LIMIT } from '@/constants'

export default {
  name: 'SearchView',

  components: {
    SearchResult,
    PageNavigation,
  },

  data() {
    return {
      includeCVS: this.$route.query.includeCVS || false,
      inStockOnly: this.$route.query.inStockOnly || false,
      isLoading: true,
      results: [],
      totalResults: 0,
    }
  },

  computed: {
    filtersEnabled() {
      return Object.keys(this.$route.query).length > 0
    },

    isPaginated() {
      return this.totalResults > CDC_API_RESULT_LIMIT
    },

    location() {
      const city = startCase(this.$route.params.city)
      const state = this.$route.params.state.toUpperCase()
      return city !== 'All' ? `${city}, ${state}` : state
    },
  },

  watch: {
    async '$route.params'() {
      await this.reloadData()
    },

    includeCVS() {
      this.updateFilters()
    },

    inStockOnly() {
      this.updateFilters()
    },
  },

  methods: {
    async getCdcResults(count = false) {
      const { city, page, state } = this.$route.params
      let query = `select *, :id where ((contains(upper(\`med_name\`), upper('novavax')))`
      query += ` and (upper(\`loc_admin_state\`) = upper('${state}'))`

      if (city !== 'all') {
        query += ` and (upper(\`loc_admin_city\`) = upper('${city}'))`
      }

      if (this.inStockOnly) {
        query += ' and (`in_stock` = true)'
      }

      if (!this.includeCVS) {
        query += ` and not contains(upper(\`loc_name\`), upper('cvs'))`
      }

      query += ') ' // end of filters

      if (count) {
        query += '|> select count(*) as __count_alias__'
      } else {
        if (page) {
          const pages = Math.ceil(this.totalResults / CDC_API_RESULT_LIMIT)
          const currentPage = Math.max(Math.min(page, pages) - 1, 0)
          const offset = currentPage * CDC_API_RESULT_LIMIT
          query += `offset ${offset} `
        }
        query += `limit ${CDC_API_RESULT_LIMIT}`
      }

      query = encodeURIComponent(query)

      const url = `https://data.cdc.gov/api/id/5jp2-pgaw.json?$query=${query}`
      const response = await fetch(url)
      const data = await response.json()

      return data
    },

    async reloadData() {
      this.isLoading = true
      const total = await this.getCdcResults(true)
      this.totalResults = total[0] ? Number(total[0].__count_alias__) : 0
      const results = await this.getCdcResults()
      this.results = results
      this.isLoading = false
    },

    updateFilters() {
      this.$router.push({
        params: { page: null },
        query: {
          includeCVS: this.includeCVS || undefined,
          inStockOnly: this.inStockOnly || undefined,
        },
      })
    },
  },

  async mounted() {
    await this.reloadData()
  },
}
</script>

<style scoped lang="scss">
.location {
  color: var(--color-blue);
}

.total {
  color: var(--color-yellow);
}
</style>
