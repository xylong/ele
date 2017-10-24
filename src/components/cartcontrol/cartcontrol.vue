<template lang="html">
	<div class="cartcontrol">
		<transition name="move">
			<div class="cart-decrease icon-remove_circle_outline" @click="decreaseCart" v-show="food.count > 0">
				<span class="inner icon-remove_circle_outline"></span>
			</div>
		</transition>
		<div class="cart-count" v-show="food.count > 0" v-text="food.count"></div>
		<div class="cart-add icon-add_circle" @click="addCart"></div>
	</div>
</template>

<script>
	import Vue from 'vue'
	export default{
		name: 'cartcontrol',
		props: {
			food: {
				type: Object
			}
		},
		methods: {
			addCart() {
				this.food.count++
			},
			decreaseCart() {
				this.food.count--
			}
		},
		mounted() {
			if (!this.food.hasOwnProperty('count')) {
				Vue.set(this.food, 'count', 0)
			}
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.move
	transform translate3D(0, 0, 0)	// 硬件加速
	transition all 0.4s linear
.move-enter, .move-leave-to
	opacity 0
	transform translate3D(24px, 0, 0)	// // 硬件加速
	transform:translateX(24px) rotate(180deg)

.cartcontrol
	font-size 0
	.cart-decrease
		display inline-block
		padding 6px
		transition all 0.4s linear
		.inner
			display inline-block
			line-height 24px
			font-size 24px
			color rgb(0, 160, 220)
	.cart-count
		display inline-block
		vertical-align top
		width 12px
		padding-top 6px
		line-height 24px
		text-align center
		font-size 10px
		color rgb(147, 153, 159)
	.cart-add
		display inline-block
		padding 6px
		line-height 24px
		font-size 24px
		color rgb(0, 160, 220)
</style>