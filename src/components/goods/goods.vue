<template lang="html">
	<div>
		<div class="goods">
			<div class="menu-wrapper" ref="menuWrapper">
				<ul>
					<li v-for="(item, index) in goods" class="menu-item" :class="{'current': currentIndex===index}" @click="selectMenu(index)">
						<span class="text border-1px">
							<span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
						</span>
					</li>
				</ul>
			</div>
			<div class="foods-wrapper" ref="foodsWrapper">
				<ul>
					<li v-for="item in goods" class="food-list food-list-hook">
						<h1 class="title" v-text="item.name"></h1>
						<ul>
							<li v-for="food in item.foods" @click="selectFood(food, $event)" class="food-item border-1px">
								<div class="icon">
									<img :src="food.icon" width="57" height="57">
								</div>
								<div class="content">
									<h2 class="name" v-text="food.name"></h2>
									<p class="desc" v-text="food.description"></p>
									<div class="extra">
										<span class="count">月售{{food.sellCount}}</span><span>好评率{{food.rating}}%</span>
									</div>
									<div class="price">
										<span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
									</div>
									<div class="cartcontrol-wrapper">
										<cartcontrol @add="drop" :food="food"></cartcontrol>
									</div>
								</div>
							</li>
						</ul>
					</li>
				</ul>
			</div>
			<shopcart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" ref="shopcart"></shopcart>
		</div>
		<food @add="drop" :food="selectedFood" ref="food"></food>
	</div>
</template>

<script>
import BScroll from 'better-scroll'
import cartcontrol from '@/components/cartcontrol/cartcontrol'
import shopcart from '@/components/shopcart/shopcart'
import food from '@/components/food/food'

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
			classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
			listHeight: [0],
			scrollY: 0,
			selectedFood: {}
		}
	},
	computed: {
		currentIndex() {
			for (var i = 0, len = this.listHeight.length; i < len; i++) {
				let height1 = this.listHeight[i],
					height2 = this.listHeight[i + 1];
				if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
					return i;
				}
			}
			return 0;
		},
		selectFoods() {
			let foods = [];
			[].forEach.call(this.goods, good => {
				good.foods.forEach(food => {
					if (food.count > 0) {
						foods.push(food);
					}
				});
			});
			return foods;
		}
	},
	methods: {
		// init better-scroll
		initScroll() {
			this.menuScroll = new BScroll(this.$refs.menuWrapper, {
				click: true
			});
			this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
				click: true,
				probeType: 3
			});
			// 监听实时滚动位置
			this.foodsScroll.on('scroll', pos => {
				this.scrollY = Math.abs(Math.round(pos.y));
			});
		},
		// 计算高度
		calculateHeight() {
			let foodList = this.getFoodsHook(),
				height = 0;
			for (var i = 0, len = foodList.length; i < len; i++) {
				height += foodList[i].clientHeight;
				this.listHeight.push(height);
			}
		},
		selectMenu(index) {
			if (!event._constructed) {
				return;
			}
			let foodList = this.getFoodsHook(),
				el = foodList[index];
			this.foodsScroll.scrollToElement(el, 300);
		},
		getFoodsHook() {
			return this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
		},
		drop(target) {
			// 体验优化，异步执行下落动画
			this.$nextTick(() => {
				this.$refs.shopcart.drop(target);
			});
		},
		selectFood(food, event) {
			this.selectedFood = food;
			this.$refs.food.show();
		}
	},
	components: {
		cartcontrol,
		shopcart,
		food
	},
	mounted() {
		this.$http.get('/api/goods').then(req => {
			if (req.body.errno === ERR_OK) {
				this.goods = req.body.data;
				this.$nextTick(() => {
					this.initScroll();
					this.calculateHeight();
				});
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
			&.current
				position relative
				z-index 10
				margin-top -1px
				background #fff
				font-weight 700
				.text
					border-none()
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
		.title
			padding-left 14px
			line-height 26px
			height 26px
			border-left 2px solid #d9dde1
			font-size 12px
			color rgb(147, 153, 159)
			background #f3f5f7
		.food-item
			display flex
			margin 18px
			padding-bottom 18px
			border-1px(rgba(7, 17, 27, 0.1))
			&:last-child
				border-none()
				margin-bottom 0
			.icon
				flex 0 0 57px
				margin-right 10px
			.content
				flex 1
				.name
					margin 2px 0 8px 0
					height 14px
					line-height 14px
					font-size 14px
					color rgb(7, 17, 27)
				.desc, .extra
					line-height 10px
					font-size 10px
					color rgb(147, 153, 159)
				.desc
					line-height 12px
					margin-bottom 8px
				.extra
					.count
						margin-right 12px
				.price
					font-weight 700
					line-height 24px
					.now
						margin-right 8px
						font-size 14px
						color rgb(240 20 20)
					.old
						text-decoration line-through
						font-size 10px
						color rgb(147, 153, 159)
				.cartcontrol-wrapper
					position absolute
					right 0
					bottom 12px
</style>
