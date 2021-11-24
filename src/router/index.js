import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'el-icon-s-home' }
    }]
  },

  {
    path: '/info',
    component: Layout,
    redirect: '/info/partyMembership',
    name: 'InfoManagement',
    meta: { title: '信息管理', icon: 'el-icon-document-copy' },
    children: [
      {
        path: 'partyMembership',
        name: 'PartyMembership',
        component: () => import('@/views/info/partyMembership/index'),
        meta: { title: '党籍信息管理', showDetail: false },
        children: [
          {
            path: 'details',
            component: () => import('@/views/info/partyMembership/memberInfo/index'),
            meta: { title: '个人详细信息', showDetail: true },
            hidden: true
          }
        ]
      },
      {
        path: 'payment',
        name: 'Payment',
        component: () => import('@/views/info/payment/index'),
        meta: { title: '缴费管理' }
      },
      {
        path: 'application',
        name: 'Application',
        component: () => import('@/views/info/application/index'),
        meta: { title: '入党申请书管理', showDetail: false },
        children: [
          {
            path: 'details',
            component: () => import('@/views/info/application/applicationInfo/index'),
            meta: { title: '入党申请书详情', showDetail: true },
            hidden: true
          }
        ]
      },
      {
        path: 'conversations',
        name: 'Conversations',
        component: () => import('@/views/info/conversation/index'),
        meta: { title: '谈话管理', showDetail: false },
        children: [
          {
            path: 'details',
            component: () => import('@/views/info/conversation/conversationInfo/index'),
            meta: { title: '谈话详情', showDetail: true },
            hidden: true
          }
        ]
      },
      {
        path: 'notification',
        name: 'Notification',
        component: () => import('@/views/info/notification/index'),
        meta: { title: '公示管理' }
      }
    ]
  },

  {
    path: '/message',
    component: Layout,
    redirect: '/message/partyAffairs/gathering',
    name: 'Message',
    meta: {
      title: '消息通知',
      icon: 'el-icon-message'
    },
    children: [
      {
        path: 'partyAffairs',
        redirect: '/message/partyAffairs/gathering',
        component: { render(c) { return c('router-view') } },
        name: 'PartyAffairs',
        meta: { title: '党务工作' },
        children: [
          {
            path: 'gathering',
            component: () => import('@/views/message/partyAffairs/gathering'),
            name: 'Gathering',
            meta: { title: '集会', showDetail: false },
            children: [
              {
                path: 'details',
                component: () => import('@/views/message/partyAffairs/gathering/gatheringInfo'),
                meta: { title: '集会详情', showDetail: true },
                hidden: true
              }
            ]
          },
          {
            path: 'notice',
            component: () => import('@/views/message/partyAffairs/notice/index'),
            name: 'Notice',
            meta: { title: '通知', showDetail: false },
            children: [
              {
                path: 'details',
                component: () => import('@/views/message/partyAffairs/notice/noticeInfo'),
                meta: { title: '通知详情', showDetail: true },
                hidden: true
              }
            ]
          },
          {
            path: 'conversation',
            name: 'Conversation',
            component: () => import('@/views/message/partyAffairs/conversation/index'),
            meta: { title: '谈话记录' },
          }
        ]
      },
      {
        path: 'messageCenter',
        component: () => import('@/views/message/messageCenter/index'),
        name: 'messageCenter',
        meta: { title: '消息中心' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
