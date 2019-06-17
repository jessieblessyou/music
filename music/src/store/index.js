import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import {playMode} from '@/common/js/playMode'
import {getSeachKey, setSearchKey, removeSearchItem, clearSearch, getFavoriteKey, setFavoriteKey, removeFavoriteItem, getSongKey, setSongKey} from '@/common/js/caches.js'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state: {
    count: 0,
    singer: {},
    tracklist: [],
    sequenceList: [],
    track: {},
    fullScreen: false,
    playing: false,
    currentIndex: -1,
    currentTrack: [],
    mode: playMode.sequence,
    disc: {},
    topDisc: {},
    searchHistory: getSeachKey(),
    favoriteHistory: getFavoriteKey(),
    songHistory: getSongKey()
  },
  mutations: {
    setSinger: function (state, singer) {
      state.singer = singer
    },
    setTrackList (state, tracklist) {
      state.tracklist = tracklist
    },
    setFullScreen (state, status) {
      state.fullScreen = status
    },
    setCurrentTrack (state, index) {
      state.track = state.tracklist[index]
    },
    setPlaying (state, playing) {
      state.playing = playing
    },
    setCurrentIndex (state, index) {
      state.currentIndex = index
    },
    setMode (state, mode) {
      state.mode = mode
    },
    setSequenceList (state, list) {
      state.sequenceList = list
    },
    setDisc (state, disc) {
      state.disc = disc
    },
    setTopDisc (state, topDisc) {
      state.topDisc = topDisc
    },
    setSearchHistory (state, searchHistory) {
      state.searchHistory = searchHistory
    },
    setFavoriteHistory (state, value) {
      state.favoriteHistory = value
    },
    setSongHistory (state, value) {
      state.songHistory = value
    }
  },
  getters: {
    singer: function (state) {
      return state.singer
    },
    trackList (state) {
      return state.tracklist
    },
    fullScreen (state) {
      return state.fullScreen
    },
    currentTrack (state) {
      return state.track
    },
    playing (state) {
      return state.playing
    },
    currentIndex (state) {
      return state.currentIndex
    },
    mode (state) {
      return state.mode
    },
    sequenceList (state) {
      return state.sequenceList
    },
    disc (state) {
      return state.disc
    },
    topDisc (state) {
      return state.topDisc
    },
    searchHistory (state) {
      return state.searchHistory
    },
    favoriteHistory (state) {
      return state.favoriteHistory
    },
    songHistory (state) {
      return state.songHistory
    }
  },
  actions: {
    selectTracks ({commit}, {list, index}) {
      commit('setFullScreen', true)
      commit('setPlaying', true)
      commit('setTrackList', list)
      commit('setSequenceList', list)
      commit('setCurrentTrack', index)
      commit('setCurrentIndex', index)
    },
    selectRandomTracks ({commit}, {list}) {
      commit('setFullScreen', true)
      commit('setPlaying', true)
      commit('setSequenceList', list)
      let arr = list.slice()
      arr = arr.sort(function () {
        return (0.5 - Math.random())
      })
      commit('setMode', playMode.random)
      commit('setTrackList', arr)
      commit('setCurrentTrack', 0)
      commit('setCurrentIndex', 0)
    },
    selectTrack ({commit, state}, track) {
      let index = state.tracklist.length
      if (index > 0) {
        for (var i = 0; i < state.tracklist.length; i++) {
          if (state.tracklist[i].id === track.id) {
            index = i
            commit('setCurrentTrack', index)
            commit('setCurrentIndex', index)
            return
          }
        }
      }
      state.tracklist.push(track)
      commit('setSequenceList', state.tracklist.slice())
      commit('setFullScreen', true)
      commit('setPlaying', true)
      commit('setCurrentTrack', index)
      commit('setCurrentIndex', index)
    },
    saveSearch ({commit}, value) {
      let arr = setSearchKey(value)
      commit('setSearchHistory', arr)
    },
    removeSingleSearchHistory ({commit, state}, index) {
      let arr = removeSearchItem(index)
      commit('setSearchHistory', arr)
    },
    clearSearchHistory ({commit}) {
      clearSearch()
      commit('setSearchHistory', [])
    },
    setSingleFavorite ({commit}, value) {
      let arr = setFavoriteKey(value)
      commit('setFavoriteHistory', arr)
    },
    removeSingleFavorite ({commit, state}, item) {
      let arr = removeFavoriteItem(item)
      commit('setFavoriteHistory', arr)
    },
    setSingleSong ({commit}, value) {
      let arr = setSongKey(value)
      commit('setSongHistory', arr)
    }
  },
  plugins: debug ? [createLogger()] : []
})
