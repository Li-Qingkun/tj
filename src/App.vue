<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import store from '@/store'
import router from '@/router'
import { addDynamicRoutes } from '@/router'
export default {
  name: 'App',
  created() {
    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('store', JSON.stringify(this.$store.state))
    })

    if (localStorage.getItem('store')) {
      store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(localStorage.getItem('store'))
        )
      )
      //   let res = this.$store.state.app.userMenu
      this.$api.menu.tree().then((res) => {
        res = res.data
        //赋值菜单树
        for (let i = 0; i < res.length; i++) {
          for (let j = 0; j < res[i].children.length; j++) {
            res[i].children[j].children = []
          }
        }
        // 添加动态路由
        let dynamicRoutes = addDynamicRoutes(res)
        // 处理静态组件绑定路由+
        router.options.routes[0].children = router.options.routes[0].children.concat(
          dynamicRoutes
        )
        router.addRoutes(router.options.routes)
        // 保存加载状态
        store.commit('menuRouteLoaded', true)
        // 保存菜单树
        //   store.commit('setNavTree', res)
      })
    }
  },
  //   mounted() {
  //     window.addEventListener('unload', this.saveState)
  //   },
  //   methods: {
  //     saveState() {
  //       sessionStorage.setItem('state', JSON.stringify(this.$store.state))
  //     },
  //   },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
