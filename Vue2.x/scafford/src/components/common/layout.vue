<template>
  <div id="_layout">
    <div class="side">
      <div>Side Area</div>
      <slot name="side-area"></slot>
    </div>
    <div class="main">
      <div class="top">
        <div>Hello: <b>{{username}}</b></div>
        <button @click.prevent="logout()">Logout</button>
      </div>
      <div class="content">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  import * as types from '../../store/types'

  export default {
    computed: {
//      username: this.$store.state.user.username
      username: ''
    },
    methods: {
      logout() {
        this.$store.commit(types.LOGOUT);
        this.$router.push({
          path: 'login'
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  #_layout {
    display: flex;
    height: 100vh;
  }

  .side {
    width: 25%;
    background: antiquewhite;
    padding: 1rem;
  }

  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    .top {
      display: flex;
      justify-content: space-between;
      background: lightblue;
      padding: 1rem;
    }
    .content {
      padding: 1rem;
      flex: 1;
      background: whitesmoke;
    }
  }

</style>
