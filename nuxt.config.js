const path = require('path')
module.exports = {
  router: {
    linkActiveClass: 'active',
    extendRoutes(routes, resolve) {
      routes.splice(0)
      routes.push(...[
        {
          path: '/',
          component: resolve(__dirname, 'pages/layout/index'),
          children: [
            {
              path: '', // 默认子路由
              name: 'home',
              component: resolve(__dirname,'pages/home/')
            },
            {
              path: '/login',
              name: 'login',
              component: resolve(__dirname,'pages/login/')
            },
            {
              path: '/register',
              name: 'register',
              component: resolve(__dirname,'pages/login/')
            },
            {
              path: '/profile/:username',
              name: 'profile',
              component: resolve(__dirname, 'pages/profile/')
            },
            {
              path: '/settings',
              name: 'settings',
              component: resolve(__dirname,'pages/settings/')
            },
            {
              path: '/editor',
              name: 'editor',
              component: resolve(__dirname,'pages/editor/')
            },
            {
              path: '/article/:slug',
              name: 'article',
              component: resolve(__dirname,'pages/article/')
            }
          ]
        }
      ])
    }
  },
  plugins: [
    '~/plugins/request.js',
    '~/plugins/day.js',
  ]
}