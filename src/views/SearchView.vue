<template>
  <div class="search">
    <p v-if="updateDate">
      data last updated by the CDC on
      {{ new Date(updateDate).toLocaleDateString() }}
    </p>
    <h1>
      <span class="total">{{ totalResults }}</span>
      locations in
      <span class="location">{{ location }}</span>
    </h1>

    <router-link to="/">go back</router-link>
    <br /><br />

    <input type="checkbox" v-model="inStockOnly" />
    in stock only

    <input type="checkbox" v-model="bridge" />
    bridge access program only
    <a
      class="bridge"
      target="_blank"
      href="https://www.cdc.gov/vaccines/programs/bridge/index.html"
    >
      ?
    </a>

    <page-navigation v-if="isPaginated" :totalResults="totalResults" />

    <h2 v-if="isLoading">loading...</h2>
    <h1 v-else-if="isError">Error loading CDC data. Try again later.</h1>
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
      bridge: this.$route.query.bridge || false,
      inStockOnly: this.$route.query.inStockOnly || false,
      isError: false,
      isLoading: true,
      results: [],
      totalResults: 0,
      updateDate: null,
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

    bridge() {
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

      if (this.bridge) {
        query += " and (`bridge_access_program` = 'TRUE')"
      }

      if (this.inStockOnly) {
        query += ' and (`in_stock` = true)'
      }

      query += ') ' // end of filters

      if (count) {
        query += '|> select count(*) as __count_alias__'
      } else {
        query += 'order by `quantity_last_updated` desc '
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

      this.updateDate = response.headers.get('last-modified')

      return data
    },

    async reloadData() {
      try {
        this.isLoading = true
        const total = await this.getCdcResults(true)
        this.totalResults = total[0] ? Number(total[0].__count_alias__) : 0
        const results = await this.getCdcResults()
        this.results = results
        this.isError = false
      } catch (error) {
        console.error(error)
        this.isError = true
      }

      this.isLoading = false
    },

    updateFilters() {
      this.$router.push({
        params: { page: null },
        query: {
          bridge: this.bridge || undefined,
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

.bridge {
  background-color: var(--color-blue);
  color: white;
  padding: 0.35em;
  border-radius: 0.5em;
  text-decoration: none;
  font-size: 0.75rem;
}
</style>
