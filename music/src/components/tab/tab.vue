<template>
  <div class="mTab">
    <div class="mTab-nav">
      <router-link to="/recommend" class="tab-item"><span class="text">推荐</span></router-link>
      <router-link to="/singer" class="tab-item"><span class="text">歌手</span></router-link>
      <router-link to="/rank" class="tab-item"><span class="text">排行</span></router-link>
      <router-link to="/search" class="tab-item"><span class="text">搜索</span></router-link>
    </div>
    <keep-alive>
       <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'mTab'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.mTab-nav{
  display:flex;
  width:100%;
  height: 44px;
  line-height: 44px;
  font-size: $font-size-medium;
}
.tab-item{
  flex:1;
  text-align: center;
}
.text{
  padding-bottom: 5px;
  color: $color-text-l;
}
.router-link-active .text{
  color: $color-theme;
  border-bottom: 2px solid $color-theme;
}
</style>
