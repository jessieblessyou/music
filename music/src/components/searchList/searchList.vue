<template>
  <div class="mSearchList">
    <transition-group name="list" tag="ul">
    	<li class="list-item" v-for="(item, index) in searches" :key="item">
    		<span class="list-name" @click="searchOne(item)">{{item}}</span>
    		<span class="icon icon-delete" @click="deletOne(index)"></span>
    	</li>
     </transition-group>
  </div>
</template>

<script>
export default {
  name: 'mSearchList',
  props: {
  	searches: {
  		type: Array,
  		default: () => []
  	}
  },
  methods: {
  	deletOne (index) {
  		this.$emit('delete', index)
  	},
    searchOne (item) {
      this.$emit('queryOne', item)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.list-item{
	display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  overflow: hidden;
}
.list-name{
  color: $color-text-l;
}
.icon{
	font-size: $font-size-small;
  color: $color-text-d;
}
.list-enter-active, .list-leave-active {
  transition: all 0.3s;
}
.list-enter, .list-leave-to{
  height: 0px;
}
</style>
