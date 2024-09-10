const { reactive, ref } = Vue

import {CONFIG} from '/config.js'
import {user} from '/reporter/store/user.js'

export default {
    name: 'Home',
	
	setup() {
		const title = 'Log in';
		let form = reactive([]);
		form.show = 'login';
		// form.email = 'RMillerjohn@madisonpubliclibrary.org';
		// form.pw = 'secret';
		form.login_message = '';
		// let form = {};

		function reset_password() {
			console.log("> reset_password");
			// store.logout();
			// user.loginDialog.show = false;
			// user.resetPasswordDialog.show = true;
		};
		function back_to_login () {
			console.log("> back_to_login");
			// store.logout();
			// user.resetPasswordDialog.show = false;
			// user.loginDialog.show = true; 
		};

		async function login () {
			console.log("> login");
			// user.loginDialog.loading = true;
			form.loading = true;
			// await new Promise(resolve => setTimeout(resolve, 500)); // 3 sec
			// console.log("---- 1. Waited .5s");
			let login_success = await user.s_login(form.email, form.pw);
			// why isn't this changing? Because it's not reactive after an await?
			// console.log('done with awaiting');
			// await new Promise(resolve => setTimeout(resolve, 1000)); // 3 sec
			// user.loginDialog.loading = false;
			form.loading = false;
			// console.log('??', login_success);
			// if we're logged in, get user informatino
			if (login_success) {
				// get user informatino
				form.login_message = 'Valid credentials. Loading data.';
				await user.getData(form.email);

				// let fdi_array;
				// await user.fetchFDISGraphQL().then((fc_results) => {
				// 	fdi_array = fc_results;
				// 	console.log('fdi', fdi_array);
				// });
				// window.localStorage.setItem("fdis", JSON.stringify({ data: fdi_array }));
				// // window.localStorage.setItem("frameworks", JSON.stringify({ data: fdi_array.frameworks }));

				let fdi_array2;
				await user.fetchFDIS().then((fc_results) => {
					fdi_array2 = fc_results;
					console.log('fdi', fdi_array2);
				});
				window.localStorage.setItem("fdis", JSON.stringify({ data: fdi_array2 }));
				// window.localStorage.setItem("frameworks", JSON.stringify({ data: fdi_array.frameworks }));

				// load institution questions and save to LS
				form.login_message = 'Valid credentials. Loading data..';
				console.log('DO we know our institution ID? Do we need to?');
				await user.fetchCollection("items/Institutions", '?filter[status][_eq]=published').then((fc_results) => {
					user.institution = fc_results[0];
					window.localStorage.setItem("institution", JSON.stringify({ data: fc_results[0] }));
				});

				// load locations and save to LS
				await new Promise(resolve => setTimeout(resolve, 200)); // 3 sec
				form.login_message = 'Valid credentials. Loading data...';
				await user.fetchCollection("items/Locations", '?filter[status][_eq]=published').then((fc_results) => {
					user.locations = fc_results;
					window.localStorage.setItem("locations", JSON.stringify({ data: fc_results }));
				});

				// fetch current sessions and save them to LS
				await new Promise(resolve => setTimeout(resolve, 200)); // 3 sec
				form.login_message = 'Valid credentials. Loading data......';
				await user.fetchCollection("items/Sessions", '?limit=-1&filter[status][_eq]=published').then((fc_results) => {
					user.userSessions = fc_results;
					window.localStorage.setItem("sessions", JSON.stringify({ data: fc_results }));
				});
				await new Promise(resolve => setTimeout(resolve, 1000)); // 3 sec

				// fetch users and save them to LS
				await new Promise(resolve => setTimeout(resolve, 200)); // 3 sec
				form.login_message = 'Valid credentials. Loading data......';
				await user.fetchCollection("users").then((fc_results) => {
					user.users = {};
					Object.keys(fc_results).forEach(function(key) {
						console.log('LOOKY HERE', key, fc_results[key]);
						user.users[fc_results[key].id] = fc_results[key];
					});
					window.localStorage.setItem("users", JSON.stringify({ data: user.users }));
				});
				await new Promise(resolve => setTimeout(resolve, 1000)); // 3 sec

				// fetch current partners and save them to LS
				await new Promise(resolve => setTimeout(resolve, 200)); // 3 sec
				form.login_message = 'Valid credentials. Loading data......';
				await user.fetchCollection("items/Partners", '?filter[status][_eq]=published').then((fc_results) => {
					user.userPartners = fc_results;
					window.localStorage.setItem("partners", JSON.stringify({ data: fc_results }));
				});
				await new Promise(resolve => setTimeout(resolve, 200)); // 3 sec
				form.login_message = 'Loaded!';

				// send them to home
				Vue.$router.push('/');

			} else {
				form.login_message = 'Error, invalid credentials.'
			}
		};

		return {CONFIG, user, form, title, login, reset_password, back_to_login}
        // const $q = Quasar.useQuasar()
	},


    template: `
        <q-page padding>
			<!-- login -->            
			<section id="home" class="row items-center justify-center" style="">  
				<!-- Login dialog -->
				<div class="q-mt-lg" v-if="form.show=='login'">
					<q-card id="loginDialog" style="min-width: 350px">
						<q-card-section class="column items-center q-pb-xs">
							<div class="text-h6 add-bang">Log in<!--{{user.darkmode}}xx{{user.darkmodeDefault}}--></div>
						</q-card-section>
						<q-card-section>
							<q-btn v-for="button in CONFIG.shortcut_login_buttons" @click="form.email = button.email;form.pw = button.password">{{button.name}}</q-btn>

							<q-form @submit="login" @reset="reset()">
								<q-input filled type="email" v-model="form.email" label="E-mail" lazy-rules :rules="[val => !!val]" autocomplete="email" />
								<q-input filled v-model="form.pw" label="Password" :type="form.pwdVisible ? 'text' : 'password'" lazy-rules :rules="[val => !!val]" autocomplete="current-password">
									<template v-slot:append><q-icon :name="form.pwdVisible ? 'visibility' : 'visibility_off'" class="cursor-pointer" @click="form.pwdVisible = !form.pwdVisible"/></template>
								</q-input>
								<div class="row no-wrap text-primary q-gutter-sm justify-end">
									<q-btn flat :class="$q.dark.isActive ? 'bg-grey-6' : 'bg-grey-3'" @click="form.show = 'pw_reset'" label="Reset Password" />
									<q-btn type="submit" color="primary" label="Log in" :loading="form.loading">
										<template v-slot:loading><q-spinner-hourglass /></template>
									</q-btn>
								</div>
								{{form.login_message}}
							</q-form>
						</q-card-section>
					</q-card>
				</div>
				<!-- Login dialog -->
				<div class="q-mt-lg" v-if="form.show=='pw_reset'">
					<q-card id="loginDialog" style="min-width: 350px">
						<q-card-section class="column items-center q-pb-xs">
							<div class="text-h6">Reset Password</div>
							<div class="text-caption">Do we want reset pw or just a link to auto-login?</div>
						</q-card-section>
						<q-card-section>
							<q-form @submit="submit()" @reset="reset()">
								<q-input filled type="email" v-model="form.email" label="E-mail" lazy-rules :rules="[val => !!val]" />
								<div class="row no-wrap text-primary q-gutter-sm justify-end">
									<q-btn @click="form.show = 'login'" flat label="Back to Login" />
		
									<q-btn type="submit" color="primary" label="OK" :loading="form.loading">
										<template v-slot:loading><q-spinner-hourglass /></template>
									</q-btn>
								</div>
							</q-form>
						</q-card-section>
					</q-card>
				</div>
			</section>

			<!-- footer -->
			<section class="q-mt-lg text-center">
				Welcome to the<br /><q-btn outline :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-1'" href="http://madpl.org/libtoolkit" target="_blank">Lib Toolkit project</q-btn><br />an open source project, join us!
			</section>
	
		</q-page>
    `,
  };