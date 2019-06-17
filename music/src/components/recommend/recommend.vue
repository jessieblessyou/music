<template>
  <div class="mRecommend" ref="mRecommendContainer">
    <scroll ref="scroll">
      <div>
        <div class="rotation">
          <carousel :carouselData="recommends" v-if="recommends.length">
            <div v-for="(item,index) in recommends" :key="index" class="carousel-item">
              <a :href="item.linkUrl" class="carousel-link">
                <img :src="item.picUrl" class="carousel-image" @load="loadImage()"/>
              </a>
            </div>
          </carousel>
        </div>
        <div class="hot-recommend">
          <h1 class="hot-title">热门歌单推荐</h1>
            <ul>
              <li v-for="(item,index) in playlists" :key="index" class="list-container" @click="selectItem(item)">
                 <img v-lazy="item.imgurl" class="list-image" width="60px" height="60px"/>
                 <div class="list-info">
                  <div class="list-name">{{item.creator.name}}</div>
                  <div class="list-dissname">{{item.dissname}}</div>
                </div>
              </li>
            </ul>
            <div v-show="!playlists.length" class="loading-container">
              <loading></loading>
            </div>
        </div>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'
import mHeader from '@/components/carousel/carousel'
import mScroll from '@/components/scroll/scroll'
import loading from '@/components/loading/loading'
import {recommend, cdInfo} from '@/api/recommend.js'
import {playlist} from '@/api/playlist.js'
import {songMixin} from '@/common/js/mixin.js'

export default {
  mixins: [songMixin],
  name: 'mRecommend',
  components: {
    'carousel': mHeader,
    'scroll': mScroll,
    'loading': loading
  },
  data () {
    return {
      recommends: [],
      playlists: []
    }
  },
  mounted: function () {
    this._getRecommends()
    this._getPlaylists()
  },
  methods: {
    _getRecommends: function () {
      recommend(this).then(function (res) {
        this.recommends = res.body.data.slider
      }, function (res) {
      })
    },
    _getPlaylists: function () {
      playlist(this).then(function (res) {
        this.playlists = res.body.data.list
        console.log(this.playlists)
      }, function (res) {
        console.log(res)
      })
    },
    _getCDInfo () {
      cdInfo(this).then((res) => {
        console.log(res.body.cdlist[0])
      }, (res) => {
        console.log(res)
      })
    },
    loadImage: function () {
      if (!this.imageStatus) {
        this.imageStatus = true
        this.$refs.scroll.refresh()
      }
    },
    handleSongs (newVal) {
      if (newVal.length) {
        this.$refs.mRecommendContainer.style.bottom = 60 + 'px'
        this.$refs.scroll.refresh()
      }
    },
    selectItem: function (item) {
      this.$router.push({path: `/recommend/${item.dissid}`})
      this.setDisc(item)
    },
    ...mapMutations({
      setDisc: 'setDisc'
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.mRecommend{
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  overflow:hidden;
}
.hot-title{
  height: 65px;
  line-height: 65px;
  text-align: center;
  font-size: 14px;
  color: #ffcd32;
}
.list-container{
  display:flex;
  align-items: center;
  padding: 0 20px 20px 20px;
  box-sizing: border-box;
}
.list-image{
  padding-right: 20px;
}
.list-info{
  text-align:left;
  font-size: $font-size-medium;
}
.list-name{
  margin-bottom: 10px;
  color: $color-text;
}
.list-dissname{
  color: $color-text-d;
}
.loading-container{
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}
</style>
