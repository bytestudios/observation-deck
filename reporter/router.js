//admin pages
import home from '/reporter/pages/home.js'
import login from '/reporter/pages/login.js'

export default VueRouter.createRouter({
    base: '/reporter/',
    history: VueRouter.createWebHistory('/reporter/'),
    routes: [
        { path: '/', component: home, meta: { title: 'Home', icon: 'home'}},     
        { path: '/login', component: login, meta: { title: 'Log in', icon: 'face'}},

		// { path: '/page1', component: page1, meta: { title: 'Page 1', icon: 'info'}},
        // { path: '/page2', component: page2, meta: { title: 'Page 2', icon: 'lightbulb'}},
        // { path: '/page3', component: page3, meta: { title: 'Page 3', icon: 'face'}},
        // { path: '/page4', component: page4, meta: { title: 'Page 4', icon: 'settings'}}
    ]
})
