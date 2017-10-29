<template lang="html">
    <transition name="fadeInRight">
	    <div class="food" v-show="showFlag" ref="food">
	    	<div class="food-content">
	    		<div class="image-header">
	    			<img :src="food.image">
	    			<div class="back" @click="back">
	    				<i class="icon-arrow_lift"></i>
	    			</div>
	    		</div>
	    		<div class="content">
	    			<h1 class="title" v-text="food.name"></h1>
	    			<div class="detail">
	    				<span class="sell-count" v-text="'月售' + food.sellCount + '份'"></span>
	    				<span class="rating" v-text="'好评率' + food.rating"></span>
	    			</div>
	    			<div class="price">
	    				<span class="now" v-text="'￥' + food.price"></span>
	    				<span class="old" v-text="'￥' + food.oldPrice" v-show="food.oldPrice"></span>
	    			</div>
                    <div class="cartcontrol-wrapper">
    	    			<cartcontrol @add="addFood" :food="food"></cartcontrol>
    	    		</div>
    	    		<div class="buy" @click.stop.prevent="addFirst" v-show="!food.count || food.count === 0">加入购物车</div>
	    		</div>
                <split v-show="food.info"></split>
                <div class="info" v-show="food.info">
                    <h1 class="title">商品信息</h1>
                    <p class="text" v-text="food.info"></p>
                </div>
                <split></split>
                <div class="rating">
                    <h1 class="title">商品评价</h1>
                    <ratingselect @selectedType="selectRatingType" @toggle="toggleContent" :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
                    <!-- 评论列表 -->
                    <div class="rating-wrapper">
                        <ul v-show="food.ratings && food.ratings.length">
                            <li v-for="v in food.ratings" class="rating-item" v-show="isShow(v.rateType, v.text)">
                                <div class="user">
                                    <span class="name" v-text="v.username"></span>
                                    <img :src="v.avatar" class="avatar" width="12" height="12" />
                                </div>
                                <div class="time">{{v.rateTime | formatDate}}</div>
                                <p class="text">
                                    <span :class="{'icon-thumb_up': v.rateType === 0, 'icon-thumb_down': v.rateType === 1}"></span>
                                    {{v.text}}
                                </p>
                            </li>
                        </ul>
                        <div class="no-rating" v-show="!food.ratings || food.ratings.length === 0">暂无评价</div>
                    </div>
                    <!-- 评论列表🔚 -->
                </div>
	    	</div>
	    </div>
	</transition>
</template>

<script>
import Vue from 'vue'
import BScroll from 'better-scroll'
import {formatDate} from '@/common/js/date'
import cartcontrol from '@/components/cartcontrol/cartcontrol'
import split from '@/components/split/split'
import ratingselect from '@/components/ratingselect/ratingselect'

const ALL = 2;
const POSITIVE = 0;
const NEGATIVE =1;

