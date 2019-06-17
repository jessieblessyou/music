<template>
    <scroll :pullup="pullup" @newData="getNewData" ref="scroll">
      <ul>
        <li class="suggest-item" v-for="(item,index) in searchList" @click="selectItem(item)" :key="index">
          <i class="suggest-icon" :class="getDisplayIcon(item)"></i>
          <div class="suggest-name" v-html="getDisplayName(item)"></div>
        </li>
        <div class="suggest-loading">
         <loading v-show="showLoading"></loading>
        </div>
      </ul>
      <div v-show="!searchList.length && !showLoading">no result</div>
    </scroll>
</template>

<script>
import {searchResult} from '@/api/search.js'
import {trackData} from '@/common/js/tracklist.js'
import scroll from '@/components/scroll/scroll'
import loading from '@/components/loading/loading'
import {Singer} from '@/common/js/singer.js'
import {mapMutations, mapActions} from 'vuex'

export default {
  name: 'mSuggest',
  props: {
    query: {
      type: String,
      default: ''
    }
  },
  components: {
    'scroll': scroll,
    'loading': loading
  },
  data () {
    return {
      searchList: '',
      pullup: true,
      page: 1,
      showLoading: false,
      curnum: 20,
      totalnum: 0
    }
  },
  watch: {
    query (newVal) {
      this.showLoading = true
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this._searchResult(newVal, 1)
      }, 3000)
    }
  },
  methods: {
    _searchResult (name, page) {
      let ret = []
      let pushZhida = []
      searchResult(this, name, page).then((res) => {
        console.log(res.body.data)
        this.totalnum = res.body.data.song.totalnum
        let zhida = res.body.data.zhida
        if (res.body.data.song.list.length === 0) {
          this.showLoading = false
          return
        }
        if (zhida.singername === name) {
          pushZhida = zhida
        }
        res.body.data.song.list.forEach((item) => {
          ret.push(trackData(item))
        })
        if (page > 1) {
          ret.forEach((item) => {
            this.searchList.push(item)
          })
        } else {
          this.searchList = ret.slice()
          if (pushZhida.length === 0) {
            return
          }
          this.searchList.unshift(pushZhida)
        }
        this.showLoading = false
        console.log(this.showLoading)
      }, (res) => {
        console.log(res)
      })
    },
    getDisplayName (item) {
      if (item.singername === this.query) {
        return item.singername
      }
      if (item.singer) {
        return item.name + '-' + item.singer[0].name
      }
    },
    getDisplayIcon (item) {
      if (item.singername === this.query) {
        return 'icon-mine'
      }
      if (item.singer) {
        return 'icon-music'
      }
    },
    getNewData () {
      let num = this.curnum * this.page
      if (num >= this.totalnum) {
        return
      }
      this.page++
      this.showLoading = true
      this._searchResult(this.query, this.page)
    },
    selectItem (item) {
      if (item.singername) {
        let singer = new Singer(item.singermid, item.singername)
        this.$router.push({path: `/search/${singer.mid}`})
        this.setSinger(singer)
      } else {
        this.selectTrack(item)
      }
      this.saveSearch(this.query)
      this.$emit('clearBlur')
    },
    ...mapMutations({
      setSinger: 'setSinger'
    }),
    ...mapActions([
      'selectTrack',
      'saveSearch'
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.suggest{
  position:fixed;
  bottom:0
}
.suggest-item{
  display: flex;
  -align-items: center;
  padding-bottom: 20px;
  text-align: left;
  -width:100%;
  position:relative;
  margin-left:30px;
  margin-right:30px;
  right:0;
}
.suggest-icon{
  font-size: 14px;
  color: $color-text-d;
  width: 30px;
}
.suggest-name{
  flex: 1;
  font-size: $font-size-medium;
  color: $color-text-d;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position:relative;
}
.suggest-loading{
  height:50px;
  position: relative;
}
</style>
