<template>
  <transition name="slider">
  <div class="mSingerDetails">
    <musicList :avatar='avatar' :name="title" :trackList="discList"></musicList>
  </div>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import {cdInfo} from '@/api/recommend.js'
import {trackData} from 'common/js/tracklist.js'
import musicList from '@/components/musicList/musicList'

export default {
  data () {
    return {
      discList: []
    }
  },
  computed: {
    avatar () {
      return this.disc.imgurl
    },
    title () {
      return this.disc.dissname
    },
    ...mapGetters([
      'disc'
    ])
  },
  mounted: function () {
    this.checkDiscId()
    this._getDiscInfo(this.disc.dissid)
  },
  methods: {
    _getDiscInfo (id) {
      cdInfo(this, id).then((res) => {
        console.log(res.body.cdlist)
        let discList = res.body.cdlist[0].songlist
        for (var i = 0; i < discList.length; i++) {
        	let data = discList[i]
        	this.discList.push(trackData(data))
        }
        console.log(this.discList)
      }, (res) => {
        console.log(res)
      })
    },
    checkDiscId: function () {
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
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
