<template>
  <main>
    <router-view />
  </main>
  <footer>
    <span v-for="(link, index) in footerLinks" :key="index">
      <a :href="link.url" :target="link.url[0] !== '/' ? '_blank' : undefined">
        {{ link.text }}
      </a>
    </span>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      footerLinks: [
        {
          text: 'data provided by the CDC',
          url: 'https://data.cdc.gov/Vaccinations/Vaccines-gov-COVID-19-vaccinating-provider-locatio/5jp2-pgaw',
        },
        {
          text: 'rollout stats',
          url: '/#/stats',
        },
        {
          text: 'view source code',
          url: 'https://www.github.com/novavax-finder/novavax-finder.github.io',
        },
        {
          text: 'report a technical issue',
          url: 'https://www.reddit.com/message/compose/?to=poop_sox',
        },
        {
          text: 'report a data issue',
          url: 'mailto:vaccinefinder@cdc.gov',
        },
        {
          text: 'contribute',
          url: 'https://www.github.com/novavax-finder/novavax-finder.github.io/pulls',
        },
      ],
    }
  },
}
</script>

<style lang="scss">
:root {
  --color-aqua: #689d6a;
  --color-background: #1d2021;
  --color-background-0: #282828;
  --color-background-1: #3c3836;
  --color-background-2: #504945;
  --color-blue: #458588;
  --color-foreground: #ebdbb2;
  --color-gray: #a89984;
  --color-green: #98971a;
  --color-orange: #d65d0e;
  --color-purple: #b16286;
  --color-red: #cc241d;
  --color-yellow: #d79921;
}

#app,
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--color-foreground);
  background-color: var(--color-background);
  text-align: center;
}

#app {
  display: flex;
  flex-direction: column;

  > main {
    flex: 1 0 auto;
    padding: 1rem;
  }

  > footer {
    flex-shrink: 0;
    padding: 0.5rem;
    background-color: var(--color-background-0);

    span:not(:last-of-type) {
      border-right: 1px solid var(--color-background-2);
      margin-right: 0.5em;
      padding-right: 0.5em;
      display: inline-block;
    }
  }
}

a {
  font-weight: bold;
  color: var(--color-gray);

  &:hover {
    color: var(--color-aqua);
  }
}
</style>
