<template>
  <div class="confirm" v-show="confirmShow">
  	<div class="confirm-wrapper">
  		<div class="confirm-bg">
				<div class="confirm-up">
				<p class="text">{{msgInfo}}</p>
				</div>
				<div class="confirm-down">
					<div class="confirm-cancel" @click.stop="cancel()">{{cancelInfo}}</div>
					<div class="confrim-done" @click="done()">{{doneInfo}}</div>
				</div>
			</div>
		</div>
  </div>
</template>

<script>
export default {
  name: 'mConfirm',
  data () {
    return {
    	confirmShow: false
    }
  },
  props: {
  	msgInfo: {
  		type: String,
  		default: ''
  	},
  	cancelInfo: {
  		type: String,
  		default: ''
  	},
  	doneInfo: {
  		type: String,
  		default: ''
  	}
  },
  methods: {
  	cancel () {
  		this.confirmShow = false
  	},
    open () {
      this.confirmShow = true
    },
  	done () {
  		this.$emit('done')
  		this.confirmShow = false
  	}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.confirm{
	position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 998;
  background-color: $color-background-d;
}
.confirm-wrapper{
	position: absolute;
	top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.confirm-bg{
	width: 270px;
	border-radius: 13px;
	background: $color-highlight-background;
}
.confirm-up .text{
	padding: 19px 15px;
  line-height: 22px;
  text-align: center;
  font-size: $font-size-large;
  color: $color-text-l;
}
.confirm-down{
	display: flex;
  align-items: center;
  text-align: center;
  font-size: $font-size-large;
}
.confirm-down div{
	flex: 1;
  line-height: 22px;
  padding: 10px 0;
  border-top: 1px solid $color-background-d;
  color: $color-text-d;
}
.confirm-cancel{
	border-right: 1px solid $color-background-d;
}
</style>