export default {
	name: 'food',
	props: {
		food: {
			type: Object
		}
	},
	data() {
		return {
			showFlag: false,
            selectType: ALL,
            onlyContent: true,
            desc: {
                all: '全部',
                positive: '推荐',
                negative: '吐槽'
            }
		}
	},
	methods: {
		show() {
			this.showFlag = true;
            this.selectType = ALL;
            this.onlyContent = true;

			this.$nextTick(() => {
				if (!this.scroll) {
					this.scroll = new BScroll(this.$refs.food, {
						click: true
					});
				} else {
					this.scroll.refresh();
				}
			});
		},
		back() {
			this.showFlag = false;
		},
		// 加入购物车
		addFirst(event) {
			if (!event._constructed) {
				return;
			}
			this.$emit('add', event.target);
			Vue.set(this.food, 'count', 1);	// 在购物车没有东西的时候触发不到购物车子组件，所以要改变父组件的值要用set
		},
		addFood(target) {
			this.$emit('add', target);
		},
        selectRatingType(type) {
            this.selectType = type;
            this.$nextTick(() => {
            	this.scroll.refresh();
            });
        },
        toggleContent() {
            this.onlyContent = !this.onlyContent;
            this.$nextTick(() => {
            	this.scroll.refresh();
            });
        },
        /**
         * 评论列表展示过滤
         * @param  {boolean}  type
         * @param  {string}  text 评论内容
         * @return {Boolean}
         */
        isShow(type, text) {
        	// 是否要显示内容and有内容
        	if (this.onlyContent && !text) {
        		return false;
        	}
        	if (this.selectType === ALL) {
        		return true;
        	} else {
        		return type === this.selectType;
        	}
        }
	},
	filters: {
		formatDate(time) {
			let date = new Date(time);
			return formatDate(date, 'yyyy-MM-dd hh:mm');
		}
	},
	components: {
        ratingselect,
		cartcontrol,
        split
	}
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin'

.food
	position fixed
	left 0
	top 0
	bottom 48px
	z-index 30
	width 100%
	background #fff
	transform translate3d(0, 0, 0)
	&.fadeInRight-enter-active, &.fadeInRight-leave-active
		transition all 0.2s linear
	&.fadeInRight-enter, &.fadeInRight-leave-active
		transform translate3d(100%, 0, 0)
	.image-header
		position relative
		width 100%
		height 0
		padding-top 100%
		img
			position absolute
			top 0
			left 0
			width 100%
			height 100%
		.back
			position absolute
			top 10px
			left 0
			.icon-arrow_lift
				display block
				padding 18px
				font-size 20px
				color #fff
	.content
		position relative
		padding 18px
		.title
			line-height 14px
			margin-bottom 8px
			font-size 14px
			font-weight 700
			color rgb(7, 17, 27)
		.detail
			margin-bottom 18px
			height 10px
			line-height 10px
			font-size 0
			.sell-count, .rating
				font-size 10px
				color rgb(147, 153, 159)
			.sell-count
				margin-right 12px
		.price
			font-weight 700
			line-height 24px
			.now
				margin-right 8px
				font-size 14px
				color rgb(240, 20, 20)
			.old
				text-decoration: line-through
				font-size 10px
				color rgb(147, 153, 159)
	    .cartcontrol-wrapper
			position absolute
			right 12px
			bottom 12px
		.buy
			position absolute
			right 18px
			bottom 18px
			z-index 10
			height 24px
			line-height 24px
			padding 0 12px
			box-sizing border-box
			border-radius 12px
			font-size 10px
			color #fff
			background rgb(0, 160, 220)
			opacity 1
	.info
		padding 18px
		.title
			line-height 14px
			margin-bottom 6px
			font-size 14px
			color rgb(7, 17, 27)
		.text
			line-height 24px
			padding 0 8px
			font-size 12px
			color rgb(77, 85, 93)
	.rating
		padding-top 18px
		.title
			line-height 14px
			margin-left 18px
			font-size 14px
			color rgb(7, 17, 27)
		.rating-wrapper
			padding 18px
			.rating-item
				position relative
				padding 16px 0
				border-1px(rgba(7, 17, 27, 0.1))
				.user
					position absolute
					right 0
					top 16px
					line-height 12px
					font-size 0
					.name
						display inline-block
						margin-right 6px
						vertical-align top
						font-size 10px
						color rgb(147, 153, 159)
					.avatar
						border-radius 50%
				.time
					margin-bottom 6px
					line-height 12px
					font-size 10px
					color rgb(147, 153, 159)
				.text
					line-height 16px
					font-size 12px
					color rgb(7, 17, 27)
					.icon-thumb_up, .icon-thumb_down
						margin-right 48px
						line-height 24px
						font-size 12px
					.icon-thumb_up
						color rgb(0, 160, 220)
					.icon-thumb_down
						color rgb(147, 153, 159)
			.no-rating
				padding 16px 0
				font-size 12px
				color rgb(147, 153, 159)
</style>
