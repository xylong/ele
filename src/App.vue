<template>
    <div>
        <v-header :seller="seller"></v-header>
        <div class="tab border-1px">
            <div class="tab-item" v-for="v in menu"><router-link :to="v.url">{{v.name}}</router-link></div>
        </div>
        <router-view :seller="seller"></router-view>
    </div>
</template>

<script>
import header from '@/components/header/header.vue'

const ERR_OK = 0

export default {
    name: 'app',
    data() {
        return {
            menu: [{
                url: '/goods',
                name: '商品'
            }, {
                url: '/ratings',
                name: '评论'
            }, {
                url: '/sellers',
                name: '商家'
            }],

            seller: {}
        }
    },
    mounted() {
        this.$http.get('/api/seller').then(req => {
            if (req.body.errno === ERR_OK) {
                this.seller = req.body.data;
            }
        }, req => {
            // error callback
        })
    },
    components: {
        'v-header': header
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import './common/stylus/mixin.styl'

.tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    // border-bottom: 1px solid rgba(7, 17, 27, 0.1)
    border-1px(rgba(1, 17, 27, 0.1))
    .tab-item
        flex: 1
        text-align: center
        & > a
            display: block
            font-size: 14px
            color: rgb(77, 85, 93)
            &.active
                color: rgb(240, 20, 20)
</style>
