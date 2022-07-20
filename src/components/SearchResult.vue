<template>
  <div class="result" :class="result.in_stock ? 'in-stock' : 'out-of-stock'">
    <div class="section">
      {{ result.loc_name }}
      <br />
      {{ result.loc_admin_street1 }}
      <br />
      {{ result.loc_admin_city }}, {{ result.loc_admin_state }}
      {{ result.loc_admin_zip }}
      <br />
      {{ result.loc_phone }}
      <br />
      <a :href="result.web_address" target="_blank">website</a> |
      <a :href="result.pre_screen" target="_blank">prescreen</a> |
      <a :href="googleMapsLink" target="_blank">map</a>
      <!-- <br /><br />
      Minimum age: {{ result.min_age_years }} -->
    </div>

    <div class="section hours">
      <span v-for="day in daysOfWeek" :key="day">
        <span class="day">{{ day.substr(0, 3) }}</span>
        {{ result[`${day.toLowerCase()}_hours`] || 'closed' }}
        <br />
      </span>
    </div>

    <div class="section">
      <boolean-icon :value="result.in_stock" />
      {{ result.in_stock ? 'in' : 'out of' }} stock ({{ lastUpdated }})
      <br />
      <boolean-icon :value="result.offers_free_masks" /> free masks
      <br />
      <boolean-icon :value="result.insurance_accepted" /> insurance accepted
      <br />
      <boolean-icon :value="result.walkins_accepted" /> walkins accepted
    </div>
  </div>
</template>

<script>
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import locale from 'date-fns/esm/locale/en-US'
import pick from 'lodash/pick'
import values from 'lodash/values'

import BooleanIcon from '@/components/BooleanIcon'

export default {
  name: 'SearchResult',

  components: {
    BooleanIcon,
  },

  props: {
    result: Object,
  },

  computed: {
    daysOfWeek() {
      return [...Array(7).keys()].map((i) => locale.localize.day(i))
    },

    googleMapsLink() {
      const address = values(
        pick(this.result, [
          'loc_admin_street1',
          'loc_admin_city',
          'loc_admin_state',
          'loc_admin_zip',
        ])
      ).join(' ')
      const baseUrl = 'https://www.google.com/maps/dir/?api=1'
      return `${baseUrl}&destination=${address}`
    },

    lastUpdated() {
      const date = this.result.quantity_last_updated
      return formatDistanceToNow(new Date(date), { addSuffix: true })
    },
  },
}
</script>

<style scoped lang="scss">
.day {
  display: inline-block;
  width: 3em;
}

.section {
  &:not(:last-of-type) {
    margin-bottom: 1rem;

    @media (min-width: 720px) {
      margin-bottom: 0;
    }
  }
}

.result {
  max-width: 1000px;
  margin: 1rem auto;
  padding: 1rem;
  display: flex;
  border: 1px solid var(--color-background-1);
  border-left-width: 5px;
  border-radius: 0.5rem;
  text-align: left;
  flex-direction: column;

  @media (min-width: 720px) {
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
  }

  &.in-stock {
    border-left-color: var(--color-green);
  }

  &.out-of-stock {
    border-left-color: var(--color-red);
  }
}
</style>
