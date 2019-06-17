<template>
  <div ref="carsouelContainer" class="carsouel-container">
    <div class="carousel-group" ref="carouselGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item,index) in carouselData" :key="index" :class="{dotactive: currentDot===index}"></span>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  name: 'mSilder',
  data () {
    return {
      children: [],
      timer: 0,
      autoPlay: true,
      currentDot: 0
    }
  },
  props: {
    carouselData: Array
  },
  mounted: function () {
    this.$nextTick(() => {
      this._setGroupWidth()
      this._setScroll()
      this._play()
    })
    window.addEventListener('resize', () => {
      if (!this.scroll) {
        return
      }
      this._setGroupWidth()
      this.scroll.refresh()
    })
  },
  activated () {
    this.$nextTick(() => {
      this._setGroupWidth()
      this._play()
    })
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  },
  methods: {
    _setGroupWidth: function () {
      let currentWidth = this.$refs.carsouelContainer.clientWidth
      this.children = this.$refs.carouselGroup.children
      for (var i = 0; i < this.children.length; i++) {
        this.children[i].style.width = currentWidth + 'px'
      }
      let width = this.children[0].clientWidth * this.children.length + (this.children[0].clientWidth * 2)
      this.$refs.carouselGroup.style.width = width + 'px'
    },
    _setScroll: function () {
      this.scroll = new BScroll(this.$refs.carsouelContainer, {
        scrollX: true,
        momentum: false,
        click: true,
        snap: {
          loop: true,
          threshold: 0.3,
          speed: 400
        }
      })
      this.scroll.on('scrollEnd', () => {
        let pageIndex = this.scroll.getCurrentPage().pageX
        this.currentDot = pageIndex
        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
      })
    },
    _play: function () {
      this.timer = setTimeout(() => {
        this.scroll.next()
      }, 4000)
    }
  },
  watch: {
    carouselData () {
      setTimeout(() => {
        this.scroll.refresh()
      }, 400)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.carsouel-container{
  height:100%;
  white-space: nowrap;
  overflow: hidden;
  position:relative;
  white-space: nowrap;
}
.carousel-item{
  display:inline-block;
  overflow: hidden;
}
.carousel-image{
  display:block;
  width:100%;
}
.dots{
  position:absolute;
  right: 0;
  left: 0;
  bottom: 12px;
}
.dot{
  display:inline-block;
  margin: 0 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: $color-text-l;
}
.dotactive{
  width: 20px;
  border-radius: 5px;
  background: $color-text-ll;
}
</style>
