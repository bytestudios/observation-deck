// FROM the Quasar template: https://github.com/SaleCar/Quasar-UMD-Template
import {CONFIG} from '/config.js'
import {user} from '/observer/store/user.js'             //user state
import {data} from '/observer/store/data.js'             //user state

const { reactive, ref, watch, date } = Vue

//router
import router from '/observer/router.js'
Vue.routerCurrentPath = '';
let currentRoute = false;
router.beforeEach(async (to, from) => { 
	Vue.routerCurrentPath = to;// way to broadcast where we are
	data.currentPath = to.path;
	// console.log('--- ---- ------ ------', Vue.routerCurrentPath);
	// console.log('> router beforeEach', to, from);
	// is the user logged on?
	await user.loadLocalUser();// see if we have a local session
	// console.log('path?', from.path, to.path);
	// console.log('we logged in?', user.userID);
	// if they're on the login page already and not logged in, we're happy
    if (!user.userID && to.path == '/login/') return true
	// if we're not logged in and looking for another page, send 'em home
	if (!user.userID && to.path != '/login/') {router.push("/login/"); return false};
	// if we are logged in...
	if (user.userID && to.path == '/login/') {router.push("/"); return false};
	currentRoute = to.path;
    //no match - goto root
    // if (!to.matched.length) {to.fullPath = '/'; return true}
    //if not logged -> login dialog
    // if (!user.token) {
    //     setTimeout(function() {user.loginDialog.show = true}, 200)
    //     await user.token
    // }
})
Vue.$router = router


const app = Vue.createApp({
    components: {
        // 'layout-adm':layout_adm, 
        // 'layout-lnd':layout_lnd, 
        // 'landing-page':login_page, 
        // 'login-dialog':login
    },

    setup() {
        const {onMounted} = Vue;
        const $q = Quasar.useQuasar();
		var r = currentRoute;

		//auto dark mode
		$q.dark.set('auto');
		let dark_mode = ref(($q.dark.isActive) ? 'dark' : 'light');// used as v-model for toggle0
		// dark_mode = ($q.dark.isActive) ? 'dark' : 'light';
		user.darkmodeDefault = ($q.dark.isActive) ? 'dark' : 'light';
		user.darkmode = dark_mode;// load system default into user object
		// console.log('1. ', JSON.parse(JSON.stringify($q.dark)), $q.dark.mode, user.darkmodeDefault, dark_mode.value);
		let ls_darkmode = null;

        onMounted(async() => {
            //load user from localstorage -- not needed, right?
            Object.assign(user, JSON.parse(localStorage.getItem('user')))

			if (user.userID) {
				// 
				// user.darkmodeDefault = JSON.parse(JSON.stringify(dark_mode));

				// if we have a user
				ls_darkmode = window.localStorage.getItem('darkmode');
				// console.log('ls_darkmode:', ls_darkmode, typeof ls_darkmode);
				// console.log('2. ', dark_mode);
				if (ls_darkmode) {
					console.log('ls_darkmode::', typeof ls_darkmode, ls_darkmode);
					user.darkmode = dark_mode = ls_darkmode;//(ls_darkmode == 'dark');
					console.log('3. ', dark_mode);
					let new_dark_value = (dark_mode=='dark');
					$q.dark.set(new_dark_value);
				}
			}
	
			// get current location?
			// console.log('--- ---- ------ ------', Vue.routerCurrentPath);
        })
		watch(dark_mode, (newValue, oldValue) => {
			// TODO save to user's preferences?
			console.log('watch', newValue);
			let new_dark_value = (newValue=='dark');
			$q.dark.set(new_dark_value);
			user.darkmode = newValue;
			if (user.userID && (newValue=='dark' || newValue=='light')) {


			// console.log('4. ', newValue, user.darkmode, dark_mode);
			// // load dark mode
			// // if (ls_darkmode) {
			// 	console.log('5. saving to LS');
			// 	Object.assign(user, JSON.parse(localStorage.getItem('user')))
			// 	// user.darkmode = 'dark';
				window.localStorage.setItem('darkmode', newValue);
			}
		});

		// r = Vue.$router
        return {user, data, dark_mode}
    },

    template: `
	<q-layout view="hHh LpR fFf">
		<q-toolbar v-if="data.currentPath!='/login/'" :class="(data.currentPage=='Home page') ? 'bg-grey-1 add-logo' : 'bg-grey-1'">
			<q-btn v-if="data.currentPath=='/zzzz'" flat round dense icon="menu" />
			<q-btn v-if="data.currentPath!='/'" flat padding="5px 5px" to="/" style="padding-top:2px" icon="arrow_back_ios" />
			<q-toolbar-title>
				{{data.currentPage}}<!--{{user.darkmode}}xx{{user.darkmodeDefault}}-->
			</q-toolbar-title>
			<q-btn v-if="user.userID" flat round no-wrap icon="person">
				<q-menu auto-close>
					<q-list style="min-width: 200px">
						<q-item>
							<q-item-section>
								<div style="text-wrap:nowrap">{{user.userFirstName}} {{user.userLastName}}</div>
							</q-item-section>
						</q-item>
						<q-separator />
						<q-item clickable @click="user.loadLatestData()">
							<q-item-section avatar style="min-width: 20px">
								<q-icon size="sm" :class="$q.dark.isActive ? 'text-grey-2' : 'text-primary'" :name="$q.dark.isActive ? 'dark_mode' : 'light_mode'" />
							</q-item-section>
							<q-item-section style="width: 90%"><q-toggle color="secondary" v-model="dark_mode" true-value="dark" false-value="light" /></q-item-section>
						</q-item>
						<q-item clickable @click="user.loadLatestData()">
							<q-item-section avatar style="min-width: 20px">
								<q-icon size="sm" :class="$q.dark.isActive ? 'text-grey-2' : 'text-primary'" name="refresh" />
							</q-item-section>
							<q-item-section style="width: 90%">Refresh Data</q-item-section>
						</q-item>
						<q-item clickable @click="user.logout()">
							<q-item-section avatar style="min-width: 20px">
								<q-icon size="sm" :class="$q.dark.isActive ? 'text-grey-2' : 'text-primary'" name="logout" />
							</q-item-section>
							<q-item-section>Log out</q-item-section>
						</q-item>
					</q-list>
				</q-menu>
			</q-btn>
		</q-toolbar>

		<!-- Layout (Header and Drawer) -->

		<!-- Main content -->
		<q-page-container style="border-top: 1px solid #ccc;">
			<router-view></router-view>
		</q-page-container>
	</q-layout>
    `,
});

app.use(router)
app.use(Quasar)
app.mount('#app')