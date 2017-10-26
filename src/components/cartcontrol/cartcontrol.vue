<template lang="html">
	<div class="cartcontrol">
		<transition name="move">
			<div class="cart-decrease icon-remove_circle_outline" @click.stop.prevent="decreaseCart" v-show="food.count > 0">
				<span class="inner icon-remove_circle_outline"></span>
			</div>
		</transition>
		<div class="cart-count" v-show="food.count > 0" v-text="food.count"></div>
		<div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
	</div>
</template>

<script>
	import Vue from 'vue'
	export default {
		name: 'cartcontrol',
		props: {
			food: {
				type: Object
			}
		},
		methods: {
			addCart(event) {
				if (!event._constructed) {
					return;
				}
				this.food.count++;
				this.$emit('add', event.target);
			},
			decreaseCart() {
				if (!event._constructed) {
					return;
				}
				this.food.count--;
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
			transition all 0.4s linear
		&.move-enter-active, &.move-leave-active
			transform translate3d(0, 0, 0)
			.inner
				display inline-block
				transform rotate(0)
		&.move-enter, &.move-leave-active
			opacity 0
			transform translate3d(24px, 0, 0)
			.inner
				transform rotate(180deg)
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