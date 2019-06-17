import Vue from 'vue'
import Router from 'vue-router'
import recommend from '@/components/recommend/recommend'

Vue.use(Router)

const disc = () => import('@/components/disc/disc')
const singer = () => import('@/components/singer/singer')
const singerDetails = () => import('@/components/singerDetails/singerDetails')
const toplists = () => import('@/components/toplists/toplists')
const topDisc = () => import('@/components/topDisc/topDisc')
const search = () => import('@/components/search/search')
const userCenter = () => import('@/components/userCenter/userCenter')

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      name: 'mRecommend',
      component: recommend,
      children: [
        {
          path: ':id',
          component: disc
        }
      ]
    },
    {
      path: '/singer',
      name: 'mSinger',
      component: singer,
      children: [
        {
          path: ':id',
          component: singerDetails
        }
      ]

    },
    {
      path: '/rank',
      name: 'mToplists',
      component: toplists,
      children: [
        {
          path: ':id',
          component: topDisc
        }
      ]
    },
    {
      path: '/search',
      name: 'mSearch',
      component: search,
      children: [
        {
          path: ':id',
          component: singerDetails
        }
      ]
    },
    {
      path: '/user',
      name: 'mUserCenter',
      component: userCenter
    }
  ]
})
