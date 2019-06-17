<template>
  <div class="scroll-container" ref="scroll">
    <slot>
    </slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  name: 'mSCroll',
  data () {
    return {
    }
  },
  props: {
    pullup: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: null
    }
  },
  mounted: function () {
    this.scroll = new BScroll(this.$refs.scroll, {
      scrollY: true,
      click: true,
      probeType: 3,
      pullUpLoad: {
        threshold: -10
      }
    })
    let _this = this
    this.scroll.on('scroll', function (data) {
      _this.$emit('scroll', data)
    })

    if (this.pullup) {
      this.scroll.on('pullingUp', () => {
        this.$emit('newData')
        this.scroll.finishPullUp()
      })
    }
    this.scroll.refresh()
  },
  activated () {
    this.scroll.refresh()
  },
  methods: {
    refresh: function () {
      this.scroll && this.scroll.refresh()
    },
    scrollToElement: function (el) {
      this.scroll && this.scroll.scrollToElement(el, 300)
    },
    scroll: function () {
      this.scroll && this.scroll.scroll()
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this.refresh()
      }, 400)
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.scroll-container{
  width:100%;
  position:relative;
  height:100%;
}
</style>
