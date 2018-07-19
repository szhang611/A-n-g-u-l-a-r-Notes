<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
  /* 3rd parties styles*/
  @import "./scss/ngprime/ngprime_reset";
  @import "./scss/bs/adopted_bootstrap";

  /* PWS styles*/
  @import "./scss/pwc_variables";
  @import "./scss/pwc_reset";
  @import "./scss/pwc";
</style>
