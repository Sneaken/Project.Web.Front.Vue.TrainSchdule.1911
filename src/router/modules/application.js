/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

/* Router Modules */
const applicationRouter = {
  path: '/application',
  component: Layout,
  redirect: 'noRedirect',
  alwaysShow: true, // will always show the root menu
  name: 'application',
  meta: {
    title: 'application.title',
    icon: 'clipboard'
  },
  children: [
    {
      path: 'newApply',
      component: () => import('@/views/NewApply'),
      name: 'newApplication',
      meta: {
        title: 'application.new',
        // verify: 'on',
        icon: '测试申请'
      }
    },
    {
      path: 'myApply',
      component: () => import('@/views/MyApply'),
      name: 'MyApply',
      meta: {
        title: 'application.my',
        verify: 'on',
        icon: '提案审批'
      }
    },
    {
      path: 'queryAndAuditApplies',
      component: () => import('@/views/QueryAndAuditApplies'),
      name: 'applicationList',
      meta: {
        title: 'application.audit',
        verify: 'on',
        icon: '无序排列'
      }
    },
    {
      path: 'applyDetail',
      component: () => import('@/views/ApplyDetail'),
      name: 'ApplyDetail',
      meta: {
        title: 'application.detail',
        verify: 'on',
        icon: '提案审批'
      },
      hidden: true
    },
    {
      path: 'applyAuditStream',
      component: () => import('@/views/ApplyStream'),
      name: 'ApplyAuditStream',
      meta: {
        title: 'application.auditStream',
        verify: 'on',
        icon: 'component'
      }
    }
  ]
}

export default applicationRouter
