<template>
  <div id="login-form">
    <form class="form-wrapper" @submit.prevent="checkForm" @keyup.enter="checkForm">

      <div class="title item">
        Member Login
      </div>

      <input class="input-center item"
             placeholder="Username"
             v-model="user.username"/>
      <div class="error" v-if="!user.username">
        Please enter the username
      </div>

      <input class="input-center item"
             placeholder="Password"
             type="password"
             v-model="user.password"/>
      <div class="error" v-if="!user.password">
        Please enter the password
      </div>
      <button class="big-button item"
              :disabled="isDisabled"
              type="submit">
        Submit
      </button>
    </form>
  </div>
</template>

<script>
  import * as types from '../../store/types'

  export default {
    data () {
      return {
        user: {
          username: '',
          password: ''
        }
      }
    },
    methods: {
      checkForm () {
        this.axios.post('/login', this.user)
          .then(response => {
            console.log(response);

            this.$store.commit({
              type: types.LOGIN,
              token: response.data.token,
              user: this.user
            });

            let redirect = decodeURIComponent(this.$route.query.redirect || '/');
            this.$router.push({
              path: redirect
            })
          })
          .catch(error => {
            console.error(error);
          });
      }
    },
    computed: {
      isDisabled() {
        return !(this.user.username && this.user.password)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../scss/pwc_variables";
  #login-form {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    padding: 0 2rem;
  }

  .item{
    margin: 1rem 0;
  }

  .title{
    text-align: center;
    color: $pwc_orange_2;
  }

  .error{
    color:brown;
  }
</style>
