<template>
  <div class="stats">
    <h1 v-if="isLoading">Loading...</h1>
    <h1 v-else-if="isError">Error loading CDC data. Try again later.</h1>
    <div v-else>
      <h1 class="administered">
        <strong>{{ stats.rollout.administered }}</strong>
        doses administered
      </h1>
      <h2 class="distributed">
        <strong>{{ stats.rollout.distributed }}</strong>
        doses distributed
      </h2>
      <h1 class="inStock">
        <strong>{{ stats.availability.inStock }}</strong>
        locations in stock
      </h1>
      <h2 class="total">
        <strong>{{ stats.availability.total }}</strong>
        total locations
      </h2>
    </div>
    <a href="/">go back</a>
  </div>
</template>

<script>
import mapValues from 'lodash/mapValues'

export default {
  name: 'StatsView',

  data() {
    return {
      isError: false,
      isLoading: true,
      stats: {
        availability: {
          inStock: '0',
          total: '0',
        },
        rollout: {
          administered: '0',
          distributed: '0',
        },
      },
    }
  },

  methods: {
    async getRolloutStats() {
      const response = await fetch(
        'https://data.cdc.gov/api/id/unsk-b7fc.json?$query=' +
          encodeURIComponent(
            "select *, :id where (upper(`location`) = upper('us')) limit 1"
          )
      )
      const data = await response.json()
      return data[0]
    },

    async getAvailabilityStats(inStockOnly = false) {
      let query = `select *, :id where ((contains(upper(\`med_name\`), upper('novavax')))`
      if (inStockOnly) {
        query += ' and (`in_stock` = true)'
      }
      query += ` and not contains(upper(\`loc_name\`), upper('cvs'))`
      query += ') ' // end of filters
      query += '|> select count(*) as __count_alias__'
      query = encodeURIComponent(query)

      const url = `https://data.cdc.gov/api/id/5jp2-pgaw.json?$query=${query}`
      const response = await fetch(url)
      const data = await response.json()
      return Number(data[0].__count_alias__).toLocaleString()
    },
  },

  async mounted() {
    try {
      const [rollout, inStock, total] = await Promise.all([
        this.getRolloutStats(),
        this.getAvailabilityStats(true),
        this.getAvailabilityStats(false),
      ])

      this.stats.rollout = mapValues(
        {
          administered: rollout.administered_novavax,
          distributed: rollout.distributed_novavax,
        },
        (value) => Number(value).toLocaleString()
      )

      this.stats.availability = { inStock, total }
    } catch (error) {
      console.error(error)
      this.isError = true
    }

    this.isLoading = false
  },
}
</script>

<style scoped lang="scss">
.stats {
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: center;
  flex-direction: column;
}

.administered strong {
  color: var(--color-blue);
}

.distributed strong {
  color: var(--color-aqua);
}

.inStock strong {
  color: var(--color-orange);
}

.total strong {
  color: var(--color-yellow);
}
</style>
