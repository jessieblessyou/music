<template>
  <div id="app">
    <mHeader></mHeader>
    <mTab></mTab>
    <mPlayer></mPlayer>
  </div>
</template>

<script>
import mHeader from '@/components/header/mHeader'
import mTab from '@/components/tab/tab'
import mPlayer from '@/components/player/player'

export default {
  name: 'App',
  components: {
    'mHeader': mHeader,
    'mTab': mTab,
    'mPlayer': mPlayer
  }
}
</script>

<style lang="scss">
body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color:$color-background;
  line-height:1;
}
</style>
