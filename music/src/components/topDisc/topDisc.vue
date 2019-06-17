<template>
  <transition name="slider">
  <div class="mSingerDetails">
    <musicList :avatar='avatar' :name="title" :trackList="topDiscList" :rank="rank"></musicList>
  </div>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import {topDiscInfo} from '@/api/rank.js'
import {trackData} from 'common/js/tracklist.js'
import musicList from '@/components/musicList/musicList'

export default {
  data () {
    return {
      topDiscList: [],
      rank: true
    }
  },
  computed: {
    avatar () {
      if (this.topDiscList.length) {
        return this.topDiscList[0].image
      }
    },
    title () {
      return this.topDisc.topTitle
    },
    ...mapGetters([
      'topDisc'
    ])
  },
  mounted: function () {
    this.checkDiscId()
    this._getTopDiscInfo(this.topDisc.id)
    console.log(this.topDisc)
  },
  methods: {
    _getTopDiscInfo (id) {
      if (!id) {
        return
      }
      topDiscInfo(this, id).then((res) => {
        let topDiscList = res.body.songlist
        console.log(topDiscList)
        for (var i = 0; i < topDiscList.length; i++) {
          let data = topDiscList[i].data
          this.topDiscList.push(trackData(data))
        }
        console.log(this.topDiscList[0].image)
      }, (res) => {
        console.log(res)
      })
    },
    checkDiscId: function () {
      if (!this.topDisc.id) {
        this.$router.push('/rank')
      }
    }
  },
  components: {
    'musicList': musicList
  }
}
</script>

<style lang="scss">
.mSingerDetails{
  color:white;
  position: fixed;
  width: 100%;
  height: 100%;
  top:0;
  left:0;
  background: $color-background;
  z-index:100;
}
.slider-enter-active, .slider-leave-active {
  transition: left .5s;
}
.slider-enter, .slider-leave-to{
  left:100%;
}
</style>
