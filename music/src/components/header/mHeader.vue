<template>
  <div class="mHeader">
    <div class="mHeader-logo"></div>
    <div class="mHeader-name">Chicken Music</div>
    <router-link class="mHeader-user" to="/user"><i class="icon-mine"></i></router-link>
  </div>
</template>

<script>
export default {
  name: 'mHeader'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.color{
  color:red;
  font-size:44px;
}
.mHeader{
  text-align:center;
  line-height: 44px;
  font-size: 0;
  color: $color-theme;
}
.mHeader-logo{
  display:inline-block;
  @include bg-image("./logo");
  width:30px;
  height:32px;
  background-size:100% 100%;
  vertical-align: top;
  margin-top: 6px;
  margin-right: 9px;
}
.mHeader-name{
  display: inline-block;
  line-height:44px;
  text-align:center;
  font-size: $font-size-large;
  vertical-align: top;
}
.mHeader-user{
  position: absolute;
  top: 0;
  right: 0;
}
.icon-mine{
  display: block;
  padding: 12px;
  font-size: 20px;
  color: $color-theme;
}
</style>
