import {CONFIG} from '/config.js'
import router from '/observer/router.js'

export const user = Vue.reactive({

	// account vars
	userID: false,
	userEmail: false,
	userFirstName: false,
	userLastName: false,
	userAccessToken: false,
	userRefreshToken: false,
	userRefreshTime: false,

	institution: [],
	locations: [],
	fdis: [],
	dimensionsList: {},
	indicatorsList: {},

	// test of ajax
	// loginStep: '',
	name: null,
    email: null,
    token: null,

	// user preferences
	darkmode: null,
	darkmodeDefault: null,


	// not used yet??
	// resetPasswordDialog: {
    //     show: null,
    //     loading: null,
    //     email: null,
    //     pwdVisible: null,
    //     // reset: () => {
    //     //     user.resetPasswordDialog.show = user.resetPasswordDialog.loading = user.resetPasswordDialog.email = user.resetPasswordDialog.password = user.resetPasswordDialog.pwdVisible = null
    //     // }
    // },


	// login user to server
	async s_login(form_email, form_pw) {
		console.log("> store s_login", form_email, form_pw);
		// clear out old stuff
		user.userAccessToken = false;
		user.userRefreshToken = false;
		user.userRefreshTime = false;
		user.userEmail = false;
		user.userID = false;
		user.fdis = false;
		// make call
		// await new Promise(resolve => setTimeout(resolve, 2000)); // 2 sec
		let login_success = null;
		await fetch(CONFIG.directus_url+'/auth/login', {
			method: "POST",
			headers: {
				// Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: form_email,
				password: form_pw,
			}).toString(),
		})
		.then((res) => res.json()) //fix me please and put back into javascript.json
		.then((response) => {
			if (response.data && response.data.access_token) {
				// user.loginStep = 'Loading';
				// we're getting our tokens
				user.userAccessToken = response.data.access_token;
				user.userRefreshToken = response.data.refresh_token;
				let timeObject = new Date();
				// figure when the refresh token is going to time out
				user.userRefreshTime = new Date(timeObject.getTime() + response.data.expires);
				user.userEmail = form_email;
				login_success = true;
				// why doesn't a promise resove work here? This gets called too early
			} else {
				// no access token so let's clear out the things we thought we knew
				login_success = false;
			}
		})
		.catch(function (err) {
			console.log("Fetch Error :-S", err);
		});
		// tell 'em how we did
		return login_success;
	},

	async loadLatestData() {
		console.log('> u loadLatestData');

		user.loadLocalUser();
		return;
		// this used to refresh the data, but we don't know what it's doing now, except that it's breaking things, so is the user.loadLocalUser() enough? Anything at all?
		/*
		let fdi_array;
		await user.fetchFDISGraphQL().then((fc_results) => {
			fdi_array = fc_results;
			// console.log('fdi', fdi_array);
		});
		window.localStorage.setItem("fdis", JSON.stringify({ data: fdi_array }));
		let fdi_array2;
		await user.fetchFDIS().then((fc_results) => {
			fdi_array2 = fc_results;
			// console.log('fdi', fdi_array);
		});
		window.localStorage.setItem("fdis2", JSON.stringify({ data: fdi_array2 }));

		// load institution questions and save to LS
		await user.fetchCollection("items/Institutions", '?filter[status][_eq]=published').then((fc_results) => {
			user.institution = fc_results[0];
			window.localStorage.setItem("institution", JSON.stringify({ data: fc_results[0] }));
		});

		// load locations and save to LS
		await user.fetchCollection("items/Locations", '?filter[status][_eq]=published').then((fc_results) => {
			user.locations = fc_results;
			window.localStorage.setItem("locations", JSON.stringify({ data: fc_results }));
		});

		// fetch current sessions and save them to LS
		await user.fetchCollection("items/Sessions", '?filter[status][_eq]=published&filter[user_id][_eq]=' + user.userID).then((fc_results) => {
			user.sessions = fc_results;
			window.localStorage.setItem("sessions", JSON.stringify({ data: fc_results }));
		});

		// fetch current sessions and save them to LS
		await user.fetchCollection("items/Partners", '?filter[status][_eq]=published').then((fc_results) => {
			user.userPartners = fc_results;
			window.localStorage.setItem("partners", JSON.stringify({ data: fc_results }));
		});
		console.log('> u loadLatestData complete');
		*/
	},

	async checkForTokenRefresh() {
		let currentTime = new Date();
		let expirationTime = new Date(user.userRefreshTime);
		if (expirationTime.getTime() - currentTime.getTime() < 0) {
			// need to refresh token
			console.log("REFRESH PLEASE ASAP");
			await user.refreshToken(user.userRefreshToken);
		};
	},

	async loadLocalUser() {
		console.log("> user store loadLocalUser()");
		try {
			if (user.userAccessToken) {
				// we have a userAccess token already, so we should be good? If this is mounting, how? Every page remounts?

				// get local storage user
				let ls_user = JSON.parse(window.localStorage.getItem("user"));

				// try a new way of refreshing token
				let currentTime = new Date();
				let expirationTime = new Date(ls_user.userRefreshTime);
				// unless it's expired
				console.log("We have a userAccessToken expiring in", (expirationTime.getTime() - currentTime.getTime()) / 1000);
				if (expirationTime.getTime() - currentTime.getTime() < 0) {
					console.log('since were expired, lets try to refresh token');
					let is_logged_in = await user.refreshToken(ls_user.userRefreshToken);
					if (!is_logged_in) {
						console.log('we cant log in, probably userAccessToken expired, so logging out');
						this.logout();
						// return false;
					}
				}

				// get user information
				user.institution = JSON.parse(window.localStorage.getItem("institution"));
				user.locations = JSON.parse(window.localStorage.getItem("locations"));
				user.sessions = JSON.parse(window.localStorage.getItem("sessions"));
				user.partners = JSON.parse(window.localStorage.getItem("partners"));
				// get and parse FDIs
				user.fdis = JSON.parse(window.localStorage.getItem("fdis"));
				for (const key in user.fdis.data) {
					user.dimensionsList[user.fdis.data[key].framework_id] = {};
					for (const key2 in user.fdis.data[key].dimensions) {
						user.dimensionsList[user.fdis.data[key].framework_id][user.fdis.data[key].dimensions[key2].id] = user.fdis.data[key].dimensions[key2].name;
						user.indicatorsList[user.fdis.data[key].dimensions[key2].id] = {};
						for (const key3 in user.fdis.data[key].dimensions[key2].Indicators) {
							// user.fdis.data[key].dimensions
							// console.log('- -  - -  - - - - - - -  - - - - - -- -   -', user.fdis.data[key].dimensions[key2].id, user.fdis.data[key].dimensions[key2].Indicators[key3].id);
							user.indicatorsList[user.fdis.data[key].dimensions[key2].id][user.fdis.data[key].dimensions[key2].Indicators[key3].id] = user.fdis.data[key].dimensions[key2].Indicators[key3].name;
						}
					}
				}
				// console.log('***', JSON.parse(JSON.stringify(user.indicatorsList)));
				user.userEmail = ls_user.userEmail;
				user.userInstitutionID = ls_user.userInstitutionID;

			} else {
				// see if we have a user in local storage
				if (window.localStorage.getItem("user")) {
					console.log('USER 147');
					let ls_user = JSON.parse(window.localStorage.getItem("user"));
					user.locations = JSON.parse(window.localStorage.getItem("locations"));
					user.institution = JSON.parse(window.localStorage.getItem("institution"));
					user.userEmail = ls_user.userEmail;
					user.userRefreshToken = ls_user.userEmail;
					user.userInstitutionID = ls_user.userInstitutionID;

					// TODO use new function above?
					let currentTime = new Date();
					let expirationTime = new Date(ls_user.userRefreshTime);
					if (expirationTime.getTime() - currentTime.getTime() < 0) {
						// need to refresh token
						console.log("REFRESH PLEASE ASAP 159");
						fetch(CONFIG.directus_url+'/auth/refresh', {
							method: "POST",
							headers: { Accept: "application/json", "Content-Type": "application/json" },
							body: JSON.stringify({
								refresh_token: user.userRefreshToken,
							}).toString(),
						})
						.then((res) => res.json()) //fix me please and put back into javascript.json
						.then((response) => {
							if (response.errors) {
								console.log("ERROR 403?", response);
							}
							if (response.data && response.data.access_token) {
								console.log("RightO! 173");
								user.userAccessToken = response.data.access_token;
								user.userRefreshToken = response.data.refresh_token;
								let timeObject = new Date();
								// figure when the refresh token is going to time out
								user.userRefreshTime = new Date(timeObject.getTime() + response.data.expires);
								user.userLoggedIn = true;
								// save to local storage
								window.localStorage.setItem(
									"user",
									JSON.stringify({
										userAccessToken: user.userAccessToken,
										userRefreshTime: user.userRefreshTime,
										userRefreshToken: user.userRefreshToken,
										userEmail: user.userEmail,
										userInstitutionID: user.userInstitutionID,
									})
								);
							} else {
								// no access token so let's clear out the things we thought we knew
								console.log('were in a differnet place actually');
							}
							return response;
						})
						.catch(function (err) {
							console.log("Fetch Error :-S", err);
						});
					} else {
						console.log("250 Refresh in ", (expirationTime.getTime() - currentTime.getTime()) / 1000 / 60);
						// load LS user into system?
						this.userLoggedIn = true;
						this.userAccessToken = ls_user.userAccessToken;
						this.userRefreshTime = expirationTime;
						// if they're still at login, send them away
						// const route = useRoute();
						// if (route.path == "/login/") {
						// 	// send them to login
						// 	let page_to_send_to = "/";
						// 	if (this.userRequestedPage) page_to_send_to = this.userRequestedPage;
						// 	this.router.push(page_to_send_to);
						// }
					}
					// now get fetchLocations ?
					// this.locations = this.fetchLocations();
				} else {
					// no user
					// send to login page?
					// save what page they wanted
					// this.userRequestedPage = "/";
					// send them to login
					// const route = useRoute();
					// if (route.path != "/login/") this.router.push("/login/");
				}
			}
		} catch (error) {
			console.log("ERROR", error);
			return error;
		}
	},
	async refreshToken(which_token) {
		// need to refresh token
		console.log("> refreshToken", which_token);
		let user_has_refreshed_token = false;
		await fetch(CONFIG.directus_url+'/auth/refresh', {
			method: "POST",
			headers: { Accept: "application/json", "Content-Type": "application/json" },
			body: JSON.stringify({
				refresh_token: which_token,
			}).toString(),
		})
		// .then((res) => res.json()) //fix me please and put back into javascript.json
		.then(function(response) {
			if (!response.ok) {
				if (response.status==401) {
					// refresh token fails, so we should bug out
					console.log('401: Not authorized', JSON.parse(JSON.stringify(Vue.routerCurrentPath.fullPath)));
					return false;
				}
			}
			return response.json();
		})
		.then((response) => {
			if (response.errors) {
				console.log("USER JS ERROR?", response);
			}
			if (response.data && response.data.access_token) {
				// console.log("RightO!");
				user.userAccessToken = response.data.access_token;
				user.userRefreshToken = response.data.refresh_token;
				let timeObject = new Date();
				// figure when the refresh token is going to time out
				user.userRefreshTime = new Date(timeObject.getTime() + response.data.expires);
				user.userLoggedIn = true;
				user_has_refreshed_token = true;
			} else {
				// no access token so let's clear out the things we thought we knew
				console.log('were in a differnet place actually');
				return false;
			}
			return response;
		})
		.catch(function (err) {
			console.log("Fetch Error :-S", err);
		});
		if (user_has_refreshed_token) {
			// save just the new parts to local storage
			let current_ls_user = await window.localStorage.getItem("user");
			if (!current_ls_user) return false;
			let current_ls_user_obj = JSON.parse(current_ls_user);
			// console.log('current_ls_user:', typeof current_ls_user_obj, current_ls_user_obj);
			current_ls_user_obj.userAccessToken = user.userAccessToken;
			current_ls_user_obj.userRefreshToken = user.userRefreshToken;
			current_ls_user_obj.userRefreshTime = user.userRefreshTime;
			window.localStorage.setItem(
				"user",
				JSON.stringify(current_ls_user_obj)
			);
			return true;
		}
		return false;
	},

	// 
	async getData(form_email) {
		console.log('> getData');

		fetch(CONFIG.directus_url+'/users/me', {
			method: "GET",
			headers: {
				// Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: "Bearer " + user.userAccessToken,
			},
		})
		.then((res) => res.json()) //fix me please and put back into javascript.json
		.then((response) => {
			user.userID = response.data.id;
			user.userFirstName = response.data.first_name;
			user.userLastName = response.data.last_name;
			// save to local storage
			window.localStorage.setItem(
				"user",
				JSON.stringify({
					userAccessToken: user.userAccessToken,
					userRefreshTime: user.userRefreshTime,
					userRefreshToken: user.userRefreshToken,
					userFirstName: user.userFirstName,
					userLastName: user.userLastName,
					userEmail: form_email,
					userID: response.data.id,
					userInstitutionID: response.data.institution,
				})
			);
		})
	},
	async fetchFDISGraphQL(which, is_raw = false) {
		// not sure what is_raw is for yet
		return;
		console.log("> store fetchFDISGraphQL:", which, is_raw);

		let fdi_array = {};
		await fetch(CONFIG.directus_url+'/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: "Bearer " + user.userAccessToken,
			},
			body: '{"query":"query {Indicators {id name dimension_id {id name color framework_id {id name}}}}"}'
		})
		.then(response => response.json())
		.then(response => {
			// console.log(response);
			// patch fdi together
			response.data['Indicators'].forEach(element => {
				// console.log('>>', element);
				let indicator_id = element.id;
				let indicator_name = element.name;
				let dimension_id = element?.dimension_id?.id;
				let dimension_name = element?.dimension_id?.name;
				let dimension_color = element?.dimension_id?.color;
				let framework_id = element?.dimension_id?.framework_id?.id;
				let framework_name = element?.dimension_id?.framework_id?.name;
				// console.log('>>', framework_id, framework_name);
				if (typeof(dimension_id) != 'undefined' && !fdi_array[framework_id]) fdi_array[framework_id] = {framework_id: parseInt(framework_id), framework_name: framework_name, dimensions: {}};
				if (typeof(dimension_id) != 'undefined' && !fdi_array[framework_id].dimensions[dimension_id]) fdi_array[framework_id].dimensions[dimension_id] = {dimension_id: dimension_id, dimension_name: dimension_name, dimension_color: dimension_color, indicators: {}};
				if (typeof(dimension_id) != 'undefined') fdi_array[framework_id].dimensions[dimension_id].indicators[indicator_id] = {indicator_id: indicator_id, indicator_name: indicator_name};
				// if (typeof(dimension_id) != 'undefined') console.log(framework_id, framework_name, dimension_id, dimension_name, indicator_id, indicator_name);
			});
			// console.log('fdi_array:::::', fdi_array);
		})
		.catch(err => console.error(err));
		return fdi_array;
	},
	async fetchFDIS(which, is_raw = false) {
		// not sure what is_raw is for yet
		console.log("> store fetchFDISfetchFDISfetchFDISfetchFDISfetchFDISfetchFDIS:", which, is_raw);

		let fdi_array = {};
		await fetch(CONFIG.directus_url+'/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: "Bearer " + user.userAccessToken,
			},
			body: '{"query":"query { Frameworks { id name Dimensions { id name color Indicators { id name } } } }"}'
		})
		.then(response => response.json())
		.then(response => {
			console.log(response);
			// patch fdi together
			response.data['Frameworks'].forEach(element => {
				// console.log('>>', element);
				fdi_array[element.id] = {framework_name: element.name, framework_id: element.id, dimensions: element.Dimensions};
				// let indicator_id = element.id;
				// let indicator_name = element.name;
				// let dimension_id = element?.dimension_id?.id;
				// let dimension_name = element?.dimension_id?.name;
				// let dimension_color = element?.dimension_id?.color;
				// let framework_id = element?.dimension_id?.framework_id?.id;
				// let framework_name = element?.dimension_id?.framework_id?.name;
				// // console.log('>>', framework_id, framework_name);
				// if (typeof(dimension_id) != 'undefined' && !fdi_array[framework_id]) fdi_array[framework_id] = {framework_id: parseInt(framework_id), framework_name: framework_name, dimensions: {}};
				// if (typeof(dimension_id) != 'undefined' && !fdi_array[framework_id].dimensions[dimension_id]) fdi_array[framework_id].dimensions[dimension_id] = {dimension_id: dimension_id, dimension_name: dimension_name, dimension_color: dimension_color, indicators: {}};
				// if (typeof(dimension_id) != 'undefined') fdi_array[framework_id].dimensions[dimension_id].indicators[indicator_id] = {indicator_id: indicator_id, indicator_name: indicator_name};
				// if (typeof(dimension_id) != 'undefined') console.log(framework_id, framework_name, dimension_id, dimension_name, indicator_id, indicator_name);
			});
			// console.log('fdi_array:::::', fdi_array);
		})
		.catch(err => console.error(err));
		return fdi_array;
	},
	async fetchCollection(which, extra_filter = '') {
		// not sure what is_raw is for yet
		console.log("> store fetchCollection:", which, extra_filter);
		// see if we're logged in
		await user.loadLocalUser();
		// get the data
		return fetch(CONFIG.directus_url + '/' + which + extra_filter, {
			method: "GET",
			headers: {
				// Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: "Bearer " + user.userAccessToken,
			},
		})
		.then((res) => res.json()) //fix me please and put back into javascript.json
		.then((response) => {
			if (response.data) {
				// we're getting our tokens
				return response.data;
			} else {
				console.log("Error receiving fetchCollection response", response);
				return null;
			}
			// return response;
		})
		.catch(function (err) {
			console.log("Fetch Error :-S", err);
		});
	},


    logout: () => {
		console.log('Logging out', Vue.$router.currentRoute.value.path);
		// reset
		user.userAccessToken = user.userRefreshTime = user.userID = user.userEmail = user.userAccessToken = user.userRefreshToken = user.userRefreshTime = null;
		user.darkmode = user.darkmodeDefault;
        localStorage.removeItem('user');
        localStorage.removeItem('darkmode');
        localStorage.removeItem('institution');
        localStorage.removeItem('locations');
        localStorage.removeItem('sessions');
        localStorage.removeItem('partners');
        localStorage.removeItem('fdis');
		// send 'em to login
		Vue.$router.push('/observer/login/');
    },


})