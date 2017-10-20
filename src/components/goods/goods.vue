<template lang="html">
	<div class="goods">
		<div class="menu-wrapper">
			<ul>
				<li v-for="item in goods" class="menu-item">
					<span class="text border-1px">
						<span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
					</span>
				</li>
			</ul>
		</div>
		<div class="foods-wrapper">
			<ul>
				<li v-for="item in goods" class="food-list">
					<h1 class="title" v-text="item.name"></h1>
					<ul>
						<li v-for="food in item.foods" class="foot-item">
							<div class="icon">
								<img :src="food.icon">
							</div>
							<div class="content">
								<h2 class="name" v-text="food.name"></h2>
								<p class="desc" v-text="food.description"></p>
								<div class="extra">
									<span>月售{{food.sellCount}}</span>
									<span>好评率{{food.rating}}%</span>
								</div>
								<div class="price">
									<span>￥{{food.price}}</span>
									<span v-show="food.oldPrice">￥{{food.oldPrice}}</span>
								</div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
const ERR_OK = 0

export default {
	name: 'goods',
	props: {
		seller: {
			type: Object
		}
	},
	data() {
		return {
			goods: {},
			classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee']
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
@import '../../common/stylus/mixin'

.goods
	display flex
	position absolute
	top 174px
	bottom 46px
	width 100%
	overflow hidden
	.menu-wrapper
		flex 0 0 80px
		width 80px
		background #f3f5f7
		.menu-item
			display table
			height 54px
			width 56px
			padding 0 12px
			line-height 14px
			.icon
				display inline-block
				vertical-align top
				width 12px
				height 12px
				margin-right 2px
				background-size 12px 12px
				background-repeat no-repeat
				&.decrease
					bg-image('decrease_3')
				&.discount
					bg-image('discount_3')
				&.guarantee
					bg-image('guarantee_3')
				&.invoice
					bg-image('invoice_3')
				&.special
					bg-image('special_3')
			.text
				display table-cell
				width 56px
				vertical-align middle
				font-size 12px
				border-1px(rgba(7, 17, 27, 0.1))
	.foods-wrapper
		flex 1
</style>
