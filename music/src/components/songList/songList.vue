<template>
  <div class="songlist">
	  <ul v-if="songList.length">
	    <li v-for="(item, index) in songList" :key="index" class="song-container" @click="songPlay(item, index)">
        <div class="rank-icon" v-show="rank">
          <span class='icon' :class="iconImageCheck(index)">{{index | iconTextCheck}}</span>
        </div>
        <div>
	    	  <h1 class="song-name">{{item.name}}</h1>
	    	  <div class="song-details" v-if="item.singer">{{item.singer[0].name}} · {{item.album}}</div>
        </div>
	    </li>
	  </ul>
  </div>
</template>

<script>
export default {
  name: 'mSonglist',
  data () {
    return {
    }
  },
  props: {
    songList: {
      type: Array,
      default: () => []
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
  	songPlay (item, index) {
  		this.$emit('clickItem', item, index)
  	},
    iconImageCheck (index) {
      if (index < 3) {
        return 'icon' + index
      } else {
        return ''
      }
    }
  },
  filters: {
    iconTextCheck (index) {
      if (index < 3) {
        return ''
      } else {
        return index + 1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.song-container{
  display: flex;
  align-items: center;
  flex: 1;
  line-height: 20px;
  height: 64px;
  font-size: $font-size-medium;
  width:100%;
  overflow: hidden;
}
.rank-icon{
  flex: 0 0 25px;
  width: 25px;
  margin-right: 30px;
  text-align: center;
}
.icon{
  display: inline-block;
  width: 25px;
  height: 24px;
  background-size: 25px 24px;
}
.icon0{
  @include bg-image('first')
}
.icon1{
  @include bg-image('second')
}
.icon2{
  @include bg-image('third')
}
.song-name{
	color: $color-text;
}
.song-details{
  margin-top: 4px;
  color: $color-text-d;
}
</style>
