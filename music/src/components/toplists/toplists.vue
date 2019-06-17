<template>
  <div class="rank" ref="mRankContainer">
    <scroll ref="scroll">
      <ul>
        <li class="toplist" v-for="(item, index) in toplist" @click="selectItem(item)" :key="index">
          <div class="toplist-left">
            <img v-lazy="item.picUrl" width=100 height=100/>
          </div>
          <ul class="toplist-right">
            <li class="song" v-for="(subitem, subindex) in item.songList" :key="subindex">{{subindex+1}} {{subitem.songname}} - {{subitem.singername}}</li>
          </ul>
        </li>
      </ul>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import {toplist} from '@/api/rank'
import {mapMutations} from 'vuex'
import mScroll from '@/components/scroll/scroll'
import {songMixin} from '@/common/js/mixin.js'

export default {
  mixins: [songMixin],
  name: 'mRank',
  data () {
    return {
      toplist: []
    }
  },
  components: {
    'scroll': mScroll
  },
  mounted () {
    this._getTopList()
  },
  methods: {
    _getTopList () {
      toplist(this).then((res) => {
        this.toplist = res.body.data.topList
      }, (res) => {
        console.log(res)
      })
    },
    selectItem (item) {
      this.$router.push({path: `/rank/${item.id}`})
      this.setTopDisc(item)
      console.log(item)
    },
    handleSongs (newVal) {
      if (newVal.length) {
        this.$refs.mRankContainer.style.bottom = 60 + 'px'
        this.$refs.scroll.refresh()
      }
    },
    ...mapMutations({
      setTopDisc: 'setTopDisc'
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.rank{
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  overflow:hidden;
}
.toplist{
  display:flex;
  margin: 0 20px;
  padding-top: 20px;
  height: 100px;
}
.toplist-left{
  flex: 0 0 100px;
  width: 100px;
  height: 100px;
}
.toplist-right{
  display:flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 20px;
  height: 100px;
  overflow: hidden;
  background: #333;
  color: rgba(255,255,255,0.3);
  font-size: 12px;
  width:100%;
}
.song{
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  line-height: 26px;
  text-align: left;
}
</style>
