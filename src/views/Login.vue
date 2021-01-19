<template>
  <el-form :model="loginForm"
           :rules="fieldRules"
           ref="loginForm"
           label-position="left"
           label-width="0px"
           class="demo-ruleForm login-container">
    <span class="tool-bar">
      <!-- 主题切换 -->
      <theme-picker style="float:right;"
                    class="theme-picker"
                    :default="themeColor"
                    @onThemeChange="onThemeChange"></theme-picker>
    </span>
    <h2 class="title"
        style="padding-left:22px;">山东天玑广告平台</h2>
    <el-form-item prop="username">
      <el-input type="text"
                v-model="loginForm.username"
                auto-complete="off"
                placeholder="用户名"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password"
                v-model="loginForm.password"
                auto-complete="off"
                placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-col :span="12">
        <el-form-item prop="captcha">
          <el-input type="test"
                    v-model="loginForm.captcha"
                    auto-complete="off"
                    placeholder="验证码, 单击图片刷新"
                    style="width: 100%;">
          </el-input>
        </el-form-item>
      </el-col>
      <el-col class="line"
              :span="1">&nbsp;</el-col>
      <el-col :span="11">
        <el-form-item>
          <img style="width: 100%;"
               class="pointer"
               :src="loginForm.src"
               @click="refreshCaptcha">
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item style="width:100%;">
      <el-button type="primary"
                 style="width:48%;"
                 @click.native.prevent="reset">重 置</el-button>
      <el-button type="primary"
                 style="width:48%;"
                 @click.native.prevent="login"
                 :loading="loading">登 录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapState } from 'vuex'
import Cookies from 'js-cookie'
import ThemePicker from '@/components/ThemePicker'
import md5 from 'js-md5'

export default {
  name: 'Login',
  components: {
    ThemePicker,
  },
  data() {
    return {
      loading: false,
      loginForm: {
        username: '',
        password: '',
        captcha: '',
        src: '',
      },
      fieldRules: {
        account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
      checked: true,
    }
  },
  methods: {
    login() {
      this.loading = true
      let userInfo = {
        username: this.loginForm.username,
        password: md5(
          md5(md5(this.loginForm.password)) + this.loginForm.captcha
        ),
        captcha: this.loginForm.captcha,
      }
      this.$api.login
        .login(userInfo)
        .then((res) => {
          if (res.message != null) {
            this.$message({
              message: res.message,
              type: 'error',
            })
          } else {
            Cookies.set('token', res.data.token) // 放置token到Cookie
            this.$store.commit('setUser', res.data) //将登录后的用户数据保存
            sessionStorage.setItem('username', userInfo.username) // 保存用户到本地会话
            this.$store.commit('menuRouteLoaded', false) // 要求重新加载导航菜单
            this.$router.push('/') // 登录成功，跳转到主页

            //将返回的用户信息拆分，获取菜单列信息
            let menu = []
            let menulist = res.data.roleList[0].menuList
            for (let i = 0; i < menulist.length; i++) {
              //   const element = res.data.roleList[0].menuList[i]
              if (menulist[i].type === 0) {
                menu.push(menulist[i])
              }
            }
            for (let i = 0; i < menulist.length; i++) {
              if (menulist[i].type === 1) {
                for (let j = 0; j < menu.length; j++) {
                  if (menu[j].id === menulist[i].parentId) {
                    menu[j].children.push(menulist[i])
                  }
                }
              }
            }
            for (let i = 0; i < menulist.length; i++) {
              if (menulist[i].type === 2) {
                for (let j = 0; j < menu.length; j++) {
                  for (let z = 0; z < menu[j].children.length; z++) {
                    if (menu[j].children[z].id === menulist[i].parentId) {
                      menu[j].children[z].children.push(menulist[i])
                    }
                  }
                }
              }
            }
            //赋值用户权限菜单
            this.$store.commit('setUserMenu', menu)
          }
        })
        .catch((res) => {
          this.$message({
            message: res.message,
            type: 'error',
          })
        })
      this.loading = false
    },
    refreshCaptcha: function () {
      this.loginForm.src =
        this.global.baseUrl +
        '/v1/users/anon/captcha.jpg?t=' +
        new Date().getTime()
    },
    reset() {
      this.$refs.loginForm.resetFields()
    },
    // 切换主题
    onThemeChange: function (themeColor) {
      this.$store.commit('setThemeColor', themeColor)
    },
    // // 获取行政区划
    // listDistrict: function () {
    //   this.$api.dictionary.listByType({ type: 'district' }).then((res) => {
    //     this.$store.commit('setDistricts', res.data)
    //   })
    // },
    // // 获取行政区划树
    // listTreeDistrict: function () {
    //   this.$api.dictionary.listTreeByType({ type: 'district' }).then((res) => {
    //     this.$store.commit('setDistrictsTree', res.data)
    //     this.refreshCaptcha()
    //   })
    // },
  },
  mounted() {
    // this.listDistrict()
    // this.listTreeDistrict()
    this.refreshCaptcha()
  },
  computed: {
    ...mapState({
      themeColor: (state) => state.app.themeColor,
    }),
  },
}
</script>

<style lang="scss" scoped>
.login-container {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 100px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  .title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }
}
</style>