<template>
  <div class="page-container"
       style="width:99%;margin-top:15px;">
    <el-carousel :interval="3000"
                 type="card"
                 height="450px"
                 class="carousel">
      <el-carousel-item class="carousel-item-intro">
        <h2>项目介绍</h2>
        <ul>
          <li>牛魔王环保平台</li>
          <li>牛魔王环保APP</li>
          <li>牛魔王环保桌面端</li>
        </ul>
        <div><img src="@/assets/logo.png"
               style="width:120px;height:120px;padding-top:15px;" /></div>
      </el-carousel-item>
      <el-carousel-item class="carousel-item-func">
        <h2>功能计划</h2>
        <ul>
          <li>✔ 企业综合：管理企业、企业用户、排放口、电子屏等信息</li>
          <li>✔ 环保平台：管理环保平台地址等信息</li>
          <li>✔ 系统管理：待完善</li>
          <li>...</li>
        </ul>
      </el-carousel-item>
      <el-carousel-item class="carousel-item-env">
        <h2>牛魔王环保APP</h2>
        <ul>
          <li>待开发</li>
        </ul>
        <h2>牛魔王桌面端</h2>
        <ul>
          <li>待开发</li>
          <li>...</li>
        </ul>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  components: {},
  methods: {},
}
</script>

<style>
.carousel {
  padding-left: 20px;
  padding-right: 20px;
  margin-right: 20px;
}
.carousel h2 {
  color: #475669;
  font-size: 22px;
  opacity: 1.75;
  line-height: 100px;
  margin: 0;
}
.carousel ul {
  color: #475669;
  font-size: 15px;
  opacity: 1.75;
  line-height: 40px;
  margin: 0;
}
.carousel-item-intro h2 {
  color: #ffffff;
  font-size: 22px;
  opacity: 1.75;
  line-height: 80px;
  margin: 0;
}
.carousel-item-intro ul {
  color: #ffffff;
  font-size: 15px;
  opacity: 1.75;
  line-height: 65px;
  padding: 5px;
  margin: 0;
}
.carousel-item-func h2 {
  color: #3f393b;
  font-size: 22px;
  opacity: 1.75;
  line-height: 50px;
  margin: 0;
}
.carousel-item-func ul {
  color: #3f393b;
  font-size: 15px;
  opacity: 1.75;
  line-height: 30px;
  text-align: left;
  padding-left: 90px;
  margin: 0;
}
.carousel-item-env h2 {
  color: #475669;
  font-size: 22px;
  opacity: 1.75;
  line-height: 50px;
  margin: 0;
}
.carousel-item-env ul {
  color: #475669;
  font-size: 15px;
  opacity: 1.75;
  line-height: 35px;
  text-align: left;
  padding-left: 110px;
  margin: 0;
}
.carousel-item-intro {
  background-color: #19aaaf73;
  -webkit-border-radius: 25px;
  border-radius: 25px;
  -moz-border-radius: 15px;
  background-clip: padding-box;
  box-shadow: 0 0 25px #a3b3b965;
}
.carousel-item-func {
  background-color: #19aaaf73;
  -webkit-border-radius: 25px;
  border-radius: 25px;
  -moz-border-radius: 15px;
  background-clip: padding-box;
  box-shadow: 0 0 25px #a3b3b965;
}
.carousel-item-env {
  background-color: #19aaaf73;
  -webkit-border-radius: 25px;
  border-radius: 25px;
  -moz-border-radius: 15px;
  background-clip: padding-box;
  box-shadow: 0 0 25px #a3b3b965;
}
.carousel-item-intro {
  background-color: #b95e5e;
}
.carousel-item-func {
  background-color: #52c578;
}
.carousel-item-env {
  background-color: #41a7b9;
}
</style>