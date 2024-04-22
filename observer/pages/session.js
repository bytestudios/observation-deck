const { reactive, ref, watch, date } = Vue
import {CONFIG} from '/config.js'
import {user} from '/observer/store/user.js'
import {data} from '/observer/store/data.js'

export default {
    name: 'Session page',

    setup() {
		var tab = ref("new");
		var tab_enabed_array = ref([true, false, false, false]);
		var observation_form = ref(false);
		var observation_take_photo = ref(false);
		var observation_approve_photo = ref(false);
		var observation_show_photo = ref(false);

		// form setup and validation
		const s_form = reactive({ name: "" });
		const o_form = reactive({ name: "" });
		var tab_1_button_enabled = ref(false);
		var tab_1_warning = ref('');
		watch(s_form, (newValue, oldValue) => {
			validate(newValue);
		});
		watch(o_form, (newValue, oldValue) => {
			validate_observation(newValue);
		});

        const {onMounted} = Vue;
		onMounted(async () => {
			// see if we have a record to load
			const route = VueRouter.useRoute();
			if (route.params.id) {
				await load_session_and_observations(route.params.id);
				data.currentPage = s_form.name;
			} else {
				data.currentPage = 'New Session';
			}
			// s_form.feedback = 'test';
		});

		function validate() {
			// console.log("validate", s_form);
			tab_1_button_enabled.value = (s_form.name && s_form.date && s_form.time && s_form.framework_id)
			if (!s_form.name) tab_1_warning.value = 'Name is required';
			// reset if we're all good
			if (tab_1_button_enabled.value) tab_1_warning.value = '';
		}
		function validate_observation() {
			// TODO do we need this?
			return true;
		}
		function fill_form() {
			// TEMPORARY way to test
			console.log("fill_form", s_form);
			s_form.name = 'My Session Name';s_form.location_id = 1;s_form.framework_id = 1;
			// get current date/time and convert it so toISOString will pushed it to our timezone
			let todays_date = new Date(new Date().toLocaleString("en", { timeZone: "America/Chicago" }));
			var todays_date_offset = new Date(todays_date.getTime() - todays_date.getTimezoneOffset() * 60000);
			s_form.date =
				todays_date_offset.toISOString().split("T")[0] +
				" " +
				todays_date_offset.toISOString().split("T")[1].substring(0, 5);
			s_form.date = todays_date_offset.toISOString().split("T")[0];
			s_form.time = todays_date_offset.toISOString().split("T")[1].substring(0, 5);
		}
		async function load_observations(which_id) {
			console.log('> load_obversations');
			let loaded_observations = await data.loadGraphQLRecords('Observations', 'id note date_created date_updated image{id} is_starred attendee_code dimension_id{id} indicator_id{id}}', 'session_id', which_id);
			s_form.observations = loaded_observations.data['Observations'];
			for (let index = 0; index < s_form.observations.length; index++) {
				s_form.observations[index].dimension_id = (s_form.observations[index].dimension_id) ? s_form.observations[index].dimension_id.id : null;
				s_form.observations[index].indicator_id = (s_form.observations[index].indicator_id) ? s_form.observations[index].indicator_id.id : null;
				s_form.observations[index].time_created = Quasar.date.formatDate(s_form.observations[index].date_created, 'h:mm a');
				s_form.observations[index].new_image = '';
			}
		}
		async function load_session_and_observations(which_id) {
			console.log('> load_session_and_observations');
			let loaded_sessions = await data.loadRecord('Sessions', which_id);
			// let loaded_observations = await data.loadGraphQLRecords('Observations', 'id note date_created date_updated image{id} is_starred attendee_code dimension_id{id} indicator_id{id}}', 'session_id', which_id);
			// assign to s_form
			s_form.id = loaded_sessions.id;
			s_form.name = loaded_sessions.name;
			s_form.date = loaded_sessions.date.split('T')[0];
			s_form.time = loaded_sessions.date.split('T')[1];
			s_form.location_id = loaded_sessions.location_id;
			s_form.framework_id = loaded_sessions.framework_id;
			s_form.partner_id = loaded_sessions.partner_id;
			s_form.attendance_count = loaded_sessions.attendance_count;
			s_form.primary_audience = loaded_sessions.primary_audience;
			s_form.slider_1 = loaded_sessions.slider_1;
			s_form.slider_2 = loaded_sessions.slider_2;
			s_form.slider_3 = loaded_sessions.slider_3;
			s_form.feedback = loaded_sessions.feedback;
			s_form.challenges = loaded_sessions.challenges;
			s_form.successes = loaded_sessions.successes;
			s_form.summary = loaded_sessions.summary;
			s_form.complete = loaded_sessions.complete;
			// now load the observations
			load_observations(which_id);
			// s_form.observations = loaded_observations.data['Observations'];
			// post process observations
			// for (let index = 0; index < s_form.observations.length; index++) {
			// 	s_form.observations[index].dimension_id = (s_form.observations[index].dimension_id) ? s_form.observations[index].dimension_id.id : null;
			// 	s_form.observations[index].indicator_id = (s_form.observations[index].indicator_id) ? s_form.observations[index].indicator_id.id : null;
			// 	s_form.observations[index].time_created = Quasar.date.formatDate(s_form.observations[index].date_created, 'h:mm a');
			// 	s_form.observations[index].new_image = '';
			// }
			// console.log(JSON.parse(JSON.stringify(s_form.observations)));
			tab_enabed_array.value[1] = true;
			tab_enabed_array.value[2] = true;
			tab_enabed_array.value[3] = true;
		}
		async function start_session() {
			// console.log("start_session", s_form);
			// save session
			s_form.loading_start_session = true;// loading indicator
			await data.startSession(s_form).then((fc_results) => {
				console.log('fc', fc_results);
				if (fc_results) {
					console.log('---> YES! with new ID:', fc_results.id);
					// affect tabs
					tab_enabed_array.value[1] = true;
					tab.value = "observations";
					// try to push to the correct data
					s_form.id = fc_results.id
					data.currentPage = s_form.name;
					// TODO do we need to change the URL, or forward them for real?
					// turn off loading indicator
					s_form.loading_start_session = false;
					load_session_and_observations(fc_results.id);
					// tab_enabed_array.value[2] = true;
					// tab_enabed_array.value[3] = true;
				} else {
					console.log('---> NO!');
				}
			});
			// fetch current sessions and save them to LS
			await user.fetchCollection("items/Sessions",'?filter[status][_eq]=published&filter[user_id][_eq]=' + user.userID).then((fc_results) => {
				user.sessions = fc_results;
				window.localStorage.setItem("sessions", JSON.stringify({ data: fc_results }));
			});
		}
		async function try_autosave() {
			// if we have an ID, it means we're editing a live record, so save
			if (s_form.id) save_session(s_form.id);
		}
		async function save_session(which_id, go_home = false) {
			// console.log("save_session", which_id, s_form);
			// save session
			await data.saveSession(which_id, s_form).then((fc_results) => {
				console.log('fc', fc_results);
				if (fc_results) {
					console.log('---> YES! with new ID:', fc_results.id);
				} else {
					console.log('---> NO!');
					$q.dialog({
						title: 'Error',
						message: 'A data error prevented the session from being saved. Please try again. If the problem persists, please contact support.',
					})		
				}
			});
			// so refresh sessions
			await user.fetchCollection("items/Sessions", '?filter[status][_eq]=published&filter[user_id][_eq]=' + user.userID).then((fc_results) => {
				user.sessions = fc_results;
				window.localStorage.setItem("sessions", JSON.stringify({ data: fc_results }));
			});
			if (go_home) {
				// requested to close session
				// and go home
				Vue.$router.push('/');
			} else {
				// fetch current sessions and save them to LS
				// await user.fetchCollection("items/Sessions").then((fc_results) => {
				// 	user.sessions = fc_results;
				// 	window.localStorage.setItem("sessions", JSON.stringify({ data: fc_results }));
				// });
			}
		}
		async function delete_session(which_id, go_home = false) {
			// console.log("delete_session", which_id, s_form);

			$q.dialog({
				title: 'Delete',
				message: 'Would you like to delete this session?',
				cancel: true,
				persistent: true
			}).onOk(() => {
				delete_session_confirmed(which_id);
			}).onOk(() => {
				console.log('>>>> second OK catcher')
			}).onCancel(() => {
				// console.log('>>>> Cancel')
			}).onDismiss(() => {
				// console.log('I am triggered on both OK and Cancel')
			})
		}
		async function delete_session_confirmed(which_id, go_home = false) {
			// console.log("delete_session", which_id, s_form);
			// delete session
			await data.deleteSession(which_id, s_form).then((fc_results) => {
				console.log('fc', fc_results);
				if (fc_results) {
					console.log('---> YES!', fc_results.id);
				} else {
					console.log('---> NO!');
				}
			});

			// so refresh sessions
			await user.fetchCollection("items/Sessions", '?filter[status][_eq]=published&filter[user_id][_eq]=' + user.userID).then((fc_results) => {
				user.sessions = fc_results;
				window.localStorage.setItem("sessions", JSON.stringify({ data: fc_results }));
			});
			// and go home
			Vue.$router.push('/');
		}
		async function save_observation(which_observation_id, which_session_id) {
			console.log('> save_observation ', which_observation_id, which_session_id, JSON.parse(JSON.stringify(o_form)));
			// save session
			o_form.saving = true;
			await data.saveObservation(which_observation_id, which_session_id, o_form).then((fc_results) => {
				console.log('fc', fc_results);
				if (fc_results) {
					console.log('---> YES! with new ID:', fc_results.id);
				} else {
					console.log('---> NO!');
				}
				this.observation_form = false;
				open_observation();// clear out values of o_form
				// reload obversations
				load_observations(which_session_id);
				o_form.saving = false;
			});
		}

		const $q = Quasar.useQuasar()
		async function delete_observation(which_observation_id, which_session_id) {
			console.log('> delete_observation ', which_observation_id, which_session_id);

			$q.dialog({
				title: 'Delete',
				message: 'Would you like to delete this observation?',
				cancel: true,
				persistent: true
			}).onOk(() => {
				// save session
				if (!which_observation_id) return;// safety
				data.deleteObservation(which_observation_id, which_session_id, o_form, s_form).then((fc_results) => {
					console.log('fc', fc_results);
					if (fc_results) {
						console.log('---> YES! with new ID:', fc_results.id);
					} else {
						console.log('---> NO!');
					}
					this.observation_form = false;
					open_observation();// clear out values of o_form
					// reload obversations
					load_observations(which_session_id);
				});
			}).onOk(() => {
				console.log('>>>> second OK catcher')
			}).onCancel(() => {
				// console.log('>>>> Cancel')
			}).onDismiss(() => {
				// console.log('I am triggered on both OK and Cancel')
			})
			
		}

		// create local list for indicators select box
		const local_indicators_list = [];
		for (const key in user.indicatorsList) {
			local_indicators_list[key] = [];
			for (const key2 in user.indicatorsList[key]) {
				local_indicators_list[key].push({value: key2, label: user.indicatorsList[key][key2]})
			}
		};
		console.log('IN THE END', local_indicators_list);

		function open_observation(which = null) {
			console.log('> open_observation', which);
			if (which !== null) {
				let this_observation = s_form.observations[which];
				// o_form.current_id = which;
				o_form.id = this_observation.id;
				o_form.is_starred = (this_observation.is_starred) ? true : false;
				o_form.note = this_observation.note;
				o_form.dimension_id = this_observation.dimension_id;
				o_form.indicator_id = this_observation.indicator_id;
				o_form.attendee_code = this_observation.attendee_code;
				o_form.date_updated = this_observation.date_updated;
				o_form.image = this_observation.image?.id;
			} else {
				console.log('clearing out form');
				o_form.image = o_form.image_temp = o_form.image_removed = null;
				o_form.id = o_form.note = o_form.dimension_id = o_form.indicator_id = o_form.attendee_code = o_form.date_updated = '';
				o_form.is_starred = false;
			}
		}

		/* camera stuff */
		// photo?
		const width = 640; // We will scale the photo width to this
		let height = 0; // This will be computed based on the input stream

		// |streaming| indicates whether or not we're currently streaming
		// video from the camera. Obviously, we start at false.

		let streaming = false;
		let video_stream = false;

		// The various HTML elements we need to configure or control. These
		// will be set by the startup() function.

		let video = null;
		let camera_one = {};
		let camera_two = {};
		let canvas = null;
		let photo = null;
		let startbutton = null;
		function showViewLiveResultButton() {
			if (window.self !== window.top) {
				// Ensure that if our document is in a frame, we get the user
				// to first open it in its own tab or window. Otherwise, it
				// won't be able to request permission for camera access.
				document.querySelector(".contentarea").remove();
				const button = document.createElement("button");
				button.textContent = "View live result of the example code above";
				document.body.append(button);
				button.addEventListener("click", () => window.open(location.href));
				return true;
			}
			return false;
		}
		async function take_photo() {
			
			await new Promise(resolve => setTimeout(resolve, 500)); // lil delay

			const devices = await navigator.mediaDevices.enumerateDevices();
			const videoDevices = devices.filter(device => device.kind === 'videoinput');
			console.log('devices:::', videoDevices);
			camera_one = videoDevices[0].deviceId;
			if (videoDevices[1]) camera_two = videoDevices[0].deviceId;
			console.log('devices:::', camera_one, camera_two);
			// const options = videoDevices.map(videoDevice => {
			// 	return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
			// });
			// video_options = v_options;
			// const v_options = videoDevices.map(videoDevice => {
			//   return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
			// });
			// cameraOptions.innerHTML = options.join('');

			if (showViewLiveResultButton()) {
				return;
			}
			video = document.getElementById("video");
			canvas = document.getElementById("canvas");
			startbutton = document.getElementById("startbutton");

			// start stream
			navigator.mediaDevices.getUserMedia({ 
				video: true, 
				audio: false 
			})
			.then((stream) => {
				video.srcObject = stream;
				window.localStream = stream;// cast to global variable
				video.play();
			})
			.catch((err) => {
				console.error(`An error occurred: ${err}`);
			});

			video.addEventListener(
				"canplay",
				(ev) => {
					if (!streaming) {
						height = video.videoHeight / (video.videoWidth / width);
						console.log('VIDEO?', video.videoHeight, video.videoWidth);// 640x480 currently
						// Firefox currently has a bug where the height can't be read from
						// the video, so we will make assumptions if this happens.

						if (isNaN(height)) {
							height = width / (4 / 3);
						}

						video.setAttribute("width", width);
						video.setAttribute("height", height);
						canvas.setAttribute("width", width);
						canvas.setAttribute("height", height);
						streaming = true;
					}
				},
				false
			);

			clearphoto();
		}
		function close_camera() {
			localStream.getVideoTracks()[0].stop();
		}

		// Fill the photo with an indication that none has been
		// captured.

		function clearphoto() {
			const context = canvas.getContext("2d");
			context.fillStyle = "#AAA";
			context.fillRect(0, 0, canvas.width, canvas.height);

			const data = canvas.toDataURL("image/png");
			// photo.setAttribute("src", data);
		}

		// Capture a photo by fetching the current contents of the video
		// and drawing it into a canvas, then converting that to a PNG
		// format data URL. By drawing it on an offscreen canvas and then
		// drawing that to the screen, we can change its size and/or apply
		// other changes before drawing it.

		async function takepicture() {
			console.log('> takepicture');
			await new Promise(resolve => setTimeout(resolve, 500)); // lil delay
			
			const context = canvas.getContext("2d");
			if (width && height) {
				console.log('> 1');
				canvas.width = width;
				canvas.height = height;
				context.drawImage(video, 0, 0, width, height);

				const data = canvas.toDataURL("image/png");
				photo = document.getElementById("photo");
				photo.setAttribute("src", data);
				// save to local storage?
				localStorage.setItem("image", data);
				// s_form.observations[o_form.id].new_image = data;
				// turn off camera
				localStream.getVideoTracks()[0].stop();
				// console.log('did we run this???? //////');
			} else {
				clearphoto();
			}
		}
		
		async function use_picture() {
			console.log('> use_picture');
			o_form.image_temp = localStorage.getItem("image");
		}
		
		// try file system
		let image_file = ref();
		let image_file_src = ref();
		function onFileChange(which) {
			console.log('> onFileChange', which.target);
			const input = image_file_input.value;
			const files = input.files;
			if (files && files[0]) {
				console.log('here');
				let FileImage = files[0];
				const reader = new FileReader();
				reader.onload = e => {
					console.log('here here');
					// image_file_src = e.target.result;
					// console.log('e.target:', e.target.result);
					// document.getElementById("testimage").src=e.target.result;
					// o_form.image = true;
					o_form.image_temp = e.target.result;
				};
				reader.readAsDataURL(files[0]);
				// this.$emit("input", files[0]);
			}
			// image_file_src = URL.createObjectURL(which.target);
		}
		function onFileRejected(which) {
			console.log('> onFileRejected', which);
		}
		const image_file_input = ref(null);
		function choosepicture() {
			setTimeout(() => {
				console.log('trying');
				image_file_input.value.click();
			}, 150);
		}

		let user_partners_data = ref(user.partners.data);

		return {CONFIG, user, tab, tab_enabed_array, tab_1_button_enabled, tab_1_warning, s_form, fill_form, 
			observation_form, 
			// filterFn, 
			// options, 
			start_session, 
			try_autosave,
			save_session,
			delete_session,
			open_observation,
			// observations
			o_form,
			local_indicators_list,
			save_observation,
			delete_observation,
			// picture stuff
			observation_take_photo,
			observation_approve_photo,
			observation_show_photo,
			take_photo,
			takepicture,
			use_picture,
			close_camera,
			video_stream,
			video,
			canvas,
			photo,
			startbutton,
			image_file,
			image_file_src,
			image_file_input,
			choosepicture,
			onFileChange,
			onFileRejected,
			user_partners_data, 
			filterFn (val, update, abort) { // filter partners dropdown
				// console.log('----filterFn, val:', val, '| update:', update, '| abort:', abort);
				update(() => {
					let cur_user_partners_data = JSON.parse(JSON.stringify(user.partners.data)); // reset cur_user_partners_data in case they backspace and so that we don't edit the OG user.partners.data

					Object.keys(cur_user_partners_data).forEach(key => { // cycle through cur_user_partners_data
						// console.log('->>>', key, cur_user_partners_data[key]);
						const needle = val.toLowerCase() // make neutral input value
						// if (cur_user_partners_data[key].name.toLowerCase().includes(needle)) console.log('YAY:', needle, 'IS IN', cur_user_partners_data[key].name);
						// if (!cur_user_partners_data[key].name.toLowerCase().includes(needle)) console.log('BOO:', needle, 'IS NOT IN', cur_user_partners_data[key].name);
						// if neutral input is not in neutral option, hide that guy
						if (!cur_user_partners_data[key].name.toLowerCase().includes(needle)) delete cur_user_partners_data[key];
					});
					user_partners_data.value = cur_user_partners_data; // update so select will reflect the change
				})
			}
		}
	},

    template: `
		<!-- home -->
		<section id="home" class="row items-center justify-center" style="">  

			<q-tab-panels v-model="tab" animated style="width: 100%">
				<q-tab-panel name="new">
					<div class="text-h6 flex">
						<div style="flex-grow: 1">Details</div>
						<a v-if="s_form.id" href="#" @click="delete_session(s_form.id)" class="text-red-8 delete-link" style="text-decoration:none; font-size: 14px;">
							Delete Session <q-icon name="delete" />
						</a>
					</div>
					<q-form q-gutter-md>
						<q-input outlined label="Session Name (required)" v-model="s_form.name" @change="try_autosave" type="text" style="margin-bottom: 10px"></q-input>
						<q-select v-if="user.locations.data.length" outlined label="Location" v-model="s_form.location_id" @change="try_autosave" emit-value map-options clearable :options="user.locations.data" option-label="name" option-value="id" style="margin-bottom: 10px"></q-select>
						<q-select v-if="user.partners.data.length" outlined label="Partner" v-model="s_form.partner_id" @change="try_autosave" emit-value map-options clearable :options="user_partners_data" :option-label="(opt) => (Object(opt) === opt && 'name' in opt ? opt.name : null)" :option-value="(opt) => (Object(opt) === opt && 'id' in opt ? opt.id : null)" style="margin-bottom: 10px" use-input input-debounce="0" @filter="filterFn" >
							<template v-slot:no-option>
								<q-item>
								<q-item-section class="text-grey">
									No results
								</q-item-section>
								</q-item>
							</template>
						</q-select>

						<div style="display: flex; margin-bottom: 10px">
							<q-input outlined label="Date (required)" v-model="s_form.date" @change="try_autosave" type="date" style="width: 100%"></q-input>
							&nbsp;&nbsp;&nbsp;
							<q-input outlined label="Time (required)" v-model="s_form.time" @change="try_autosave" type="time" style="width: 100%"></q-input>
						</div>
						<q-select v-if="user.fdis" outlined label="Framework (required)" v-model="s_form.framework_id" @change="try_autosave" emit-value map-options 
							:options="Object.values(user.fdis.data)" 
							:option-label="(opt) => (Object(opt) === opt && 'framework_name' in opt ? opt.framework_name : null)" 
							:option-value="(opt) => (Object(opt) === opt && 'framework_id' in opt ? opt.framework_id : null)" 
							style="margin-bottom: 10px">
						</q-select>

						<!--from https://quasar.dev/vue-components/select#filtering-and-autocomplete -->
						<!--<q-select use-chips multiple outlined label="Partner(s)" @filter="filterFn" @keyup.enter="'addTag'" use-input input-debounce="0" v-model="s_form.partner_ids" emit-value map-options 
							:options="user.partners.data" 
							:option-label="(opt) => (Object(opt) === opt && 'name' in opt ? opt.name : null)" 
							:option-value="(opt) => (Object(opt) === opt && 'id' in opt ? opt.id : null)" 
							style="margin-bottom: 10px">
							<template #selected-item="scope">
								<slot name="selected-item" :scope="scope">
									<q-chip :removable="scope.opt !== 'Facebook'" :dark="scope.opt === 'Facebook'" dense :tabindex="scope.tabindex" @remove="scope.removeAtIndex(scope.index)">
										{{scope.opt.name}}
									</q-chip>
								</slot>
							</template>
						</q-select>-->
						<!--
						<q-input v-model="s_form.partner_id" @filter="filterFn" outlined @keyup.enter="'addTag'" dense>
							<template v-slot:prepend>
							<q-chip removable @remove="form.tags.splice(key, 1)" v-for="(tag, key) in ['test','tety']" :key="key">
								{{tag}}
							</q-chip>
							</template>
						</q-input>
						-->

						<q-btn v-if="!s_form.id" color="primary" :disable="!tab_1_button_enabled" style="width: 100%" :loading="s_form.loading_start_session" @click="start_session">Start Session</q-btn>
						<div v-if="s_form.id" class="row no-wrap">
							<!--<q-btn color="primary" label="Update Session" :disable="!tab_1_button_enabled" @click="save_session(s_form.id)" style="width: 90%;" />-->
							<!--<q-btn class="text-red-8 q-ml-lg" icon="delete" @click="delete_session(s_form.id)" />-->
						</div>
						{{tab_1_warning}}
					</q-form>
				</q-tab-panel>

				<q-tab-panel name="observations">
					<div class="text-h6">Observations</div>
					<q-list bordered separator>
						<q-item clickable @click="open_observation(key);observation_form = true" v-ripple v-for="observation, key in s_form.observations">
							<q-item-section avatar>
								<q-avatar rounded size="60px">
									<img v-if="observation.image && observation.image.id" :src="CONFIG.directus_url+'/assets/'+observation.image?.id+'?access_token='+user.userAccessToken+'&width=60&height=60&fit=cover&quality=60'">
								</q-avatar>
							</q-item-section>
							<q-item-section>
								<q-item-label>
									<q-icon v-if="observation.is_starred" color="secondary" name="grade" />
									<q-icon v-else color="secondary" name="star_border" />
									{{observation.time_created}}
									<div style="float: right">{{observation.attendee_code}}</div>
								</q-item-label>
								<q-separator />
								<q-item-label>{{observation.note}}</q-item-label>
								<q-item-label v-if="observation.dimension_id" caption><b>{{user.dimensionsList[s_form.framework_id][observation.dimension_id]}}:</b> <template v-if="observation.indicator_id">{{user.indicatorsList[observation.dimension_id][observation.indicator_id]}}</template></q-item-label>
							</q-item-section>
						</q-item>
					</q-list>
					<br />
					<q-btn color="primary" class="full-width q-mb-xl" @click="open_observation();observation_form = true"> Add Observation </q-btn>

					<q-dialog v-model="observation_form" style="max-height: 100%;">
						<q-card class="q-mb-xl" style="width: 100%;padding: 10px;">
							<q-toolbar>
								<q-toolbar-title v-if="o_form.id">Edit Observation</q-toolbar-title>
								<q-toolbar-title v-else>New Observation</q-toolbar-title>
								<q-btn flat round dense icon="close" @click="open_observation()" v-close-popup />
							</q-toolbar>

							<q-separator />

							<q-form q-gutter-md>
								<div><q-checkbox size="40px" color="secondary" v-model="o_form.is_starred" checked-icon="star" unchecked-icon="star_border" label="Highlight for social media or storytelling" /></div>
								<!--<q-btn v-if="!o_form.image" @click="observation_take_photo = true;take_photo()" style="width: 100%;margin: 10px 0;"><q-icon color="primary" name="camera" />Open Camera</q-btn>-->

								<q-btn v-if="!o_form.image && !o_form.image_temp" @click="choosepicture" style="width: 100%;margin: 10px 0;"><q-icon color="primary" name="camera" />Open Camera</q-btn>
								<!--<img id="testimage" src="" style="max-width: 100%">-->
								<!--<div :style="'background-image: url('+image_file_src+')'" @click="choosepicture">
									<span v-if="!image_file_src" class="placeholder" style="cursor: pointer">Choose a picture</span>
									</div>-->
								<input hidden class="file-input" ref="image_file_input" type="file" @input="onFileChange" />


								<a v-if="o_form.image" href="#" @click="observation_show_photo = true;"><img :src="CONFIG.directus_url+'/assets/'+o_form.image+'?access_token='+user.userAccessToken+'&width=128&height=128&fit=cover&quality=60'" /></a>
								<!--<br />Current:{{o_form.image}}
								<br />Removing:{{o_form.image_removed}}
								<br />Adding:-->
								<a v-if="o_form.image_temp" href="#" @click="observation_show_photo = true"><img :src="o_form.image_temp" style="max-width: 100%;" /></a>
								<q-input outlined label="Note" v-model="o_form.note" type="textarea" style="margin-bottom: 10px"></q-input>
								<q-select outlined label="Dimension" v-model="o_form.dimension_id" emit-value map-options @update:model-value="o_form.indicator_id = null;" :options="Object.values(user.fdis.data[s_form.framework_id].dimensions)" :option-label="(opt) => (Object(opt) === opt && 'name' in opt ? opt.name : null)" :option-value="(opt) => (Object(opt) === opt && 'id' in opt ? opt.id : null)" style="margin-bottom: 10px">
									<template v-slot:selected-item="{ opt }">
										<div :style="'width: 20px;height: 20px;margin-right: 5px;border-radius:10px;background-color:'+opt.color"></div>
										{{opt.name}}
									</template>
									<template v-slot:option="{ itemProps, opt, selected, toggleOption }">
										<q-item v-bind="itemProps">
										<q-item-section side>
											<div :style="'width: 20px;height: 20px;border-radius:10px;background-color:'+opt.color"></div>
										</q-item-section>
										<q-item-section>
											<q-item-label v-html="opt.name" />
										</q-item-section>
										</q-item>
									</template>
								</q-select>
								<q-select :disable="!o_form.dimension_id" outlined label="Indicator" v-model="o_form.indicator_id" emit-value map-options :options="local_indicators_list[o_form.dimension_id]" style="margin-bottom: 10px"></q-select>
								<q-input outlined label="Attendee Code" v-model="o_form.attendee_code" type="text" style="margin-bottom: 10px"></q-input>

								<q-btn v-if="!o_form.id" :loading="o_form.saving" color="primary" :disable="!tab_1_button_enabled" style="width: 100%;margin-bottom:100px;" @click="save_observation(o_form.id, s_form.id)">Save Observation</q-btn>
								<div v-if="o_form.id" class="row no-wrap">
									<q-btn color="primary" label="Update Observation" @click="save_observation(o_form.id, s_form.id)" style="width: 90%;" />
									<q-btn class="text-red-8 q-ml-lg" label="" icon="delete" @click="delete_observation(o_form.id, s_form.id)" />
								</div>

							</q-form>
						</q-card>

					</q-dialog>

					<q-dialog v-model="observation_take_photo" persistent maximized>
						<q-layout view="Lhh lpR fff" container class="bg-white text-dark">
							<q-header class="bg-primary">
								<q-toolbar>
									<q-toolbar-title>Take Photo</q-toolbar-title>
									<q-btn flat v-close-popup round dense icon="close" @click="close_camera" />
								</q-toolbar>
							</q-header>
							<q-page>
								<div id="video_container" style="width: 100%;height: 320px;">
									<video class="q-mt-xl" style="transform-origin: top left;scale: .5" id="video">Video stream not available.</video>
								</div>
								<q-btn @click="close_camera">Close camera</q-btn>
								<q-btn @click="takepicture();observation_take_photo = false;observation_approve_photo = true;">Take photo</q-btn>
								<canvas id="canvas" style="display: none"></canvas>
								<div class="output">...taking photo</div>
							</q-page>
						</q-layout>
					</q-dialog>

					<!--<q-dialog v-model="observation_approve_photo" persistent maximized>
						<q-layout view="Lhh lpR fff" container class="bg-white text-dark">
							<q-header class="bg-primary">
								<q-toolbar>
									<q-toolbar-title >Approve Photo</q-toolbar-title>
									<q-btn flat v-close-popup round dense icon="close" />
								</q-toolbar>
							</q-header>
							<q-page>
								<img id="photo" alt="The screen capture will appear in this box." style="max-width: 320px;" />
								<q-btn @click="use_picture();observation_approve_photo = false;">Use Picture</q-btn>
								<q-btn @click="observation_approve_photo = false;observation_take_photo = true;take_photo()">Retake 1</q-btn>
								<template v-if="!o_form.image">WHAT???</template>
							</q-page>
						</q-layout>
					</q-dialog>-->

					<q-dialog v-model="observation_show_photo" persistent maximized>
						<q-layout view="Lhh lpR fff" container :class="(($q.dark.isActive) ? 'bg-dark' : 'bg-white')">
							<q-header class="bg-primary">
								<q-toolbar>
									<q-toolbar-title>Photo</q-toolbar-title>
									<q-btn flat v-close-popup round dense icon="close" />
								</q-toolbar>
							</q-header>
							<q-page>
								<img v-if="o_form.image" :src="CONFIG.directus_url+'/assets/'+o_form.image+'?access_token='+user.userAccessToken+'&quality=60'" style="max-width: 100%;margin-top: 60px;" />
								<img v-if="o_form.image_temp" :src="o_form.image_temp" style="max-width: 320px;filter:sepia(1);" />
								<div class="text-center">
									<q-btn v-if="o_form.image" @click="o_form.image_removed=o_form.image;o_form.image = null;observation_show_photo = false;">Remove Saved Photo</q-btn>
									<q-btn v-if="o_form.image_temp" @click="o_form.image_temp = false;observation_show_photo = false;">Remove Temp Photo</q-btn>
									<q-btn @click="o_form.image_removed=o_form.image;o_form.image = null;observation_show_photo = false;choosepicture()" style="margin: 10px 0;"><q-icon color="primary" name="camera" />Retake Photo</q-btn>
								</div>

								<!--<q-btn @click="observation_show_photo = false;observation_approve_photo = false;observation_take_photo = true;take_photo()">Retake 2</q-btn>-->
							</q-page>
						</q-layout>
					</q-dialog>

				</q-tab-panel>

				<q-tab-panel name="summary" style="height: calc(100vh - 89px)">
					<div class="text-h6">Summary</div>
					<q-input outlined label="Attendance" type="number" step="any" v-model="s_form.attendance_count" @change="try_autosave" style="margin-bottom: 10px"></q-input>
					<q-select outlined label="Age Group" v-model="s_form.primary_audience" @change="try_autosave" emit-value map-options clearable :options="[{id:'Children 0-5',name:'Children 0-5'},{id:'Children 6-11',name:'Children 6-11'},{id:'Young Adult 12-18',name:'Young Adult 12-18'},{id:'Adult 19+',name:'Adult 19+'},{id:'General interest (all ages)',name:'General interest (all ages)'}]" option-label="name" option-value="id" style="margin-bottom: 10px"></q-select>
					<div class="q-mt-md" v-if="user.institution.data.session_slider_1_question">
						{{user.institution.data.session_slider_1_question}}
						<q-slider v-model="s_form.slider_1" @change="try_autosave" :min="0" :max="100" label color="light-green" />
						<div class="row no-wrap full-width">
							<div style="width: 33%;">{{user.institution.data.session_slider_1_label_low}}</div>
							<div class="text-center" style="width: 34%;">{{user.institution.data.session_slider_1_label_medium}}</div>
							<div class="text-right" style="width: 33%;">{{user.institution.data.session_slider_1_label_high}}</div>
						</div>
					</div>
					<div class="q-mt-md" v-if="user.institution.data.session_slider_2_question">
						{{user.institution.data.session_slider_2_question}}
						<q-slider v-model="s_form.slider_2" @change="try_autosave" :min="0" :max="100" label color="light-green" />
						<div class="row no-wrap full-width">
							<div style="width: 33%;">{{user.institution.data.session_slider_2_label_low}}</div>
							<div class="text-center" style="width: 34%;">{{user.institution.data.session_slider_2_label_medium}}</div>
							<div class="text-right" style="width: 33%;">{{user.institution.data.session_slider_2_label_high}}</div>
						</div>
					</div>
					<div class="q-mt-md" v-if="user.institution.data.session_slider_3_question">
						{{user.institution.data.session_slider_3_question}}
						<q-slider v-model="s_form.slider_3" @change="try_autosave" :min="0" :max="100" label color="light-green" />
						<div class="row no-wrap full-width">
							<div style="width: 33%;">{{user.institution.data.session_slider_3_label_low}}</div>
							<div class="text-center" style="width: 34%;">{{user.institution.data.session_slider_3_label_medium}}</div>
							<div class="text-right" style="width: 33%;">{{user.institution.data.session_slider_3_label_high}}</div>
						</div>
					</div>
					<q-input class="q-mt-lg" outlined label="Logistical feedback" type="textarea" v-model="s_form.feedback" @change="try_autosave" />
					<!--<q-btn color="primary" class="q-mt-md q-mb-xl full-width" @click="save_session(s_form.id, false);tab = 'reflections';">Continue to Create Reflection</q-btn>-->
					&nbsp;
				</q-tab-panel>

				<q-tab-panel name="reflections" style="height: calc(100vh - 89px)">
					<div class="text-h6">Reflections</div>
					<div class="q-px-sm" style="border-radius: 5px;border: 1px solid #888;">
						Tagged Dimensions
						<div class="row no-wrap">
							<div v-for="v, k in Object.values(user.fdis.data[s_form.framework_id]['dimensions'])" class="row items-end" :style="'border: 1px solid #888;width: calc(100% / '+Object.values(user.fdis.data[s_form.framework_id]['dimensions']).length+');'">
								<div v-if="s_form.observations.filter(obj => {return obj.dimension_id === v.id}).length" :style="'background-color: '+v.color+';height:'+(s_form.observations.filter(obj => {return obj.dimension_id === v.id}).length * 15)+'px;width:100%;color:white;text-align:center;font-size:13px;'">
									{{s_form.observations.filter(obj => {return obj.dimension_id === v.id}).length}}
								</div>
							</div>
						</div>
						<div class="row no-wrap">
							<div v-for="v, k in Object.values(user.fdis.data[s_form.framework_id]['dimensions'])" class="row items-end" :style="'width: calc(100% / '+Object.values(user.fdis.data[s_form.framework_id]['dimensions']).length+');'">
								<div class="text-no-wrap text-caption ellipsis">{{v.dimension_name}}</div>
							</div>
						</div>
					</div>
					<q-separator />
					<q-input class="q-mt-md" outlined label="What were the challenges?" type="textarea" v-model="s_form.challenges" @change="try_autosave" />
					<q-input class="q-mt-md" outlined label="What were the successes?" type="textarea" v-model="s_form.successes" @change="try_autosave" />
					<q-input class="q-mt-md" outlined label="Summary?" type="textarea" v-model="s_form.summary" @change="try_autosave" />
					<q-checkbox class="q-mt-md" v-model="s_form.complete" label="Mark session as complete" @click="try_autosave" />
					<!--<q-btn v-if="!s_form.complete" color="primary" class="q-mt-md q-mb-xl full-width" @click="s_form.complete = true;save_session(s_form.id, true);">Submit as Completed</q-btn>
					<q-btn v-if="s_form.complete" color="primary" class="q-mt-md q-mb-xl full-width" @click="s_form.complete = false;save_session(s_form.id, true);">Submit as Incompleted</q-btn>-->
					&nbsp;
				</q-tab-panel>
			</q-tab-panels>

			<q-tabs v-if="s_form.id" v-model="tab" dense inline-label :class="'full-width fixed-bottom '+(($q.dark.isActive) ? 'bg-dark' : 'bg-white')">
				<q-tab name="new" :label="tab == 'new' ? 'Details' : ''" icon="event_available" :disable="!tab_enabed_array[0]" />
				<q-tab name="observations" icon="browse_gallery" :disable="!tab_enabed_array[1]" :label="tab == 'observations' ? 'Observations' : ''" />
				<q-tab name="summary" icon="edit" :disable="!tab_enabed_array[2]" :label="tab == 'summary' ? 'Summary' : ''" />
				<q-tab name="reflections" icon="person" :disable="!tab_enabed_array[3]" :label="tab == 'reflections' ? 'Reflections' : ''" />
			</q-tabs>
		</section>
    `,
};
