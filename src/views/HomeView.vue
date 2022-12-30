<template>
  <div class="home">
    <h2>I want <span class="novavax">Novavax</span> in</h2>
    <div class="search-form" @keyup.enter="search">
      <input type="text" placeholder="Any city" v-model="city" />
      <select v-model="state">
        <option disabled value="">State</option>
        <option v-for="state in stateList" :value="state" :key="state">
          {{ state }}
        </option>
      </select>
      <button :disabled="!state" @click="search">GO</button>
    </div>
  </div>
</template>

<script>
import { STATES } from '@/constants'

export default {
  name: 'HomeView',

  data() {
    return {
      city: '',
      state: '',
      stateList: STATES,
    }
  },

  methods: {
    search() {
      if (!this.state) {
        return
      }

      const route = [this.state, this.city || 'all']
        .map((value) => encodeURIComponent(value.trim().toLowerCase()))
        .join('/')

      this.$router.push(`/${route}`)
    },
  },
}
</script>

<style scoped lang="scss">
.home {
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: center;
  flex-direction: column;

  @media (min-width: 720px) {
    margin-left: 0.5em;
    flex-direction: row;
  }
}

.novavax {
  color: var(--color-blue);
}

.search-form {
  @media (min-width: 720px) {
    margin-left: 0.5em;
  }

  input,
  select,
  button {
    height: 3rem;
    margin: 0 0.25em;
  }

  button {
    padding: 0 1em;
    background-color: var(--color-green);
    border: none;

    &:disabled {
      background-color: var(--color-background-1);
      color: var(--color-background-2);
    }
  }

  input,
  select {
    border: none;
    padding: 0 1em;
    background-color: var(--color-background-0);
    color: var(--color-foreground);
  }
}
</style>
