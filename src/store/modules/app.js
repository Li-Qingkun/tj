export default {
  state: {
    appName: "天玑广告平台", // 应用名称
    themeColor: "#14889A", // 主题颜色
    oldThemeColor: "#14889A", // 上一次主题颜色
    collapse: false, // 导航栏收缩状态
    menuRouteLoaded: false, // 菜单和路由是否已经加载
    districts: [], // 行政区划
    districtsTree: [], // 行政区划树
    user: {}, //登录后的用户信息
    userMenu: []
  },
  getters: {
    collapse(state) {
      // 对应着上面state
      return state.collapse;
    }
  },
  mutations: {
    onCollapse(state) {
      // 改变收缩状态
      state.collapse = !state.collapse;
    },
    setThemeColor(state, themeColor) {
      // 改变主题颜色
      state.oldThemeColor = state.themeColor;
      state.themeColor = themeColor;
    },
    menuRouteLoaded(state, menuRouteLoaded) {
      // 改变菜单和路由的加载状态
      state.menuRouteLoaded = menuRouteLoaded;
    },
    setUser(state, data) {
      state.user = data;
    },
    setUserMenu(state, data) {
      state.userMenu = data;
    },
    setDistricts(state, params) {
      state.districts = params;
    },
    setDistrictsTree(state, params) {
      state.districtsTree = params;
    }
  },
  actions: {}
};
