<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{ isLogin ? "Sign in" : "Sign up" }}</h1>
          <p class="text-xs-center">
            <!-- <a href="">Have an account?</a> -->
            <nuxt-link v-if="isLogin" to="/register"
              >Need an account?</nuxt-link
            >
            <nuxt-link v-else to="/login">Have an account?</nuxt-link>
          </p>

          <ul class="error-messages">
            <template v-for="(messages, field) in errors">
              <li v-for="(message, index) in messages" :key="index">
                {{ field }} {{ message }}
              </li>
            </template>
          </ul>

          <form
            @submit.prevent="onHandleSubmit"
          >
            <fieldset class="form-group" v-if="!isLogin">
              <input
                class="form-control form-control-lg"
                v-model="user.username"
                type="text"
                placeholder="Your Name"
                required
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                v-model="user.email"
                type="email"
                placeholder="Email"
                required
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                v-model="user.password"
                type="password"
                placeholder="Password"
                required
                minlength="8"
              />
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              {{ isLogin ? "Sigin in" : "Sigin up" }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login, register } from "@/api/user";
import {mapMutations} from 'vuex'

// 仅在客户端加载 js-cookie 包
const Cookie = process.client ? require("js-cookie") : undefined;
export default {
  middleware: 'noAuthenticated',
  name: "LoginIndex",
  data() {
    return {
      user: {
        username: "zhanghang123456",
        email: "z15301502328@163.com",
        password: "12345678",
      },
      errors: {},
    };
  },

  computed: {
    isLogin() {
      return this.$route.name === "login";
    },
  },

  methods: {
    ...mapMutations(['setUser']),
     async onHandleSubmit() {
      try {
        const { data } = this.isLogin
          ? await login({
              user: this.user,
            })
          : await register({
              user: this.user,
            });

            // 存储状态
            /**
             * 存储状态
             * 1. 在同构渲染当中不再想传统的客户端开发模式那样直接把用户的数据存储在本地或者vuex当中了
             * 2. 因为要考虑到既要咋客户端渲染 又要在服务端渲染
             */
            Cookie.set('user',JSON.stringify(data.user))
            this.setUser(data.user)
            this.$router.push("/");
      } catch (e) {
        this.errors = e.response.data.errors;
      }
    },
  },
};
</script>

<style>
</style>