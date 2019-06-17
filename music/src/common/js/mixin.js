import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from '@/common/js/playMode'

export const songMixin = {
  computed: {
    ...mapGetters({
      songs: 'trackList'
    })
  },
  activated () {
    this.handleSongs(this.songs)
  },
  watch: {
    songs (newVal) {
    	this.handleSongs(newVal)
    }
  },
  methods: {
  	handleSongs (val) {
  		throw new Error('component must implement handlePlaylist method')
  	}
  }
}

export const playerMixin = {
  computed: {
    ...mapGetters([
      'fullScreen',
      'trackList',
      'currentTrack',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList',
      'favoriteHistory'
    ])
  },
  watch: {
    mode (newVal) {
      if (newVal === 1) {
        this.modeClass = 'icon-loop'
      }
      if (newVal === 2) {
        this.modeClass = 'icon-random'
      }
      if (newVal === 0) {
        this.modeClass = 'icon-sequence'
      }
    }
  },
  methods: {
    toggleMode () {
      let arr = this.sequenceList.slice()
      let newMode = this.mode + 1
      if (newMode === 3) {
        newMode = 0
      }
      this.setMode(newMode)
      if (newMode === playMode.sequence) {
      }
      if (newMode === playMode.loop) {
        arr = this.sequenceList
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].id === this.currentTrack.id) {
            this.setCurrentIndex(i)
          }
        }
      }
      if (newMode === playMode.random) {
        arr = arr.sort(function () {
          return (0.5 - Math.random())
        })
      }
      this.setTrackList(arr)
    },
    toggleFavorite (item) {
      for (var i = 0; i < this.favoriteHistory.length; i++) {
        if (this.favoriteHistory[i].id === item.id) {
          this.removeSingleFavorite(item)
          return
        }
      }
      this.setSingleFavorite(item)
    },
    favoriteClass (item) {
      for (var i = 0; i < this.favoriteHistory.length; i++) {
        if (this.favoriteHistory[i].id === item.id) {
          return 'icon-favorite'
        }
      }
      return 'icon-not-favorite'
    },
    ...mapMutations({
      setFullScreen: 'setFullScreen',
      setPlaying: 'setPlaying',
      setCurrentIndex: 'setCurrentIndex',
      setCurrentTrack: 'setCurrentTrack',
      setMode: 'setMode',
      setSequenceList: 'setSequenceList',
      setTrackList: 'setTrackList'
    }),
    ...mapActions([
      'setSingleSong',
      'setSingleFavorite',
      'removeSingleFavorite'
    ])
  }
}
