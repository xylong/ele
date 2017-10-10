import Vue from 'vue'
import Router from 'vue-router'

import goods from '@/components/goods/goods'
import ratings from '@/components/ratings/ratings'
import sellers from '@/components/sellers/sellers'


Vue.use(Router)

export default new Router({
    linkActiveClass: 'active',  // 配置配皮路由高亮样式

    routes: [{
        path: '/goods',
        component: goods
    }, {
        path: '/ratings',
        component: ratings
    }, {
        path: '/sellers',
        component: sellers
    }, {
        path: '*',
        redirect: '/goods'
    }]
})