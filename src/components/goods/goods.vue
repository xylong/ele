<template lang="html">
    <div>
        商品
    </div>
</template>

<script>
const ERR_OK = 0

export default {
	name: 'goods',
	data() {
		return {
			goods: {}
		}
	},
	mounted() {
		this.$http.get('/api/goods').then(req => {
			if (req.body.errno === ERR_OK) {
				this.goods = req.body.data;
			}
		}, req => {
			// error callback
		})
	}
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
