import {CONFIG} from '/config.js'
import {user} from '/reporter/store/user.js'

export const data = Vue.reactive({
	async getData(filter_form) {
		// console.log('<<getDataGraphQL - how to filter later', filter_form);
		let sessions = {};
		let filter_string = '';
		let new_query = '';

		if (filter_form) { // for filtered results
			// start_date and end_date
			if ((filter_form.start_date && filter_form.start_date != '') && (filter_form.end_date && filter_form.end_date != '')) { // if both are set
				filter_string += 'date: {_between:[\\"' + filter_form.start_date + '\\",\\"' + filter_form.end_date + '\\"]}';
			}
			else if ((filter_form.start_date && filter_form.start_date != '') && (!filter_form.end_date || filter_form.end_date == '')) { // if only start is set
				filter_string += 'date: {_gte: \\"' + filter_form.start_date + '\\"}';
			}
			else if ((!filter_form.start_date || filter_form.start_date == '') && (filter_form.end_date && filter_form.end_date != '')) { // if only end is set
				filter_string += 'date: {_lte: \\"' + filter_form.end_date + '\\"}';
			}
			// id
			if (filter_form.selected_sessions.length > 0) filter_string += 'id: {_in: [' + filter_form.selected_sessions + ']}';
			// sliders
			if (filter_form.session.includes('slider_1')) filter_string += 'slider_1: {_between: [' + filter_form.slider_1_range.min + ', ' + filter_form.slider_1_range.max + ']}';
			if (filter_form.session.includes('slider_2')) filter_string += 'slider_2: {_between: [' + filter_form.slider_2_range.min + ', ' + filter_form.slider_2_range.max + ']}';
			if (filter_form.session.includes('slider_3')) filter_string += 'slider_3: {_between: [' + filter_form.slider_3_range.min + ', ' + filter_form.slider_3_range.max + ']}';
			// partner
			if (filter_form.partner) filter_string += 'partner_id: {id: {_eq: ' + filter_form.partner + '}}';
			// framework
			if (filter_form.framework) filter_string += 'framework_id: {id: {_eq: ' + filter_form.framework + '}}';
	
			// let new_query = 'query SessionsAndObservations {Sessions(filter:{' + filter_string + '}) {id name date framework_id {id name} location_id {id name} partner_id {id name} institution_id {id Name} complete attendance_count primary_audience image {id} summary challenges successes feedback slider_1 slider_2 slider_3 status user_id {id first_name last_name} Observations {id note date_created image {id} dimension_id {id name color} indicator_id {id name} attendee_code is_starred}}}';
			new_query = 'query SessionsAndObservations {Sessions(limit:-1, filter:{' + filter_string + '}) {id name date framework_id {id name} location_id {id name} partner_id {id name} institution_id {id Name} complete attendance_count primary_audience image {id} summary challenges successes feedback slider_1 slider_2 slider_3 status user_id {id first_name last_name} Observations {id note date_created image {id} dimension_id {id name color} indicator_id {id name} attendee_code is_starred}}}';
		} else { // for unfiltered sessions (for date dropdown/selection)
			new_query = 'query SessionsAndObservations {Sessions(limit:-1) {id name date Observations {id note date_created}}}';
		}
		
		await fetch(CONFIG.directus_url+'/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: "Bearer " + user.userAccessToken,
			},
			// body: '{"query":"query SessionsAndObservations {Sessions(filter:{' + 'date: {_gte: "2023-05-01"}' + '}) {id name date framework_id {id} location_id {id} partner_id {id} institution_id {id} complete attendance_count image {id} summary challenges successes feedback slider_1 slider_2 slider_3 status Observations {id note image {id} user_id {first_name} dimension_id {id color} indicator_id {id}}}}"}'
			body: '{"query":"' + new_query + '"}'
		})
		.then(response => response.json())
		.then(response => {
			response.data['Sessions'].forEach(element => {
				// console.log('>>', element);
				// if (element && reduce_to.includes(Number(element.id))) {
					let myDate = new Date(element.date);
					let newDate = myDate.getUTCFullYear() + '/' + (myDate.getMonth() + 1).toString().padStart(2, '0') + '/' + myDate.getDate().toString().padStart(2, '0');
					sessions[element.id] = element;
					sessions[element.id]['observations_count'] = element.Observations.length;
					sessions[element.id]['reformatted_date'] = newDate;
				// }
			});
		})
		.catch(err => console.error(err));
		return sessions;
	},
	async saveSession(which_id, s_form) {
		console.log('> data saveSession', s_form);
		// see if we're logged in
		await user.checkForTokenRefresh();
		// create session avatar image
		let session_image = null;
		if (s_form.observations) {
			for (let i = 0; i < s_form.observations.length; i++) {
				const element = s_form.observations[i];
				session_image = element?.image?.id;
				if (session_image) break;// find first image and get out
			}
		}
		// create session on server and get its ID
		let return_value = null;
		await fetch(CONFIG.directus_url+'/items/Sessions/'+which_id, {
			method: "PATCH",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				//'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
				Authorization: "Bearer " + user.userAccessToken,
			},
			body: JSON.stringify({
				name: s_form.name,
				image: session_image,
				date: s_form.date+'T'+s_form.time,//'2023-05-30T12:00:00',
				location_id: s_form.location_id,
				framework_id: s_form.framework_id,
				partner_id: s_form.partner_id,
				attendance_count: s_form.attendance_count,
				slider_1: s_form.slider_1,
				slider_2: s_form.slider_2,
				slider_3: s_form.slider_3,
				feedback: s_form.feedback,
				challenges: s_form.challenges,
				successes: s_form.successes,
				summary: s_form.summary,
				complete: s_form.complete,
				institution_id: user.userInstitutionID,
				user_id: user.userID,
			}).toString(),
		})
		.then((res) => res.json()) //fix me please and put back into javascript.json
		.then((response) => {
			console.log('???', response);
			if (response.errors) {
				console.log("ERROR 403?", response);
				return_value = false;
			}
			console.log('???', response);
			if (response.data) {
				return_value = response.data;
			}
		})
		.catch(function (err) {
			console.log("Fetch Error :-S", err);
			return false;
		});
		return return_value;
	},
	async startSession(s_form) {
		console.log('> data startSession', user, s_form, user.userInstitutionID);
		// see if we're logged in
		await user.checkForTokenRefresh();

		// create session on server and get its ID
		let return_value = null;
		await fetch(CONFIG.directus_url+'/items/Sessions', {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				//'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
				Authorization: "Bearer " + user.userAccessToken,
			},
			body: JSON.stringify({
				name: s_form.name,
				date: s_form.date+'T'+s_form.time,//'2023-05-30T12:00:00',
				location_id: s_form.location_id,
				framework_id: s_form.framework_id,
				partner_id: s_form.partner_id,
				institution_id: user.userInstitutionID,
				user_id: user.userID,
			}).toString(),
		})
		.then((res) => res.json()) //fix me please and put back into javascript.json
		.then((response) => {
			console.log('???', response);
			if (response.errors) {
				console.log("ERROR 403?", response);
				return_value = false;
			}
			console.log('???', response);
			if (response.data) {
				return_value = response.data;
			}
		})
		.catch(function (err) {
			console.log("Fetch Error :-S", err);
			return false;
		});
		return return_value;
	},
	async deleteSession(which_session_id, s_form) {
		console.log('> data deleteSession', which_session_id, s_form);

		if (which_session_id) { // minimum requirement
			// first delete any images associated with session observations
			for (let i = 0; i < s_form.observations.length; i++) {
				if (s_form.observations[i]?.image?.id) {
					console.log('deleting image ', s_form.observations[i]?.image?.id, JSON.parse(JSON.stringify(s_form)));

					// we have an image, let's delete it
					await fetch(CONFIG.directus_url+'/Files/'+s_form.observations[i]?.image?.id, {
						method: 'DELETE',
						headers: {
							Authorization: "Bearer " + user.userAccessToken,
						},
					})
					.then((res) => res.json()) //fix me please and put back into javascript.json
					.then((response) => {
						if (response.errors) console.log("ERROR 403?", response);
					})
					.catch(function (err) {
						console.log("Fetch Error :-S", err);
					});
				}

				// then delete session observations themselves
				if (s_form.observations[i]?.id) {
					// delete current observation
					await fetch(CONFIG.directus_url+'/items/Observations/'+s_form.observations[i]?.id, {
						method: "DELETE",
						headers: {
							// Accept: "application/json",
							// "Content-Type": "application/json",
							//'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
							Authorization: "Bearer " + user.userAccessToken,
						},
						// body: JSON.stringify(body_array).toString(),
					})
					.then((res) => res.json()) //fix me please and put back into javascript.json
					.then((response) => {
						console.log('response::', response);
						if (response.errors) console.log("ERROR 403?", response);
					})
					.catch(function (err) {
						console.log("Fetch Error :-S", err);
					});
				}
			}

			// finally delete the session
			let return_value = null;
			await fetch(CONFIG.directus_url+'/items/Sessions/'+which_session_id, {
				method: "DELETE",
				headers: {
					Authorization: "Bearer " + user.userAccessToken,
				},
				// body: JSON.stringify(body_array).toString(),
			})
			.then((res) => res.json()) //fix me please and put back into javascript.json
			.then((response) => {
				console.log('response::', response);
				if (response.errors) {
					console.log("ERROR 403?", response);
					return_value = false;
				}
				if (response.data) {
					return_value = response.data;
				}
			})
			.catch(function (err) {
				console.log("Fetch Error :-S", err);
			});

			return return_value;
		}
		return;
	},
	async deleteObservation(which_observation_id, which_session_id, o_form, s_form) {
		console.log('> data deleteObservation', which_observation_id, which_session_id, o_form, s_form);

		if (which_session_id) { // minimum requirement
			// any images attached? We need to delete them
			if (typeof o_form.image == 'string') {
				console.log('Deleting image from soon-to-be-deleted observation:', o_form.image);
				await fetch(CONFIG.directus_url+'/Files/'+o_form.image, {
					method: 'DELETE',
					headers: {
						Authorization: "Bearer " + user.userAccessToken,
					},
				})
				.then((res) => res.json()) //fix me please and put back into javascript.json
				.then((response) => {
					// console.log('R', response);
					if (response.errors) console.log("ERROR 403?", response);
				})
				.catch(function (err) {
					console.log("Fetch Error :-S", err);
				});
			}
	
			// delete current observation
			let return_value = null;
			await fetch(CONFIG.directus_url+'/items/Observations/'+which_observation_id, {
				method: "DELETE",
				headers: {
					// Accept: "application/json",
					// "Content-Type": "application/json",
					//'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
					Authorization: "Bearer " + user.userAccessToken,
				},
				// body: JSON.stringify(body_array).toString(),
			})
			.then((res) => res.json()) //fix me please and put back into javascript.json
			.then((response) => {
				console.log('response::', response);
				if (response.errors) {
					console.log("ERROR 403?", response);
					return_value = false;
				}
				if (response.data) {
					return_value = response.data;
				}
			})
			.catch(function (err) {
				console.log("Fetch Error :-S", err);
			});

			// lastly we need to update the image for the session, should we have just deleted that
			// if (s_form.image = o_form.image) {
				// console.log('the image we deleted was the avatar image for the session!');
				data.saveSession(which_session_id, s_form);
			// }

			return return_value;
		}
		return;
	},

	async saveObservation(which_observation_id, which_session_id, o_form) {
		console.log('> data saveObservation', JSON.parse(JSON.stringify(o_form)));
		// see if we're logged in
		await user.checkForTokenRefresh();
		// see if we have an image we shoudl remove from the server?
		if (typeof o_form.image_removed == 'string') {
			console.log('IMAGE REMOVED:', o_form.image_removed);
			await fetch(CONFIG.directus_url+'/Files/'+o_form.image_removed, {
				method: 'DELETE',
				headers: {
					Authorization: "Bearer " + user.userAccessToken,
				},
			})
			.then((res) => res.json()) //fix me please and put back into javascript.json
			.then((response) => {
				console.log('R', response);
				if (response.errors) {
					console.log("ERROR 403?", response);
					// return_value = false;
				}
				if (response.data) {
					// return_value = response.data;
				}
			})
			.catch(function (err) {
				console.log("Fetch Error :-S", err);
			});
		}
		// see if we have an image to replace it:
		if (typeof o_form.image_temp != 'undefined' && o_form.image_temp) {
			// console.log('o_form.image_temp', o_form.image_temp);
			// upload and get file name
			let dataURI = o_form.image_temp;
			// convert base64/URLEncoded data component to raw binary data held in a string
			var byteString = atob(dataURI.split(',')[1]);
			// separate out the mime component
			var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
			// write the bytes of the string to a typed array
			var ia = new Uint8Array(byteString.length);
			for (var i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i);
			}
			let upload_image_blob = new Blob([ia], {type:mimeString});
			// create form data object
			const formData = new FormData();
			formData.append("storage", "local");
			formData.append("filename_download", "image.png");
			formData.append("name", "image.png");
			formData.append("title", o_form.name);
			formData.append("type", "image/png");
			formData.append('blob', upload_image_blob, "image.png")

			let image_returned = null;
			await fetch(CONFIG.directus_url+'/Files', {
				method: 'POST',
				headers: {
					Authorization: "Bearer " + user.userAccessToken,
				},
				body: formData
			})
			.then(r => r.json())
			.then(data => {
				console.log(data, data.data.id)
				image_returned = data.data.id;
			})

			// then put it in?
			o_form.image = image_returned;
		}

		// set up date to save
		let method = 'PATCH';
		let fetch_slash = '/';
		let body_array = {
			note: o_form.note,
			image: o_form.image,
			attendee_code: o_form.attendee_code,
			dimension_id: (o_form.dimension_id) ? o_form.dimension_id : null,
			indicator_id: (o_form.indicator_id) ? o_form.indicator_id : null,
			is_starred: o_form.is_starred,
		}
		if (!which_observation_id) {
			// create new observation, so slightly different send
			method = 'POST';
			fetch_slash = '';
			// some more parts of the body, too
			body_array.session_id = which_session_id;
			body_array.user_id = user.userID;
			body_array.institution_id = user.userInstitutionID;
			// body_array.date = Quasar.date.formatDate(new Date(), 'YYYY-MM-DDTHH:mm:ss');//'2023-05-30T12:00:00',
		}
		if (which_session_id) { // minimum requirement
			// save current observation
			let return_value = null;
			await fetch(CONFIG.directus_url+'/items/Observations'+fetch_slash+which_observation_id, {
				method: method,
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					//'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
					Authorization: "Bearer " + user.userAccessToken,
				},
				body: JSON.stringify(body_array).toString(),
			})
			.then((res) => res.json()) //fix me please and put back into javascript.json
			.then((response) => {
				if (response.errors) {
					console.log("ERROR 403?", response);
					return_value = false;
				}
				if (response.data) {
					return_value = response.data;
				}
			})
			.catch(function (err) {
				console.log("Fetch Error :-S", err);
			});
			return return_value;
		}
		return;
	},

	async loadRecord(which_table, which_id) {
		console.log('> data loadRecord', which_table, which_id);
		// see if we're logged in
		await user.checkForTokenRefresh();
		// console.log('we should be done with our checkForTokenRefresh: '+user.userAccessToken);
		// create session on server and get its ID
		let return_value = null;
		await fetch(CONFIG.directus_url+'/items/'+which_table+"/"+which_id, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				//'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
				Authorization: "Bearer " + user.userAccessToken,
			},
			// body: JSON.stringify({
			// 	name: s_form.name,
			// 	date: s_form.date+'T'+s_form.time,//'2023-05-30T12:00:00',
			// 	location_id: s_form.location_id,
			// 	framework_id: s_form.framework_id,
			// 	institution_id: user.userInstitutionID,
			// 	user_id: user.userID,
			// }).toString(),
		})
		.then((res) => res.json()) //fix me please and put back into javascript.json
		.then((response) => {
			// console.log('???', response);
			if (response.errors) {
				console.log("ERROR 403?", response);
				return_value = false;
			}
			// console.log('???', response);
			if (response.data) {
				return_value = response.data;
			}
		})
		.catch(function (err) {
			console.log("Fetch Error :-S", err);
			return false;
		});
		return return_value;
	},

	async loadGraphQLRecords(which_table, which_fields, filter_field, filter) {
		console.log('> data loadGraphQLRecords', which_table, which_fields, filter_field, filter);
		// see if we're logged in
		await user.checkForTokenRefresh();
		// console.log('we should be done wiht our checkForTokenRefresh: '+user.userAccessToken);
		// create session on server and get its ID
		let return_value = null;

		let fdi_array = {};
		await fetch(CONFIG.directus_url+'/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: "Bearer " + user.userAccessToken,
			},
			body: '{"query":"query {'+which_table+'(filter: {'+filter_field+': {id: {_eq: '+filter+'}}}) {'+which_fields+'}"}'
			// body: '{"query":"query {Indicators {id name dimension_id {id name framework_id {id name}}}}"}'
		})
		.then(response => response.json())
		.then(response => {
			return_value = response;
			// console.log(response);
			// patch fdi together
			// response.data['Indicators'].forEach(element => {
			// 	// console.log('>>', element);
			// });
			// console.log('fdi_array:::::', fdi_array);
		})
		.catch(err => console.error(err));

		return return_value;
	},
})