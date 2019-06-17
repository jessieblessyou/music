<template>
  <div class="switchs">
    <ul class="switch-container">
 			<li v-for="(item, index) in itemname" :key="index" @click="switchItem(index)" class="switch-item" :class="{active:switchIndex==index}">{{item}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'switchs',
  data () {
    return {
    }
  },
  props: {
  	itemname: {
  		type: Array,
  		default: () => []
  	},
  	switchIndex: Number
  },
  methods: {
  	switchItem (index) {
  		this.$emit('getIndex', index)
  	}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.switch-container{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 240px;
  border: 1px solid $color-highlight-background;
  border-radius: 5px;
}
.switch-item{
  padding: 8px;
  flex: 1;
  text-align: center;
  font-size: $font-size-medium;
  color: $color-text-d;
}
.active{
  background: $color-highlight-background;
  color: $color-text;
}
</style>
