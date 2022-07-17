<template>
  <span v-if="value" class="icon yes">&#10004;</span>
  <span v-else class="icon no">X</span>
</template>

<script>
export default {
  name: 'BooleanIcon',
  props: {
    value: Boolean,
  },
}
</script>

<style scoped lang="scss">
.icon {
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  border-radius: 100%;
  color: var(--color-foreground);
  width: 0.8rem;
  height: 0.8rem;
  font-size: 0.6rem;
  padding: 0.1rem;
}

.no {
  background-color: var(--color-red);
}

.yes {
  background-color: var(--color-green);
}
</style>
