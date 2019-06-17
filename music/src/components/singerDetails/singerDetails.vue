<template>
  <transition name="slider">
  <div class="mSingerDetails">
    <musicList :avatar='avatar' :name="title" :trackList="trackList"></musicList>
  </div>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import {playerTrack} from '@/api/playerTrack.js'
import {trackData} from 'common/js/tracklist.js'
import musicList from '@/components/musicList/musicList'

export default {
  data () {
    return {
      trackList: []
    }
  },
  mounted: function () {
    this.checkSingerId()
    this._getTracklists(this.singer.mid)
  },
  methods: {
    _getTracklists (mid) {
      if (!mid) {
        return
      }
      playerTrack(this, mid).then(function (res) {
        let tracklists = res.body.data.list
        for (var i = 0; i < tracklists.length; i++) {
          let data = tracklists[i].musicData
          this.trackList.push(trackData(data))
        }
      }, function (res) {
        console.log(res)
      })
    },
    checkSingerId: function () {
      if (!this.singer.mid) {
        this.$router.back(-1)
      }
    }
  },
  computed: {
    avatar () {
      return this.singer.avatar
    },
    title () {
      return this.singer.name
    },
    ...mapGetters([
      'singer'
    ])
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
