<template>
  <div class="search-box">
  <i class="icon-search"></i>
  <input type="text" class="search-input" :placeholder="placeholder" v-model="query" ref="inputbox"/>
  <i class="icon-dismiss" v-show="query" @click="clear()"></i>
  </div>
</template>

<script>
export default {
  name: 'mSearchBox',
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    },
    hotQuery: String
  },
  data () {
    return {
      query: ''
    }
  },
  watch: {
    query (newVal) {
      this.$emit('getText', newVal)
    },
    hotQuery (newVal) {
      this.query = newVal
    }
  },
  methods: {
    clear () {
      this.query = ''
    },
    setQuery (txt) {
      this.query = txt
    },
    blur () {
      this.$refs.inputbox.blur()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.search-box{
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 40px;
  background: $color-highlight-background;
  border-radius: 6px;
}
.icon-search{
  font-size: 24px;
  color: $color-background;
}
.search-input{
  flex: 1;
  margin: 0 5px;
  line-height: 18px;
  background: $color-highlight-background;
  font-size: 14px;
  color: #fff;
}
.search-box::placeholder{
  color: $color-text-d;
}
.icon-dismiss{
  font-size: 16px;
  color: $color-background;
}
</style>
