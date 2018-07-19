<template>
  <div id="login">
    <a class="docs-link" v-if="isDev" routerLink="/docs">[ Dev Docs ]</a>
    <div class="center row">
      <div class="col-6 logo">
        <img src="../../assets/images/logo.svg" />
      </div>
      <div class="col-6 right">
        <div class="line"></div>
        <login-form></login-form>
      </div>
    </div>
  </div>
</template>

<script>
  import loginForm from './login-form.vue'

  export default {
    data () {
      return {
        name: 'Login Component.',
        isDev: false,
      }
    },
    components: {
      loginForm
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../scss/pwc_variables";
  #login {
    background: linear-gradient(to top right, $pwc_orange_2, $pwc_orange_10);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .center {
    height: 50vh;
    width: 60vw;
    border-radius: 0.5rem;
    top: 25vh;
    position: relative;
    left: 20vw;
    background: white;
  }

  .right {
    display: flex;
  }

  .line {
    border-left: solid 1px $pwc_orange_2;
    margin: 3rem 0;
  }

  .logo {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  img {
    width: 60%;
    height: auto;
  }
  }

  login-form {
    flex: 1;
  }

  .docs-link {
    color: white;
    display: block;
    text-align: center;
    text-decoration: none;
  &:hover {
     text-decoration: underline;
   }
  }

</style>
