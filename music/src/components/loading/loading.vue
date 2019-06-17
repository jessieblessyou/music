<template>
  <div class="loading">
  <img src="./loading.gif" width="24" height="24">
  <p class="desc">{{message}}</p>
  </div>
</template>

<script>
export default {
  name: 'mLoading',
  props: {
    message: {
      type: String,
      default: '加载中……'
    }
  }
}
</script>

<style lang="scss" scoped>
.loading{
  width: 100%;
  text-align: center;
}
.desc{
  line-height: 20px;
  font-size: $font-size-small;
  color: $color-text-l;
}
</style>
