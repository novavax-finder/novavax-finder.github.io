<template>
  <div class="pages">
    <span v-for="page in pages" :key="page" class="page">
      <router-link
        :to="{ name: 'search', params: { page } }"
        :class="page === currentPage ? 'current' : ''"
      >
        {{ page }}
      </router-link>
    </span>
  </div>
</template>

<script>
import { CDC_API_RESULT_LIMIT } from '@/constants'

export default {
  name: 'PageNavigation',

  props: {
    totalResults: Number,
  },

  computed: {
    currentPage() {
      const page = Number(this.$route.params.page) || 1
      if (page > this.pages) {
        return this.pages
      }
      return page
    },

    pages() {
      return Math.ceil(this.totalResults / CDC_API_RESULT_LIMIT)
    },
  },
}
</script>

<style scoped lang="scss">
.page {
  display: inline-block;

  &:not(:last-of-type) {
    margin-right: 1em;
    padding-right: 1em;
    border-right: 1px solid var(--color-background-2);
  }

  a {
    text-decoration: none;
  }

  .current {
    font-weight: bold;
    color: var(--color-orange);
  }
}

.pages {
  margin-top: 1rem;
}
</style>
