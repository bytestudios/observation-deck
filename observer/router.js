//admin pages
import home from '/observer/pages/home.js'
import login from '/observer/pages/login.js'
import session_page from '/observer/pages/session.js'
import all_sessions_page from '/observer/pages/sessions.js'
// import page1 from '/pages/admin/page1.js'
// import page2 from '/pages/admin/page2.js'
// import page3 from '/pages/admin/page3.js'
// import page4 from '/pages/admin/page4.js'

export default VueRouter.createRouter({
	base: '/observer/',
    history: VueRouter.createWebHistory('/observer/'),
    routes: [
        { path: '/', component: home, meta: { title: 'Home', icon: 'home'}},     
        { path: '/login', component: login, meta: { title: 'Log in', icon: 'face'}},
        { path: '/session', component: session_page, meta: { title: 'Page 1zzz', icon: 'info'}},
        { path: '/session/:id', component: session_page, meta: { title: 'Page 1zzz', icon: 'info'}},
        { path: '/sessions/', component: all_sessions_page, meta: { title: 'Page 1zzz', icon: 'info'}},
        // { path: '/page1', component: page1, meta: { title: 'Page 1', icon: 'info'}},
        // { path: '/page2', component: page2, meta: { title: 'Page 2', icon: 'lightbulb'}},
        // { path: '/page3', component: page3, meta: { title: 'Page 3', icon: 'face'}},
        // { path: '/page4', component: page4, meta: { title: 'Page 4', icon: 'settings'}}
    ]
})
