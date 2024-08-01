const { reactive, ref, watch, VueApexCharts, computed } = Vue
import {CONFIG} from '/config.js'
import {user} from '/reporter/store/user.js'
import {data} from '/reporter/store/data.js'
import router from '/reporter/router.js'

export default {
    name: 'Home',

	setup() {
		const title = 'All Session Data';
		data.currentPage = 'All Session Data';

		// POPULATE TOP FILTER SECTION ------------------------------------------------------------
		// get dates of all sessions to populate date dropdown:
		let highlight_dates = [];
		// get wording for session slider dropdown
		let session_sliders = [
			{
				label: user.institution.data.session_slider_1_question, 
				slider: 'slider_1', 
				value: 'session_slider_1', 
				low: user.institution.data.session_slider_1_label_low, 
				mid: user.institution.data.session_slider_1_label_medium, 
				high: user.institution.data.session_slider_1_label_high, 
			},
			{
				label: user.institution.data.session_slider_2_question, 
				slider: 'slider_2', 
				value: 'session_slider_2', 
				low: user.institution.data.session_slider_2_label_low, 
				mid: user.institution.data.session_slider_2_label_medium, 
				high: user.institution.data.session_slider_2_label_high, 
			},
			{
				label: user.institution.data.session_slider_3_question, 
				slider: 'slider_3', 
				value: 'session_slider_3', 
				low: user.institution.data.session_slider_3_label_low, 
				mid: user.institution.data.session_slider_3_label_medium, 
				high: user.institution.data.session_slider_3_label_high, 
			},
		];
		
		// framework dropdown
		let framework_options = Object.values(user.fdis.data);
		
		// start data to actually filter by
		let filter_form = reactive({});
		filter_form.start_date = ref(null);
		filter_form.end_date = ref(null);

		// to format dates correctly
		const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
		const monthNamesFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
		let today = new Date();
		filter_form.date = ref(today.getUTCFullYear() + '/' + (today.getMonth() + 1).toString().padStart(2, '0') + '/' + today.getDate().toString().padStart(2, '0'));
		
		filter_form.selected_sessions = reactive([]);
		filter_form.session = [];
		filter_form.slider_1_range = ref({min: 0, max: 100});
		filter_form.slider_2_range = ref({min: 0, max: 100});
		filter_form.slider_3_range = ref({min: 0, max: 100});
		filter_form.partner = ref(null);
		filter_form.framework = ref(null);
		filter_form.group_by = ref(null);
		filter_form.mode = 'table';

		function removeSession(id) { // date dropdown - remove a session filter
			filter_form.selected_sessions.splice(filter_form.selected_sessions.indexOf(id), 1);
			getData('session_trigger');
		}

		// prep for any group by selections
		let currently_grouping = ref(false);
		let group_by_month = reactive([0,1,2,3,4,5,6,7,8,9,10,11]);
		let group_by_location = reactive([]);
		let group_by_partner = reactive([]);
		let group_by_age_group = reactive(['Children 0-5', 'Children 6-11', 'Young Adult 12-18', 'Adult 19+', 'General interest (all ages)']);
		let group_by_observer = reactive([]);

		// POPULATE CHARTS ------------------------------------------------------------
		let attendanceChart;
		let ageChart;
		let frameworkChart;
		let dimensionChart;
		let active_frameworks = ref(Object.keys(framework_options).length); // to determine when to show dimension chart
		let times_run = 0;

		let attendance_chart = reactive([]); // line chart
		let attendance_labels = [];
		let attendance_datasets = [];
		// protection in case a past month occurred during a different year
		let one_months_ago = (today.getMonth() - 0 < 0) ? (today.getMonth() - 0 + 12) : (today.getMonth() - 0);
		let one_months_ago_year = (today.getMonth() - 0 < 0) ? (today.getUTCFullYear() - 1) : (today.getUTCFullYear());
		if (one_months_ago == 0) {one_months_ago = 12; one_months_ago_year--;}
		let two_months_ago = (today.getMonth() - 1 < 0) ? (today.getMonth() - 1 + 12) : (today.getMonth() - 1);
		let two_months_ago_year = (today.getMonth() - 1 < 0) ? (today.getUTCFullYear() - 1) : (today.getUTCFullYear());
		if (two_months_ago == 0) {two_months_ago = 12; two_months_ago_year--;}
		let three_months_ago = (today.getMonth() - 2 < 0) ? (today.getMonth() - 2 + 12) : (today.getMonth() - 2);
		let three_months_ago_year = (today.getMonth() - 2 < 0) ? (today.getUTCFullYear() - 1) : (today.getUTCFullYear());
		if (three_months_ago == 0) {three_months_ago = 12; three_months_ago_year--;}
		let four_months_ago = (today.getMonth() - 3 < 0) ? (today.getMonth() - 3 + 12) : (today.getMonth() - 3);
		let four_months_ago_year = (today.getMonth() - 3 < 0) ? (today.getUTCFullYear() - 1) : (today.getUTCFullYear());
		if (four_months_ago == 0) {four_months_ago = 12; four_months_ago_year--;}
		let five_months_ago = (today.getMonth() - 4 < 0) ? (today.getMonth() - 4 + 12) : (today.getMonth() - 4);
		let five_months_ago_year = (today.getMonth() - 4 < 0) ? (today.getUTCFullYear() - 1) : (today.getUTCFullYear());
		if (five_months_ago == 0) {five_months_ago = 12; five_months_ago_year--;}

		let age_groups_chart = reactive({}); // bar chart
		let age_labels = [];
		let age_datasets = [];

		let frameworks_chart = reactive({}); // pie chart
		let framework_labels = [];
		let framework_datasets = [];

		let dimensions_chart = reactive({}); // pie chart
		let dimension_labels = [];
		let dimension_datasets = [];
		let dimension_colors = [];

		let all_results = {};
		let calendar_sessions = reactive([]);

		// POPULATE ALL SESSIONS ITEMS ------------------------------------------------------------
		// data we'll be populating everything with
		let answers = {};
		let number_of_groups = ref(1);// how many groups we'll be grouping by
		// headers for table
		const table_columns = [
			{name: 'name', label: 'SESSION NAME', align: 'left', field: row => row.name, sortable: true},
			{name: 'observations', label: 'OBSERVATIONS', align: 'left', field: 'observations', sortable: true},
			{name: 'attendance_count', label: 'ATTENDANCE COUNT', align: 'left', field: 'attendance_count', sortable: true},
			{name: 'age', label: 'AGE GROUP', align: 'left', field: 'age', sortable: true},
			{name: 'observer', label: 'OBSERVER', align: 'left', field: 'observer', sortable: true},
			{name: 'location', label: 'LOCATION', align: 'left', field: 'location', sortable: true},
			{name: 'partner', label: 'PARTNER', align: 'left', field: 'partner', sortable: true},
			{name: 'framework', label: 'FRAMEWORK', align: 'left', field: 'framework', sortable: true},
			{name: 'date', label: 'DATE', align: 'left', field: 'date', sortable: true},
		];
		// prep data for table
		let pagination = ref({ // not sure, just a preset for quasar tables
			rowsPerPage: 0
		})
		let table_rows = reactive([]);
		let table_rows_grouped = reactive({});
		let reflection_rows_grouped = reactive ({});
		let observation_rows_grouped = reactive ({});
		let session_popup = reactive({});
		
		// narrative summary statements and view tab between reflections and observations
		let total_participants = ref(0); // summary sentences number of participants
		let total_frameworks = reactive([]); // summary sentences number of frameworks
		let slider_1_average = ref(0); // summary sentences slider_1 average
		let slider_2_average = ref(0); // summary sentences slider_2 average
		let slider_3_average = ref(0); // summary sentences slider_3 average
		let names_observing = reactive([]); // summary sentences all observers
		
		let narrative_tab = ref('reflections'); // which narrative layout is chosen-
		let total_observations = ref(0); // number to display by observations tab

		// narrative view reflections filter
		let reflections_filter = reactive({});
		reflections_filter.session_slider_1 = ref(true);
		reflections_filter.session_slider_2 = ref(true);
		reflections_filter.session_slider_3 = ref(true);
		reflections_filter.challenges = ref(true);
		reflections_filter.successes = ref(true);
		reflections_filter.summary = ref(true);
		reflections_filter.feedback = ref(true);

		// narrative fiew data container
		let reflection_rows = reactive([]);

		// narrative view observations filter
		let observations_filter = reactive({});
		observations_filter.search = ref('');
		observations_filter.select_1 = ref(null);
		observations_filter.select_1_options = ['dimensions', 'indicators', 'attendee_code'];
		observations_filter.select_2 = ref(null);

		// for observations filter dropdown
		let all_dimensions = reactive([]);
		let all_indicators = reactive([]);
		let all_attendees = reactive([]);
		observations_filter.select_2_options = {
			'dimensions': all_dimensions,
			'indicators': all_indicators,
			'attendee_code': all_attendees,
		};
		
		observations_filter.images = ref(false); // to only view observations with images
		observations_filter.starred = ref(false); // to only view observations that have been starred

		let observation_rows = reactive([]); // observations view data container
		let observation_popup = reactive({}); // observations expanded one
		let observations_showing = ref(24); // show 24 observations to start





		let params = {};
		async function enactFilters() { // get any queries in url, and use them to filter/update results
			console.log('---->>enactFilters', Vue.$router.options.history);
			// console.log("WHAT'VE WE GOT:", Vue.$router.options.history.location);
			let results = Vue.$router.options.history.location;

			let getting_data = '';
			let expand_session = null;
			let expand_observation = null;

			filter_form.start_date = null;
			filter_form.end_date = null;
			filter_form.selected_sessions.length = 0;
			filter_form.session.length = 0;
			filter_form.partner = null;
			filter_form.framework = null;
			filter_form.group_by = null;
			filter_form.mode = 'table';

			narrative_tab.value = 'reflections';

			reflections_filter.session_slider_1 = true;
			reflections_filter.session_slider_2 = true;
			reflections_filter.session_slider_3 = true;
			reflections_filter.challenges = true;
			reflections_filter.successes = true;
			reflections_filter.summary = true;
			reflections_filter.feedback = true;

			observations_filter.search = '';
			observations_filter.select_1 = null;
			observations_filter.select_2 = null;
			observations_filter.images = false;
			observations_filter.starred = false;

			if (results.includes('?')) { // if there are any filters
				getting_data = Vue.$router.options.history.location.split('?')[1].split('&' ); // to get the query in the url
				// console.log('----getting_data:', getting_data);

				// take each filter, plug it into the right variable, and run getData to enact the info
				console.log('----the data we got:', getting_data);
				getting_data.forEach(filter => {
					let type = filter.split('=')[0];
					let value = filter.split('=')[1]
					// console.log('----', type, 'is', value);

					// build up form data to pass through getData
					if (type == 'start_date') filter_form.start_date = value; // start date
					if (type == 'end_date') filter_form.end_date = value; // end date
					if (type == 'selected_sessions') filter_form.selected_sessions.push(value); // selected dates
					if (type == 'slider_1_range') { // first slider
						filter_form.session.push('slider_1');
						filter_form.slider_1_range.min = value.split(',')[0];
						filter_form.slider_1_range.max = value.split(',')[1];
					}
					if (type == 'slider_2_range') { // second slider
						filter_form.session.push('slider_2');
						filter_form.slider_2_range.min = value.split(',')[0];
						filter_form.slider_2_range.max = value.split(',')[1];
					}
					if (type == 'slider_3_range') { // third slider
						filter_form.session.push('slider_3');
						filter_form.slider_3_range.min = value.split(',')[0];
						filter_form.slider_3_range.max = value.split(',')[1];
					}
					if (type == 'partner') { // partner
						user.partners.data.forEach(partner => {
							if (partner.id == value) filter_form.partner = partner.name;
						})
					}
					if (type == 'framework') filter_form.framework = value; // framework

					// change layout options
					if (type == 'group_by') { // group by
						filter_form.group_by = {label:value.split(',')[0].replaceAll('+',' '), value:value.split(',')[1]};
					}
					if (type == 'mode') filter_form.mode = value; // modes
					if (type == 'narrative_tab') narrative_tab.value = value; // narrative_tab

					// set visible reflections data
					if (type == 'r_slider_1') reflections_filter.session_slider_1 = false;
					if (type == 'r_slider_2') reflections_filter.session_slider_2 = false;
					if (type == 'r_slider_3') reflections_filter.session_slider_3 = false;
					if (type == 'r_challenges') reflections_filter.challenges = false;
					if (type == 'r_successes') reflections_filter.successes = false;
					if (type == 'r_summary') reflections_filter.summary = false;
					if (type == 'r_feedback') reflections_filter.feedback = false;

					// filter observations results
					if (type == 'o_search') { // search
						observations_filter.search = value.replaceAll('+', ' ');
					}
					if (type == 'o_select_1') observations_filter.select_1 = value; // first category select
					if (type == 'o_select_2') {  // second observations select
						observations_filter.select_2 = value.replaceAll('+', ' ');
						observations_filter.select_2 = observations_filter.select_2.replaceAll('%26', '&'); // second select
					}
					if (type == 'o_images') observations_filter.images = true; // images
					if (type == 'o_starred') observations_filter.starred = true; // starred
					if (type == 's_expand') expand_session = value; // sessions popup - trigger once filtered data exists
					if (type == 'o_expand') expand_observation = value; // observations popup - trigger once filtered data exists

				}); // end cycle through each received filter
			} // end if there are any filters
			
			await getData();
			if (expand_session) { // now if s_expand is true, lets get that info
				console.log('----expand session', expand_session);
				expandSession(Number(expand_session));
			}
			if (expand_observation) { // now if o_expand is true, lets get that info
				console.log('----expand observation', expand_observation);
				expandObservation(Number(expand_observation));
			}

		} // end enactFilters
		enactFilters(); // run it when loading page
		
		window.addEventListener('popstate', function(event) { // update filters if user hits back button
			// The popstate event is fired each time when the current history entry changes..
			enactFilters();
		}, false);		


		


		function showMore() { // to show more observations
			// console.log('<<showMore, showing:', observation_rows, observations_showing);
			observations_showing.value += 20;
		}

		function expandSession(session_id) {
			console.log('---->>expandSession', session_id);
			table_rows.forEach(session => { // cycle through every session
				if (session_id == session.id) { // grab the one that matches
					console.log('----session', session);
					Object.assign(session_popup, session); // assign it to popup

					session_popup.all_observations = {};
					for (var o_id in session.dimensions) { // cycle through grabbed session's observations
						console.log('----', o_id);
						observation_rows.forEach(observation => {
							if (o_id == observation.id) {
								session_popup.all_observations[o_id] = observation;
							}
						})
					}
				}
				// get observations in session
			})

			// now push that to the url right away
			params.s_expand = session_id;
			Vue.$router.push(
				{
					path: '/', 
					query: params, 
				}
			);
		}

		function closeSession() {
			for (var content in session_popup) {
				delete session_popup[content];
			}

			delete params.s_expand;
			Vue.$router.push(
				{
					path: '/', 
					query: params, 
				}
			)
		}

		function expandObservation(which_observation) { // to open one observation
			observation_rows.forEach(observation => { // cycle through observations
				if (observation.id == which_observation) { // if it's the right observation
					Object.assign(observation_popup, observation); // grab it's data
				}
			})

			// now push that to the url right away
			params.o_expand = which_observation;
			Vue.$router.push(
				{
					path: '/', 
					query: params, 
				}
			);
		}
		
		function closeObservation() { // to close the one observation
			for (var content in observation_popup) {
				delete observation_popup[content];
			}

			delete params.o_expand;
			Vue.$router.push(
				{
					path: '/', 
					query: params, 
				}
			);
		}


		function debounce(func, timeout = 300) { // this will keep the range sliders from freaking out when the user drags them
			let timer;
			return (...args) => {
				clearTimeout(timer);
				timer = setTimeout(() => { func.apply(this, args); }, timeout);
			};
		}

		async function getData(which_trigger) { // loop through all sessions, filtering according to form, and feed the results back in
			
			all_results = await data.getData();
			console.log('---->>getData, all_results:', all_results);

			// resetting table mode view
			calendar_sessions.length = 0;

			for (var session_id in all_results) { // for each session
				let session_date = new Date(all_results[session_id].date);
				// session selection
				calendar_sessions.push({
					id: all_results[session_id].id,
					name: all_results[session_id].name,
					date: session_date.getUTCFullYear().toString() + '/' + (('0' + (session_date.getMonth() + 1)).slice(-2)) + '/' + ('0' + session_date.getDate()).slice(-2),
				});
				// push session's date to highlight_dates
				highlight_dates.push(session_date.getUTCFullYear().toString() + '/' + (('0' + (session_date.getMonth() + 1)).slice(-2)) + '/' + ('0' + session_date.getDate()).slice(-2))
			}

			// answers!
			answers = await data.getData(filter_form);
			console.log('---->>getData, answers:', answers, user.users);

			// resetting potential group by results:
			group_by_location.length = 0;
			group_by_partner.length = 0;
			group_by_observer.length = 0;

			// resetting graphs
			attendance_chart.length = 0;
			for (var age_group in age_groups_chart) { // to reset age graph
				delete age_groups_chart[age_group];
			}
			attendance_chart = {
				0: {month: monthNames[(five_months_ago - 1)], year: five_months_ago_year, count: 0}, // five months ago
				1: {month: monthNames[(four_months_ago - 1)], year: four_months_ago_year, count: 0}, // four months ago
				2: {month: monthNames[(three_months_ago - 1)], year: three_months_ago_year, count: 0}, // three months ago
				3: {month: monthNames[(two_months_ago - 1)], year: two_months_ago_year, count: 0}, // two months ago
				4: {month: monthNames[(one_months_ago - 1)], year: one_months_ago_year, count: 0}, // one month ago
				5: {month: monthNames[today.getMonth()], year: today.getUTCFullYear(), count: 0}, // this month
			};
			age_groups_chart = {
				'Children 0-5': {count: 0}, 
				'Children 6-11': {count: 0}, 
				'Young Adult 12-18': {count: 0}, 
				'Adult 19+': {count: 0}, 
				'General interest (all ages)': {count: 0}
			};
			for (var framework in frameworks_chart) { // to reset frameworks graph
				delete frameworks_chart[framework];
			}
			for (var dimensions in dimensions_chart) { // to reset dimensions graph
				delete dimensions_chart[dimensions];
			}
			active_frameworks.value = 0; // when to show dimensions graph

			// resetting table mode view
			table_rows.length = 0;

			// narrative view
			// resetting narrative summary statements
			total_participants.value = 0;
			total_frameworks.length = 0;
			slider_1_average.value = 50;
			let slider_1_array = [];
			slider_2_average.value = 50;
			let slider_2_array = [];
			slider_3_average.value = 50;
			let slider_3_array = [];
			names_observing.length = 0;

			total_observations.value = 0;

			reflection_rows.length = 0;

			// for observations view filter dropdown
			all_dimensions.length = 0;
			all_indicators.length = 0;
			all_attendees.length = 0;
			// observations data
			observation_rows.length = 0;

			for (var session_id in answers) { // for each session
				// console.log('--session:', answers[session_id]);

				let session_date = new Date(answers[session_id].date);

				let dimensions_list = {}; // build dimensions array for color barcodes in table

				for (var observation_id in answers[session_id].Observations) { // for each observation
					// console.log('----observation:', answers[session_id].Observations[observation_id]);
					// if (answers[session_id].Observations[observation_id].dimension_id) dimensions_list.push(answers[session_id].Observations[observation_id].dimension_id.color);
					if (answers[session_id].Observations[observation_id].dimension_id) dimensions_list[answers[session_id].Observations[observation_id].id] = answers[session_id].Observations[observation_id].dimension_id.color;
					
					// build time for each of observation_rows
					let observation_date = new Date(answers[session_id].Observations[observation_id].date_created);
					let a_or_p = ((observation_date.getUTCHours() - 5) >= 12) ? 'p' : 'a';
					let hour = ((observation_date.getUTCHours() - 5) > 12) ? ((observation_date.getUTCHours() - 5) - 12) : (observation_date.getUTCHours() - 5);

					// observations view
					observation_rows.push({
						id: answers[session_id].Observations[observation_id].id, 
						session_id: session_id, 
						session_name: (answers[session_id].name) ? answers[session_id].name : null, 
						date: (answers[session_id].Observations[observation_id].date_created) ? (observation_date.getMonth() + 1) + '/' + observation_date.getDate() + '/' + observation_date.getUTCFullYear() : null, 
						image: (answers[session_id].Observations[observation_id].image) ? answers[session_id].Observations[observation_id].image.id : null, 
						time: (answers[session_id].Observations[observation_id].date_created) ? hour + ':' + observation_date.getUTCMinutes().toString().padStart(2, '0') + a_or_p : null, 
						note: (answers[session_id].Observations[observation_id].note) ? answers[session_id].Observations[observation_id].note : null, 
						dimension: (answers[session_id].Observations[observation_id].dimension_id) ? answers[session_id].Observations[observation_id].dimension_id.name : null, 
						dimension_color: (answers[session_id].Observations[observation_id].dimension_id) ? answers[session_id].Observations[observation_id].dimension_id.color : 'grey-12', 
						indicator: (answers[session_id].Observations[observation_id].indicator_id) ? answers[session_id].Observations[observation_id].indicator_id.name : null, 
						attendee_code: (answers[session_id].Observations[observation_id].attendee_code) ? answers[session_id].Observations[observation_id].attendee_code : null, 
						is_starred: (answers[session_id].Observations[observation_id].is_starred) ? answers[session_id].Observations[observation_id].is_starred : false, 
						location: answers[session_id].location_id ? answers[session_id].location_id.name : '--', 
						partner: answers[session_id].partner_id ? answers[session_id].partner_id.name : '--', 
						age: (answers[session_id].primary_audience) ? answers[session_id].primary_audience : '--', 
						observer: (answers[session_id].user_id && answers[session_id].user_id.first_name) ? answers[session_id].user_id.first_name : '--', 
					});

					// - populate dimensions data for dimensionChart
					// console.log('HERE:', dimensions_chart, answers[session_id].Observations[observation_id].dimension_id);
					if (answers[session_id].Observations[observation_id].dimension_id) {
						if (!dimensions_chart.hasOwnProperty(answers[session_id].Observations[observation_id].dimension_id.name)) { // if the dimension is not in our list
							// add it, it's color, and start a count
							dimensions_chart[answers[session_id].Observations[observation_id].dimension_id.name] = {color: answers[session_id].Observations[observation_id].dimension_id.color, count: 1};
						} else { // if the dimension is in our list
							dimensions_chart[answers[session_id].Observations[observation_id].dimension_id.name].count++;
						}
					}
					
					// populate options for observations view dropdowns
					if (answers[session_id].Observations[observation_id].dimension_id && answers[session_id].Observations[observation_id].dimension_id.name && !all_dimensions.includes(answers[session_id].Observations[observation_id].dimension_id.name)) all_dimensions.push(answers[session_id].Observations[observation_id].dimension_id.name);
					if (answers[session_id].Observations[observation_id].indicator_id && !all_indicators.includes(answers[session_id].Observations[observation_id].indicator_id.name)) all_indicators.push(answers[session_id].Observations[observation_id].indicator_id.name);
					if (answers[session_id].Observations[observation_id].attendee_code && !all_attendees.includes(answers[session_id].Observations[observation_id].attendee_code)) all_attendees.push(answers[session_id].Observations[observation_id].attendee_code);
				
					// if the observation matches the current filters, add it to total_observations for the observations count
					if (
						(observations_filter.search == '' || answers[session_id].Observations[observation_id].note.includes(observations_filter.search)) && 
						(observations_filter.select_2 == null || (
								(observations_filter.select_1 == 'dimensions' && answers[session_id].Observations[observation_id].dimension_id && answers[session_id].Observations[observation_id].dimension_id.name == observations_filter.select_2) || 
								(observations_filter.select_1 == 'indicators' && answers[session_id].Observations[observation_id].indicator_id && answers[session_id].Observations[observation_id].indicator_id.name == observations_filter.select_2) || 
								(observations_filter.select_1 == 'attendee_code' && answers[session_id].Observations[observation_id].attendee_code && answers[session_id].Observations[observation_id].attendee_code == observations_filter.select_2)
							)) && 
						(observations_filter.images == false || (observations_filter.images == true && answers[session_id].Observations[observation_id].image != null)) && 
						(observations_filter.starred == false || (observations_filter.starred == true && answers[session_id].Observations[observation_id].is_starred && answers[session_id].Observations[observation_id].is_starred == true))
					) {
						total_observations.value++;
					}

				} // end for each observation

				// top filters
				// populate group_by arrays
				if (answers[session_id].location_id && !group_by_location.includes(answers[session_id].location_id.name)) group_by_location.push(answers[session_id].location_id.name);
				if (answers[session_id].partner_id && !group_by_partner.includes(answers[session_id].partner_id.name)) group_by_partner.push(answers[session_id].partner_id.name);
				if (answers[session_id].user_id && answers[session_id].user_id.first_name && !group_by_observer.includes(answers[session_id].user_id.first_name)) group_by_observer.push(answers[session_id].user_id.first_name);

				// populate chart arrays
				// - attendance - make month the index, add up attendance number for each
				for (var month in attendance_chart) { // for each of the last 6 months
					// if current session occurred during this month, add its attendance
					if (attendance_chart[month].month == monthNames[session_date.getMonth()] && attendance_chart[month].year == session_date.getUTCFullYear()) {
						// console.log('---- '+attendance_chart[month].month, attendance_chart[month].year+' | '+monthNames[session_date.getMonth()], session_date.getUTCFullYear() +':', answers[session_id].name);
						attendance_chart[month].count += answers[session_id].attendance_count;
					}
				}
				// - age groups
				Object.keys(age_groups_chart).forEach(key => {
					if (key == answers[session_id].primary_audience) {
						age_groups_chart[answers[session_id].primary_audience].count++;
					}
				})
				// - frameworks
				if (!frameworks_chart.hasOwnProperty(answers[session_id].framework_id.id)){
					frameworks_chart[answers[session_id].framework_id.id] = {name:answers[session_id].framework_id.name, count: 1};
				} else {
					frameworks_chart[answers[session_id].framework_id.id].count++;
				}
				// - dimensions was done in observations cycle

				// table view
				table_rows.push({
					id: answers[session_id].id, 
					name: answers[session_id].name, 
					dimensions: dimensions_list,
					observations: answers[session_id].Observations.length, 
					attendance_count: (answers[session_id].attendance_count) ? answers[session_id].attendance_count : '--', 
					age: (answers[session_id].primary_audience) ? answers[session_id].primary_audience : '--', 
					observer: (answers[session_id].user_id && answers[session_id].user_id.first_name) ? answers[session_id].user_id.first_name : '--', 
					location: answers[session_id].location_id ? answers[session_id].location_id.name : '--', 
					partner: answers[session_id].partner_id ? answers[session_id].partner_id.name : '--', 
					// institution: answers[session_id].institution_id ? answers[session_id].institution_id : '--', 
					framework: answers[session_id].framework_id.name ? answers[session_id].framework_id.name : '--', 
					// date: (session_date.getMonth() + 1) + '/' + session_date.getDate() + '/' + session_date.getUTCFullYear().toString().slice(-2), 
					date: session_date.getUTCFullYear().toString() + '/' + (('0' + (session_date.getMonth() + 1)).slice(-2)) + '/' + ('0' + session_date.getDate()).slice(-2), 
				});

				// update narrative summary numbers
				total_participants.value += answers[session_id].attendance_count;
				total_frameworks.includes(answers[session_id].framework_id) ? total_frameworks : total_frameworks.push(answers[session_id].framework_id);

				// build arrays to get slider averages below
				if (answers[session_id].slider_1) slider_1_array.push(answers[session_id].slider_1);
				if (answers[session_id].slider_2) slider_2_array.push(answers[session_id].slider_2);
				if (answers[session_id].slider_3) slider_3_array.push(answers[session_id].slider_3);

				// make list of all observers in sessions list
				if (answers[session_id].user_id && !names_observing.includes(answers[session_id].user_id.first_name + ' ' + answers[session_id].user_id.last_name)) names_observing.push(answers[session_id].user_id.first_name + ' ' + answers[session_id].user_id.last_name);

				// reflections view
				reflection_rows.push({
					dimensions: dimensions_list, 
					name: answers[session_id].name, 
					date: (session_date.getMonth() + 1) + '/' + session_date.getDate() + '/' + session_date.getUTCFullYear().toString().slice(-2), 
					session_slider_1: answers[session_id].slider_1 ? answers[session_id].slider_1 : '--', 
					session_slider_2: answers[session_id].slider_2 ? answers[session_id].slider_2 : '--', 
					session_slider_3: answers[session_id].slider_3 ? answers[session_id].slider_3 : '--', 
					challenges: answers[session_id].challenges ? answers[session_id].challenges : 'None noted', 
					successes: answers[session_id].successes ? answers[session_id].successes : 'None noted', 
					summary: answers[session_id].summary ? answers[session_id].summary : 'None noted', 
					feedback: answers[session_id].feedback ? answers[session_id].feedback : 'None noted', 
					location: answers[session_id].location_id ? answers[session_id].location_id.name : '--', 
					partner: answers[session_id].partner_id ? answers[session_id].partner_id.name : '--', 
					age: (answers[session_id].primary_audience) ? answers[session_id].primary_audience : '--', 
					observer: (answers[session_id].user_id && answers[session_id].user_id.first_name) ? answers[session_id].user_id.first_name : '--', 
				});
			} // end for each session

			// update narrative summary session stats using arrays made above
			slider_1_average.value = (slider_1_array.reduce((acc, c) => acc + c, 0)) / slider_1_array.length; // get average of all sessions' first slider
			if (slider_1_average.value <= 33) slider_1_average.value = user.institution.data.session_slider_1_label_low; // if average is low
			else if (slider_1_average.value > 33 && slider_1_average.value <= 66) slider_1_average.value = user.institution.data.session_slider_1_label_medium; // if average is medium
			else slider_1_average.value = user.institution.data.session_slider_1_label_high; // if average is high
			
			slider_2_average.value = (slider_2_array.reduce((acc, c) => acc + c, 0)) / slider_2_array.length; // get average of all sessions' second slider
			if (slider_2_average.value <= 33) slider_2_average.value = user.institution.data.session_slider_2_label_low; // if average is low
			else if (slider_2_average.value > 33 && slider_2_average.value <= 66) slider_2_average.value = user.institution.data.session_slider_2_label_medium; // if average is medium
			else slider_2_average.value = user.institution.data.session_slider_2_label_high; // if average is high
			
			slider_3_average.value = (slider_3_array.reduce((acc, c) => acc + c, 0)) / slider_3_array.length; // get average of all sessions' third slider
			if (slider_3_average.value <= 33) slider_3_average.value = user.institution.data.session_slider_3_label_low; // if average is low
			else if (slider_3_average.value > 33 && slider_3_average.value <= 66) slider_3_average.value = user.institution.data.session_slider_3_label_medium; // if average is medium
			else slider_3_average.value = user.institution.data.session_slider_3_label_high; // if average is high

			active_frameworks.value = Object.keys(frameworks_chart).length; // get number of frameworks to determine which charts to show
			paintCharts(attendance_chart, age_groups_chart, frameworks_chart, dimensions_chart); // only paint the charts once
			groupBy();





			// figuring out url stuff?

			console.log('----router was:', Vue.$router);
			
			// if a filter exists, add it to the list - otherwise, remove it from the list

			// top filters -----
			(filter_form.start_date) ? params.start_date = filter_form.start_date : delete params.start_date; // start date
			(filter_form.end_date) ? params.end_date = filter_form.end_date : delete params.end_date; // end date

			(Object.keys(filter_form.selected_sessions).length > 0) ? params.selected_sessions = filter_form.selected_sessions : delete params.selected_sessions; // selected sessions

			(filter_form.session.includes('slider_1')) ? params.slider_1_range = filter_form.slider_1_range.min+','+filter_form.slider_1_range.max : delete params.slider_1_range;
			(filter_form.session.includes('slider_2')) ? params.slider_2_range = filter_form.slider_2_range.min+','+filter_form.slider_2_range.max : delete params.slider_2_range;
			(filter_form.session.includes('slider_3')) ? params.slider_3_range = filter_form.slider_3_range.min+','+filter_form.slider_3_range.max : delete params.slider_3_range;
			
			(filter_form.partner) ? params.partner = filter_form.partner : delete params.partner; // partner
			(filter_form.framework) ? params.framework = filter_form.framework : delete params.framework; // framework
			(filter_form.group_by) ? params.group_by = filter_form.group_by.label+','+filter_form.group_by.value : delete params.group_by; // group by
			
			// view tabs -----
			(filter_form.mode == 'narrative') ? params.mode = filter_form.mode : delete params.mode; // modes tab
			(narrative_tab.value == 'observations') ? params.narrative_tab = narrative_tab.value : delete params.narrative_tab; // session reflections vs observations tab

			// reflections filters -----
			(reflections_filter.session_slider_1 == false) ? params.r_slider_1 = false : delete params.r_slider_1; // show the first slider
			(reflections_filter.session_slider_2 == false) ? params.r_slider_2 = false : delete params.r_slider_2; // show the second slider
			(reflections_filter.session_slider_3 == false) ? params.r_slider_3 = false : delete params.r_slider_3; // show the third slider
			(reflections_filter.challenges == false) ? params.r_challenges = false : delete params.r_challenges; // show challenges
			(reflections_filter.successes == false) ? params.r_successes = false : delete params.r_successes; // show successes
			(reflections_filter.summary == false) ? params.r_summary = false : delete params.r_summary; // show summary
			(reflections_filter.feedback == false) ? params.r_feedback = false : delete params.r_feedback; // show feedback

			// observations filters -----
			(observations_filter.search) ? params.o_search = observations_filter.search : delete params.o_search; // observations filter search
			(observations_filter.select_1) ? params.o_select_1 = observations_filter.select_1 : delete params.o_select_1; // observations filter select_1
			(observations_filter.select_1 && observations_filter.select_2) ? params.o_select_2 = observations_filter.select_2 : delete params.o_select_2; // observations filter select_1 and select_2
			(observations_filter.images) ? params.o_images = observations_filter.images : delete params.o_images; // observations filter images
			(observations_filter.starred) ? params.o_starred = observations_filter.starred : delete params.o_starred; // observations filter starred

			console.log('----push:', params);

			await Vue.$router.push({ path: '/', query: params });
			// return false;

			// if it was a slider that triggered this, trigger it to open?
			// console.log('----which_trigger:', which_trigger);
			
			if (which_trigger == 'session_trigger') { // if user is in individual sessions
				document.getElementById('session_select').click(); // reopen when browser forces it closed
			}
			if (which_trigger == 'slider_trigger') { // if user is in sliders
				document.getElementById('slider_select').click(); // reopen when browser forces it closed
			}
			
			console.log('----router now is:', Vue.$router);
		} // end getData

		const rangeUpdate = debounce(() => getData('slider_trigger'));

		function clearObservationSelect() {
			// console.log('----<<clearObservationSelect', observations_filter.select_2);
			observations_filter.select_2 = null;
		}

		function paintCharts(attendance_object, ages_object, frameworks_object, dimensions_object) { // create or update charts
			// console.log('<<paintCharts:', attendance_object, ages_object, frameworks_object, dimensions_object);

			// prepping/separating all data into label and data arrays for charts
			attendance_labels.length = 0;
			attendance_datasets.length = 0;
			for (var month_id in attendance_object) { // attendanceChart
				attendance_labels.push(attendance_object[month_id].month);
				attendance_datasets.push(attendance_object[month_id].count);
			}
			age_labels.length = 0;
			age_datasets.length = 0;
			for (var age_id in ages_object) { // ageChart
				age_labels.push(age_id);
				age_datasets.push(ages_object[age_id].count);
			}
			framework_labels.length = 0;
			framework_datasets.length = 0;
			for (var framework_id in frameworks_object) { // frameworkChart
				framework_labels.push(frameworks_object[framework_id].name);
				framework_datasets.push(frameworks_object[framework_id].count);
			}

			dimension_labels.length = 0;
			dimension_datasets.length = 0;
			dimension_colors.length = 0;
			for (var dimension_id in dimensions_object) { // dimensionChart
				dimension_labels.push(dimension_id);
				dimension_datasets.push(dimensions_object[dimension_id].count);
				dimension_colors.push(dimensions_object[dimension_id].color);
			}

			if (times_run == 0) { // if it's the first time, create the graphs
				attendanceChart = new Chart('attendanceChart', {
					type: 'line',
					data: {
						labels: attendance_labels, 
						datasets: [
							{
								label: ' total attendance', 
								data: attendance_datasets, 
							},
						]
					},
					options: {
						plugins: {
							legend: {
								display: false,
							},
							title: {
								display: true,
								text: 'Attendance over the past 6 months',
							}
						}
					}
				});

				ageChart = new Chart('ageChart', {
					type: 'bar',
					data: {
						labels: age_labels,
						datasets: [{
							label: ' times seen',
							data: age_datasets,
							borderWidth: 1
						}]
					},
					options: {
						plugins: {
							legend: {
								display: false,
							},
							title: {
								display: true,
								text: 'Age Groups'
							},
						},
						scales: {
							y: {
								beginAtZero: true
							}
						}
					}
				});

				frameworkChart = new Chart('frameworkChart', {
					type: 'pie',
					data: {
						labels: framework_labels,
						datasets: [{
							label: ' times seen',
							data: framework_datasets,
						}]
					},
					options: {
						responsive: true,
						plugins: {
							legend: {
								display: false,
							},
							title: {
								display: true,
								text: 'Frameworks'
							}
						}
					}
				});

				dimensionChart = new Chart('dimensionChart', {
					type: 'pie',
					data: {
						labels: dimension_labels,
						datasets: [{
							label: ' times seen',
							data: dimension_datasets,
							backgroundColor: dimension_colors, 
						}]
					},
					options: {
						responsive: true,
						plugins: {
							legend: {
								display: false,
							},
							title: {
								display: true,
								text: 'Dimensions'
							}
						}
					}
				});
			} else { // otherwise, update the graphs
				console.log('THE CHARTS:', attendanceChart, ageChart, frameworkChart, dimensionChart);
				attendanceChart.update();
				ageChart.update();
				frameworkChart.update();
				dimensionChart.update();
			}

			times_run++;
		}; // end paintCharts

		function groupBy() { // create multiple groups and divide the data up between them
			console.log('<<groupBy function:', filter_form.group_by);
			Object.keys(table_rows_grouped).forEach(key => {
				delete table_rows_grouped[key];
			});
			Object.keys(reflection_rows_grouped).forEach(key => {
				delete reflection_rows_grouped[key];
			});
			Object.keys(observation_rows_grouped).forEach(key => {
				delete observation_rows_grouped[key];
			});

			if (filter_form.group_by && filter_form.group_by.value == 'month') { // if month was chosen
				// console.log('group by month,', group_by_month);
				number_of_groups.value = group_by_month.length;
				let group_matches = 0;
				group_by_month.forEach(month => { // for each month present
					// console.log('----look for:', month);

					table_rows_grouped[monthNamesFull[month]] = []; // table view
					for (var s_id in table_rows) { // for each session
						let s_month = table_rows[s_id].date.split('/',1)[0];
						// console.log('----LOOK HERE DUDE', s_month);
						if (month == (s_month - 1)) { // if the current month matches the current session's month
							// console.log('----HERE:', s_month);
							group_matches++;
							table_rows_grouped[monthNamesFull[month]].push(table_rows[s_id]);
						}
					}

					reflection_rows_grouped[monthNamesFull[month]] = []; // reflections view
					for (var r_id in reflection_rows) { // for each reflection
						let r_month = reflection_rows[r_id].date.split('/',1)[0];
						if (month == (r_month - 1)) { // if the current month matches the current reflection's month
							// console.log('----HERE:', r_month);
							group_matches++;
							reflection_rows_grouped[monthNamesFull[month]].push(reflection_rows[r_id]);
						}
					}

					observation_rows_grouped[monthNamesFull[month]] = []; // observations view
					for (var o_id in observation_rows) { // for each observation
						// console.log('----' + observation_rows[o_id].date + ': ' + observation_rows[o_id].note);
						let o_month = observation_rows[o_id].date.split('/',1)[0];
						if (month == (o_month - 1)) { // if the current month matches the current observation's month
							// console.log('----HERE:', o_month);
							group_matches++;
							observation_rows_grouped[monthNamesFull[month]].push(observation_rows[o_id]);
						}
					}

				});
				if (group_matches == 0) number_of_groups.value = 0;
				currently_grouping.value = true;
			}
			else if (filter_form.group_by && filter_form.group_by.value == 'location') { // if location was chosen
				// console.log('group by location,', group_by_location);
				number_of_groups.value = group_by_location.length;
				let group_matches = 0;
				group_by_location.forEach(location => { // for each location present
					// console.log('----look for:', location);

					table_rows_grouped[location] = []; // table view
					for (var s_id in table_rows) { // for each session
						// console.log('----does this match:', table_rows[s_id].location);
						if (location == table_rows[s_id].location) { // if the current location matches the current session's location
							// console.log('----yes');
							group_matches++;
							table_rows_grouped[location].push(table_rows[s_id]);
						}
					}

					reflection_rows_grouped[location] = []; // reflection view
					for (var r_id in reflection_rows) { // for each reflection
						// console.log('----does this match:', reflection_rows[r_id].location);
						if (location == reflection_rows[r_id].location) {
							// console.log('----yes');
							group_matches++;
							reflection_rows_grouped[location].push(reflection_rows[r_id]);
						}
					}

					observation_rows_grouped[location] = []; // observation view
					for (var o_id in observation_rows) {
						// console.log('----does this match:', observation_rows[o_id].location);
						if (location == observation_rows[o_id].location) {
							// console.log('----yes');
							group_matches++;
							observation_rows_grouped[location].push(observation_rows[o_id]);
						}
					}

				});
				if (group_matches == 0) number_of_groups.value = 0;
				currently_grouping.value = true;
			}
			else if (filter_form.group_by && filter_form.group_by.value == 'partner') { // if partner was chosen
				// console.log('group by partner,', group_by_partner);
				number_of_groups.value = group_by_partner.length;
				let group_matches = 0;
				group_by_partner.forEach(partner => { // for each partner present
					// console.log('----look for:', partner);

					table_rows_grouped[partner] = []; // table view
					for (var s_id in table_rows) { // for each session
						// console.log('----does this match:', table_rows[s_id].partner);
						if (partner == table_rows[s_id].partner) { // if the current partner matches the current session's partner
							// console.log('----yes');
							group_matches++;
							table_rows_grouped[partner].push(table_rows[s_id]);
						}
					}

					reflection_rows_grouped[partner] = []; // reflections view
					for (var r_id in reflection_rows) { // for each reflection
						// console.log('----does this match:', reflection_rows[s_id].partner);
						if (partner == reflection_rows[r_id].partner) {
							// console.log('----yes');
							group_matches++;
							reflection_rows_grouped[partner].push(reflection_rows[r_id]);
						}
					}

					observation_rows_grouped[partner] = []; // observations view
					for (var o_id in observation_rows) {
						// console.log('----does this match:', observation_rows[o_id].partner);
						if (partner == observation_rows[o_id].partner) {
							// console.log('----yes');
							group_matches++;
							observation_rows_grouped[partner].push(observation_rows[o_id]);
						}
					}

				});
				if (group_matches == 0) number_of_groups.value = 0;
				currently_grouping.value = true;
			}
			else if (filter_form.group_by && filter_form.group_by.value == 'age_group') { // if age group was chosen
				// console.log('group by age group,', group_by_age_group);
				number_of_groups.value = group_by_age_group.length;
				let group_matches = 0;
				group_by_age_group.forEach(age_group => { // for each age group present
					// console.log('----look for:', age_group);

					table_rows_grouped[age_group] = []; // table view
					for (var s_id in table_rows) { // for each session
						// console.log('----does this match:', table_rows[s_id].age);
						if (age_group == table_rows[s_id].age) { // if the current age group matches the current session's age group
							// console.log('----yes');
							group_matches++;
							table_rows_grouped[age_group].push(table_rows[s_id]);
						}
					}

					reflection_rows_grouped[age_group] = []; // reflections view
					for (var r_id in reflection_rows) { // for each reflection
						// console.log('----does this match:', reflection_rows[s_id].age);
						if (age_group == reflection_rows[r_id].age) {
							// console.log('----yes');
							group_matches++;
							reflection_rows_grouped[age_group].push(reflection_rows[r_id]);
						}
					}

					observation_rows_grouped[age_group] = []; // observations view
					for (var o_id in observation_rows) { // for each observation
						// console.log('----does this match:', observation_rows[o_id].age);
						if (age_group == observation_rows[o_id].age) {
							// console.log('----yes');
							group_matches++;
							observation_rows_grouped[age_group].push(observation_rows[o_id]);
						}
					}

				});
				if (group_matches == 0) number_of_groups.value = 0;
				currently_grouping.value = true;
			}
			else if (filter_form.group_by && filter_form.group_by.value == 'observer') { // if observer was chosen
				// console.log('group by observer,', group_by_observer);
				number_of_groups.value = group_by_observer.length;
				let group_matches = 0;
				group_by_observer.forEach(observer => { // for each observer present
					// console.log('----look for:', observer);

					table_rows_grouped[observer] = []; // table view
					for (var s_id in table_rows) { // for each session
						// console.log('----does this match:', table_rows[s_id].observer);
						if (observer == table_rows[s_id].observer) {// if the current observer matches the current session's observer
							// console.log('----yes');
							group_matches++;
							table_rows_grouped[observer].push(table_rows[s_id]);
						}
					}

					reflection_rows_grouped[observer] = []; // reflections view
					for (var r_id in reflection_rows) { // for each reflection
						// console.log('----does this match:', reflection_rows[s_id].observer);
						if (observer == reflection_rows[r_id].observer) {
							// console.log('----yes');
							group_matches++;
							reflection_rows_grouped[observer].push(reflection_rows[r_id]);
						}
					}

					observation_rows_grouped[observer] = []; // observations view
					for (var o_id in observation_rows) { // for each observation
						// console.log('----does this match:', observation_rows[o_id].observer);
						if (observer == observation_rows[o_id].observer) {
							// console.log('----yes');
							group_matches++;
							observation_rows_grouped[observer].push(observation_rows[o_id]);
						}
					}

				})
				if (group_matches == 0) number_of_groups.value = 0;
				currently_grouping.value = true;
			}
			else {
				// console.log('group by nothing,', table_rows);
				currently_grouping.value = false;
			}
			// console.log('----there should be', number_of_groups, 'groups here:', table_rows_grouped);
		} // end groupBy

		function go_to_page(which_id) { // TODO: not sure what this does
			Vue.$router.push(which_id);
		}

		function doThis(which) {
			console.log('---->>doThis', which);
		}

		function dateChange(selected_date, sessions) {
			console.log('<<--dateChange,', selected_date, sessions);

			// if a session occured on the selected date, console log it
			sessions.forEach(session => {
				// if the date is included in the session
				// console.log('does', session['date'], 'include', selected_date.replaceAll('/','-'), '?');
				if (session['date'].includes(selected_date.replaceAll('/','-'))) {
					console.log('----event:', session);
				}
			});
		}

		return {
			// essentials
			CONFIG,
			user, 
			data, 
			title, 
			go_to_page, 
			doThis, 
			dateChange,

			// for top filter form
			filter_form, 
			calendar_sessions, 
			highlight_dates, 
			removeSession, 
			session_sliders, 
			rangeUpdate, 
			framework_options, 
			currently_grouping, 
			number_of_groups, 
			table_rows_grouped, 
			groupBy, 
			getData, 

			// charts
			active_frameworks, 

			// all sessions table view
			table_columns, 
			table_rows, 
			pagination, 
			session_popup, 
			expandSession,
			closeSession,  

			// all sessions narrative summary sentences
			total_participants, 
			total_frameworks, 
			slider_1_average, 
			slider_2_average, 
			slider_3_average, 
			names_observing, 

			// all sessions narrative view tab
			narrative_tab, 
			total_observations, 

			// all sessions reflections cards
			reflections_filter, 
			reflection_rows, 
			reflection_rows_grouped, 
			observation_rows, 
			observation_rows_grouped, 

			// all sessions observations cards
			observations_filter, 
			observation_popup, 
			clearObservationSelect, 
			expandObservation, 
			closeObservation, 
			observations_showing, 
			showMore, 
		}

	// const $q = Quasar.useQuasar()
	},


    template: `
	<div>
		<!-- home -->
		<q-form class="row" style="gap:8px;">
		<!-- {{filter_form}} -->

			<div >
				<div class="text-h7 text-weight-medium">Select Dates:</div>
				<div class="row" style="gap:8px;">
					<q-input v-model="filter_form.start_date" @update:model-value="getData" type="date" dense fill outlined square :class="$q.dark.isActive ? 'bg-black' : 'bg-white'" style="max-width: 130px" />
					<q-input v-model="filter_form.end_date" @update:model-value="getData" type="date" dense fill outlined square :class="$q.dark.isActive ? 'bg-black' : 'bg-white'" style="max-width: 130px" />
				</div>
			</div>

			<q-separator vertical />
			
			<div >
				<div class="text-h7 text-weight-medium">Filter by:</div>
				<div class="row" style="gap:8px;">
					<q-select 
						v-model="filter_form.calendar_select" 
						:options="[{id: 1}]" 
						@update:model-value="getData('session_trigger')" 
						:display-value="filter_form.selected_sessions.length" 
						dense fill outlined square 
						:class="$q.dark.isActive ? 'bg-black' : 'bg-white'" 
						style="width: 110px" 
						id="session_select" 
					>
						<template v-slot:prepend>
							<q-icon name="event_available" />
						</template>
						<template v-slot:option="{ itemProps, opt, selected, toggleOption }">
							<q-item-section class="float-left">
								<q-date 
									flat square bordered event-color="grey-5" color="grey-7" minimal 
									v-model="filter_form.date" 
									:events="highlight_dates" 
									@update:model-value="dateChange(filter_form.date, table_rows)" 
								/>
							</q-item-section>
							<q-scroll-area style="height: 300px; width: 280px;" >
								
								<q-item-label header class="text-h7 text-weight-medium text-black" :class="$q.dark.isActive ? 'bg-black' : 'bg-white'">{{filter_form.date}} Sessions</q-item-label>
								<q-separator color="grey" inset />
								<q-list class="">
									<template v-for="session in calendar_sessions">
										<q-item v-if="session.date.includes(filter_form.date)" dense class="row items-start">
											<q-checkbox dense size="lg" v-model="filter_form.selected_sessions" :val="session.id" @update:model-value="getData('session_trigger')" color="grey" checked-icon="check_circle" unchecked-icon="add_circle_outline" />
											<q-item-label class="q-pt-xs">{{session.name}}</q-item-label>
										</q-item>
									</template>
								</q-list>
							</q-scroll-area>
							<div class="q-ma-md">
								<q-item-label header class="text-h7 text-weight-medium text-black q-pl-none q-pt-none" :class="$q.dark.isActive ? 'bg-black' : 'bg-white'">Selected Sessions - {{filter_form.selected_sessions.length}}</q-item-label>
								<q-list class="">
									<template v-for="session in filter_form.selected_sessions">
										<template v-for="match in calendar_sessions">
											<q-item v-if="session == match.id" dense class="row items-center items-start q-pa-none">
												<q-item-label class="col-grow" style="margin: 0" ><b>{{match.date.split('T')[0].replaceAll('-','/')}} | </b>{{match.name}}</q-item-label>
												<q-btn @click="removeSession(match.id)" dense flat icon="close" color="grey" />
											</q-item>
										</template>
									</template>
									<div v-if="!filter_form.selected_sessions.length">No sessions are selected</div>
									<!-- <q-btn type="submit" label="Select Sessions" :disable="!filter_form.selected_sessions.length" unelevated :outline="!filter_form.selected_sessions.length" :color="!filter_form.selected_sessions.length ? '' : 'black'" :style="!filter_form.selected_sessions.length ? 'color: grey' : ''" /> -->
								</q-list>
							</div>
						</template>
					</q-select>
					<q-select v-model="filter_form.session" :display-value="filter_form.session.length" :options="session_sliders" option-value="slider" @update:model-value="getData('slider_trigger')" option-label="label" multiple emit-value map-options dense fill outlined square style="width: 110px" :class="$q.dark.isActive ? 'bg-black' : 'bg-white'" id="slider_select" >
						<template v-slot:prepend>
							<q-icon name="commit" />
						</template>
						<template v-slot:option="{ itemProps, opt, selected, toggleOption }">
							<q-item v-bind="itemProps">
								<q-item-section side>
									<q-checkbox dense :model-value="selected" @update:model-value="toggleOption(opt)" />
								</q-item-section>
								<q-item-section>
									<q-item-label v-html="opt.label" />
									<!-- <q-range v-model="filter_form[opt.slider + '_range']" :min="0" :max="100" @update:model-value="getData" :disable="!selected" color="black" inner-track-color="grey" thumb-color="black" label drag-range /> -->
									<q-range v-model="filter_form[opt.slider + '_range']" :min="0" :max="100" @update:model-value="rangeUpdate('slider_trigger')" :disable="!selected" color="black" inner-track-color="grey" thumb-color="black" label drag-range />
									<!-- <q-range v-model="filter_form[opt.slider + '_range']" :min="0" :max="100" input-debounce="500" @update:model-value="getData('slider_trigger')" :disable="!selected" color="black" inner-track-color="grey" thumb-color="black" label drag-range /> -->
									<template class="row no-wrap full-width">
										<div class="text-caption text-weight-medium text-uppercase" style="width: 33%;">{{opt.low}}</div>
										<div class="text-caption text-weight-medium text-uppercase text-center" style="width: 34%;">{{opt.mid}}</div>
										<div class="text-caption text-weight-medium text-uppercase text-right" style="width: 33%;">{{opt.high}}</div>
									</template>
								</q-item-section>
							</q-item>
						</template>
					</q-select>

					<q-select v-model="filter_form.partner" :options="user.partners.data" option-value="id" option-label="name" @update:model-value="getData" emit-value map-options label="Partner" :class="$q.dark.isActive ? 'bg-black' : 'bg-white'" clearable dense fill outlined square style="min-width: 150px" />
					<q-select @click.capture.native="doThis" v-model="filter_form.framework" :options="framework_options" option-value="framework_id" option-label="framework_name" @update:model-value="getData" emit-value map-options label="Framework" :class="$q.dark.isActive ? 'bg-black' : 'bg-white'" dense fill outlined square clearable style="min-width: 150px" />
				</div>
			</div>

			<q-separator vertical />
			
			<div >
				<div class="text-h7 text-weight-medium">Group by:</div>
				<div class="row" style="gap:8px;">
					<q-select dense fill outlined square clearable v-model="filter_form.group_by" @update:model-value="getData" style="width: 120px" 
					:options="
					[
						{label: 'Month', value: 'month'},
						{label: 'Location', value: 'location'},
						{label: 'Partner', value: 'partner'},
						{label: 'Age Group', value: 'age_group'},
						{label: 'Observer', value: 'observer'},
					]" 
					label="-Select-" :class="$q.dark.isActive ? 'bg-black' : 'bg-white'" />
				</div>
			</div>

			<q-separator vertical />
			
			<div >
				<div class="text-h7 text-weight-medium">Modes:</div>
				<div class="row" style="gap:8px;">
					<q-btn-toggle class="my-custom-toggle" no-caps rounded unelevated :toggle-text-color="$q.dark.isActive ? 'black' : 'white'" :toggle-color="$q.dark.isActive ? 'white' : 'black'" :color="$q.dark.isActive ? 'black' : 'white'" :text-color="$q.dark.isActive ? 'white' : 'black'" style="border: 1px solid #C2C2C2" v-model="filter_form.mode" @update:model-value="getData" :options="[{value: 'table', slot: 'one'}, {value: 'narrative', slot: 'two'}]">
						<template v-slot:one>
							<q-icon name="reorder" />
						</template>
						<template v-slot:two>
							<q-icon name="collections" />
						</template>
					</q-btn-toggle>
				</div>
			</div>
		</q-form>

		<q-expansion-item default-opened label="Data Visualizations" header-class="q-mt-lg text-h6 q-px-none add-bang">
			<q-separator color="black" class="q-mb-md" />
			<div class="row justify-between charts-row" style="gap:10px;">
				<div bordered :class="$q.dark.isActive ? 'bg-black' : 'bg-white'">
					<canvas id="attendanceChart"></canvas>
				</div>
				<div bordered :class="$q.dark.isActive ? 'bg-black' : 'bg-white'">
					<canvas id="ageChart"></canvas>
				</div>
				<div bordered :class="$q.dark.isActive ? 'bg-black' : 'bg-white'">
					<canvas style="max-height: 210px; margin: auto; padding-bottom: 10px;" :style="active_frameworks > 1 ? '' : 'display: none;'" id="frameworkChart"></canvas>
					<canvas style="max-height: 210px; margin: auto; padding-bottom: 10px;" :style="active_frameworks < 2 ? '' : 'display: none;'" id="dimensionChart"></canvas>
				</div>
				
			</div>
		</q-expansion-item>

		<q-expansion-item default-opened label="All Sessions" header-class="text-h6 text-weight-medium q-px-none add-bang">
		
			<!-- popup if a session is clicked -->
			<q-card v-if="Object.keys(session_popup).length > 0 && filter_form.mode == 'table'" class="q-pa-md q-mb-md" style="width:100%;" >
				<div class="row no-wrap items-center" style="width: 100%;">
					<div class="col-shrink text-subtitle2 text-weight-medium ellipsis" ><b>{{session_popup.name}}</b></div>
					<div class="text-subtitle2 col-grow q-ml-xs">  |  {{session_popup.date.split('T')[0]}}</div>
					<q-btn @click="closeSession" dense flat icon="close" color="grey" />
				</div>
				<q-separator color="black" class="q-mt-sm q-mb-md" />
				<div class="row no-wrap viewing-session">
					<div style="min-width: 300px;">
						<div><b>In Attendance:</b> {{session_popup.attendance_count}}</div>
						<div><b>Age Group:</b> {{session_popup.age}}</div>
						<div><b>Observer:</b> {{session_popup.observer}}</div>
						<div><b>Location:</b> {{session_popup.location}}</div>
						<div><b>Partner:</b> {{session_popup.partner}}</div>
						<div><b>Framework:</b> {{session_popup.framework}}</div>
					</div>
					<div v-if="session_popup.observations > 0" class="row" style="gap: 10px;">
						<div style="width: 100%;"><b>Observations:</b></div>
						<q-card v-for="observation in session_popup.all_observations" square flat bordered class="q-pa-sm session-observation" >
							<q-img v-if="observation.image" :src="CONFIG.directus_url+'/assets/' + observation.image + '?access_token=' + user.userAccessToken" style="height: 150px; width: 100%;" class="q-mb-md" />

							<div v-if="observation.time" class="text-body2 text-weight-bold q-mb-sm" style="letter-spacing:-.5px;">{{observation.time}}</div>
							<div v-if="observation.note" class="text-caption q-mb-sm ellipsis-2-lines" style="letter-spacing: 0px; line-height: 15px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical;">Note: {{observation.note}}</div>
							<div v-if="observation.dimension" class="text-caption q-px-sm q-py-xs q-mb-sm" :style="'letter-spacing: 0px; line-height: 15px; width: fit-content; border-radius: 50px; color: white; background-color: ' + observation.dimension_color + ';'">{{observation.dimension}}</div>
							<div v-if="observation.indicator" class="text-caption ellipsis-2-lines" style="letter-spacing: 0px; line-height: 15px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical;">Indicator: {{observation.indicator}}</div>
							
							<div v-if="observation.attendee_code" class="q-mt-sm">
								<q-icon name="person" />
								{{observation.attendee_code}}
							</div>
						</q-card>
					</div>
				</div>
			</q-card>

			<template v-else-if="filter_form.mode == 'table'">
				<q-separator color="black" />
				<q-table 
					v-if="currently_grouping == false" 
					dense flat :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'" 
					ref="tableRef" 
					:rows="table_rows" 
					:columns="table_columns" 
					row-key="id" 
					virtual-scroll 
					v-model:pagination="pagination" 
					:rows-per-page-options="[0]" 
				>
					<template v-slot:header-cell-observations="props">
						<q-th :props="props">
							<q-icon name="content_paste_search" size="1.5em" />
						</q-th>
					</template>
					<template v-slot:header-cell-attendance_count="props">
						<q-th :props="props">
							<q-icon name="person" size="1.5em" />
						</q-th>
					</template>
					<template v-slot:body-cell-name="props">
						<q-td :props="props" class="row">
							<div class="row no-wrap" style="width: 48px;height: 15px;">
								<template v-for="color in props.row.dimensions">
									<div class="col" :style="'height:100%; background-color: ' + color + ';'"></div>
								</template>
							</div>
							<div @click="expandSession(props.row.id)" class="q-ml-sm" style="cursor:pointer; width:calc(100% - 60px); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">{{ props.row.name }}</div>
						</q-td>
					</template>
				</q-table>

				<template v-else >
					<template v-if="number_of_groups > 0">
						<template v-for="group, title in table_rows_grouped" >
							<template v-if="group.length > 0" >
								<q-table
									dense flat :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'" 
									ref="tableRef" 
									:title="title" 
									:rows="group" 
									:columns="table_columns" 
									row-key="id" 
									virtual-scroll 
									v-model:pagination="pagination" 
									:rows-per-page-options="[0]" 
									hide-bottom 
								>

									<template v-slot:header-cell-name="props">
										<q-th :props="props" style="width: 250px;">
											{{props.col.label}}
										</q-th>
									</template>
									<template v-slot:header-cell-observations="props">
										<q-th :props="props">
											<q-icon name="content_paste_search" size="1.5em" />
										</q-th>
									</template>
									<template v-slot:header-cell-attendance_count="props">
										<q-th :props="props">
											<q-icon name="person" size="1.5em" />
										</q-th>
									</template>
									<template v-slot:body-cell-name="props">
										<q-td :props="props" class="row">
											<div class="row no-wrap" style="width: 48px;height: 15px;">
												<template v-for="color in props.row.dimensions">
													<div class="col" :style="'height:100%; background-color: ' + color + ';'"></div>
												</template>
											</div>
											<div @click="expandSession(props.row.id)" class="q-ml-sm ellipsis" style="flex: 1; cursor: pointer;">{{ props.row.name }}</div>
										</q-td>
									</template>
									<template v-slot:body-cell-observations="props">
										<q-td :props="props" style="width: 60px;" >
											<div class="ellipsis">{{props.row.observations}}</div>
										</q-td>
									</template>
									<template v-slot:body-cell-attendance_count="props">
										<q-td :props="props" style="width: 60px;" >
											<div class="ellipsis">{{props.row.attendance_count}}</div>
										</q-td>
									</template>
									<template v-slot:body-cell-age="props">
										<q-td :props="props" style="width: 150px;" >
											<div class="ellipsis">{{props.row.age}}</div>
										</q-td>
									</template>
									<template v-slot:body-cell-observer="props">
										<q-td :props="props" style="width: 100px;" >
											<div class="ellipsis">{{props.row.observer}}</div>
										</q-td>
									</template>
									<template v-slot:body-cell-location="props">
										<q-td :props="props" style="width: 160px;" >
											<div class="ellipsis">{{props.row.location}}</div>
										</q-td>
									</template>
									<template v-slot:body-cell-partner="props">
										<q-td :props="props" style="width: 150px;" >
											<div class="ellipsis">{{props.row.partner}}</div>
										</q-td>
									</template>
									
									<template v-slot:body-cell-framework="props">
										<q-td :props="props" style="width: 150px;" >
											<div class="ellipsis">{{props.row.framework}}</div>
										</q-td>
									</template>
									
									<template v-slot:body-cell-date="props">
										<q-td :props="props" style="width: 100px;" >
											<div class="ellipsis">{{props.row.date}}</div>
										</q-td>
									</template>
								</q-table>
								<q-separator color="grey-14" class="q-mt-sm" />
							</template>
						</template>
					</template>
					<div v-else class="q-mt-md">Sorry, there is not enough data to group by this field</div>
				</template>
			</template>

			<div v-else class="row no-wrap q-mt-md narrative-columns">
				<div >
					<div class="text-h8 text-weight-medium q-mb-sm">Data Summary Sentence</div>
					<div class="text-body2 q-mb-sm">The <ul style="padding:0;margin:0;display:inline-block;text-decoration: underline;">{{table_rows.length}}</ul> sessions with this <ul style="padding:0;margin:0;display:inline-block;text-decoration: underline;">filter</ul> had <ul style="padding:0;margin:0;display:inline-block;text-decoration: underline;">{{total_participants}}</ul> participants and <ul style="padding:0;margin:0;display:inline-block;text-decoration: underline;">{{total_frameworks.length}}</ul> frameworks.</div>
					<template v-if="table_rows.length > 0">
						<div class="text-body2 q-mb-sm">
							Overall these sessions had 
								<ul style="padding:0;margin:0;display:inline-block;text-decoration: underline;">{{slider_1_average}}</ul> 
							{{user.institution.data.session_slider_1_question}}, 
								<ul style="padding:0;margin:0;display:inline-block;text-decoration: underline;">{{slider_2_average}}</ul> 
							{{user.institution.data.session_slider_2_question}} and 
								<ul style="padding:0;margin:0;display:inline-block;text-decoration: underline;">{{slider_3_average}}</ul> 
							{{user.institution.data.session_slider_3_question}}.
						</div>
					</template>
					<template v-if="names_observing.length > 0">
						<div class="text-body2">
							<span>The observer</span>
							<template v-if="names_observing.length == 1">
								<span> is <ul style="padding:0;margin:0;display:inline-block;text-decoration: underline;">{{names_observing[0]}}</ul>.</span>
							</template>
							<template v-else>
								<span>s were </span>
							</template>
							<template v-for="name, key in names_observing">
								<template v-if="key < (names_observing.length - 1) && names_observing.length > 1">
									<span><ul style="padding:0;margin:0;display:inline-block;text-decoration: underline;">{{name}}</ul>, </span>
								</template>
								<template v-else-if="key == (names_observing.length - 1) && names_observing.length > 1">
									<span>and <ul style="padding:0;margin:0;display:inline-block;text-decoration: underline;">{{name}}</ul>.</span>
								</template>
							</template>
						</div>
					</template>
				</div>
				<div >
					<div>
						<q-btn-toggle square class="my-custom-toggle" unelevated :toggle-color="$q.dark.isActive ? 'black' : 'white'" :toggle-text-color="$q.dark.isActive ? 'white' : 'black'" v-model="narrative_tab" @update:model-value="getData" :options="[{value: 'reflections', slot: 'one'}, {value: 'observations', slot: 'two'}]">
							<template v-slot:one>
								<div class="q-mr-sm" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'" style="border:1px solid #E2E2E2;border-radius:13px;width:25px;height:25px;">{{table_rows.length}}</div>
								<div class="text-overline" style="letter-spacing:.5px;">Session Reflections</div>
							</template>
							<template v-slot:two>
								<div class="q-mr-sm" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'" style="border:1px solid #E2E2E2;border-radius:13px;width:25px;height:25px;">{{total_observations}}</div>
								<div class="text-overline" style="letter-spacing:.5px;">Observations</div>
							</template>
						</q-btn-toggle>
						<div class="q-pa-md" :class="$q.dark.isActive ? 'bg-black' : 'bg-white'" style="border: 1px solid #E2E2E2;" >
							<template v-if="narrative_tab == 'reflections'">
								<!-- {{reflections_filter}} -->
								<template class="row items-center q-mb-md">
									<div class="text-h8 text-weight-medium q-mr-md">View:</div>
									<q-form class="row items-center" style="flex: 1;" >
										<q-checkbox size="sm" v-model="reflections_filter.session_slider_1" @update:model-value="getData" val="session_slider_1" :label="session_sliders[0].label" color="grey" />
										<q-checkbox size="sm" v-model="reflections_filter.session_slider_2" @update:model-value="getData" val="session_slider_2" :label="session_sliders[1].label" color="grey" />
										<q-checkbox size="sm" v-model="reflections_filter.session_slider_3" @update:model-value="getData" val="session_slider_3" :label="session_sliders[2].label" color="grey" />
										<q-separator style="width: 100%;" />
										<q-checkbox size="sm" v-model="reflections_filter.challenges" @update:model-value="getData" val="challenges" label="Challenges" color="grey" />
										<q-checkbox size="sm" v-model="reflections_filter.successes" @update:model-value="getData" val="successes" label="Successes" color="grey" />
										<q-checkbox size="sm" v-model="reflections_filter.summary" @update:model-value="getData" val="summary" label="Summary" color="grey" />
										<q-checkbox size="sm" v-model="reflections_filter.feedback" @update:model-value="getData" val="feedback" label="Feedback" color="grey" />
									</q-form>
								</template>

								<template class="row items-stretch" style="gap: 10px">
									<template v-if="currently_grouping == false" >
										<!-- <q-card v-for="row in reflection_rows" square flat bordered class="my-card q-pa-sm" :class="$q.dark.isActive ? 'bg-grey-7' : 'bg-grey-12'" style="width:calc((100% - 50px) / 3);"> -->
										<q-card v-for="row in reflection_rows" square flat bordered class="my-card q-pa-sm reflections-item" :class="$q.dark.isActive ? 'bg-grey-7' : 'bg-grey-12'" >
											<div class="row no-wrap items-center">
												<div class="row no-wrap q-mr-sm" style="width: 48px;height: 15px;">
													<template v-for="color in row.dimensions">
														<div class="col" :style="'height:100%; background-color: ' + color + ';'">
														</div>
													</template>
												</div>
												<div class="text-subtitle2 text-weight-medium ellipsis">{{row.name}} </div>
												<div class="text-subtitle2 text-weight-medium col-grow q-ml-xs"> | {{row.date}}</div>
											</div>
											<q-separator class="q-my-sm" color="grey-14" />
											<div v-if="reflections_filter.session_slider_1">
												<b>{{session_sliders[0].label}}: </b>
												<q-icon v-if="row.session_slider_1 == '--'" name="circle" color="grey-13" />
												<q-icon v-else-if="row.session_slider_1 <= 33" name="circle" color="red" />
												<q-icon v-else-if="row.session_slider_1 > 33 && row.session_slider_1 <= 66" name="circle" color="yellow-14" />
												<q-icon v-else-if="row.session_slider_1 > 66" name="circle" color="green-14" />
												{{row.session_slider_1}}
											</div>
											<div v-if="reflections_filter.session_slider_2">
												<b>{{session_sliders[1].label}}: </b>
												<q-icon v-if="row.session_slider_2 == '--'" name="circle" color="grey-13" />
												<q-icon v-else-if="row.session_slider_2 <= 33" name="circle" color="red" />
												<q-icon v-else-if="row.session_slider_2 > 33 && row.session_slider_2 <= 66" name="circle" color="yellow-14" />
												<q-icon v-else-if="row.session_slider_2 > 66" name="circle" color="green-14" />
												{{row.session_slider_2}}
											</div>
											<div v-if="reflections_filter.session_slider_3">
												<b>{{session_sliders[2].label}}: </b>
												<q-icon v-if="row.session_slider_3 == '--'" name="circle" color="grey-13" />
												<q-icon v-else-if="row.session_slider_3 <= 33" name="circle" color="red" />
												<q-icon v-else-if="row.session_slider_3 > 33 && row.session_slider_3 <= 66" name="circle" color="yellow-14" />
												<q-icon v-else-if="row.session_slider_3 > 66" name="circle" color="green-14" />
												{{row.session_slider_3}}
											</div>
											<q-separator v-if="reflections_filter.session_slider_1 || reflections_filter.session_slider_2 || reflections_filter.session_slider_3" color="grey-13" class="q-my-sm" />
											<div v-if="reflections_filter.challenges"><b>Challenges...</b> {{row.challenges}}</div>
											<q-separator v-if="reflections_filter.challenges" color="grey-13" class="q-my-sm" />
											<div v-if="reflections_filter.successes"><b>The successes were...</b> {{row.successes}}</div>
											<q-separator v-if="reflections_filter.successes" color="grey-13" class="q-my-sm" />
											<div v-if="reflections_filter.summary"><b>Summary...</b> {{row.summary}}</div>
											<q-separator v-if="reflections_filter.summary" color="grey-13" class="q-my-sm" />
											<div v-if="reflections_filter.feedback"><b>Feedback/improvements for Future [intended as notes to observer only?]:</b> {{row.feedback}}</div>
										</q-card>
									</template>
									<template v-else >
										<template v-if="number_of_groups > 0">
											<template v-for="group, title in reflection_rows_grouped">
												<template v-if="group.length > 0" >
													<q-separator style="width: 100%;" color="black" />
													<div class="q-table__title" style="width: 100%;">{{title}}</div>
													<q-card v-for="reflection, key in group" square flat bordered class="my-card q-pa-sm reflections-item" :class="$q.dark.isActive ? 'bg-grey-7' : 'bg-grey-12'" >
														<div class="row no-wrap items-center">
															<div class="row no-wrap q-mr-sm" style="width: 48px;height: 15px;">
																<template v-for="color in reflection.dimensions">
																	<div class="col" :style="'height:100%; background-color: ' + color + ';'">
																	</div>
																</template>
															</div>
															<div class="text-subtitle2 text-weight-medium ellipsis">{{reflection.name}} </div>
															<div class="text-subtitle2 text-weight-medium col-grow q-ml-xs"> | {{reflection.date}}</div>
														</div>
														<q-separator class="q-my-sm" color="grey-14" />
														<div v-if="reflections_filter.session_slider_1">
															<b>{{session_sliders[0].label}}: </b>
															<q-icon v-if="reflection.session_slider_1 == '--'" name="circle" color="grey-13" />
															<q-icon v-else-if="reflection.session_slider_1 <= 33" name="circle" color="red" />
															<q-icon v-else-if="reflection.session_slider_1 > 33 && reflection.session_slider_1 <= 66" name="circle" color="yellow-14" />
															<q-icon v-else-if="reflection.session_slider_1 > 66" name="circle" color="green-14" />
															{{reflection.session_slider_1}}
														</div>
														<div v-if="reflections_filter.session_slider_2">
															<b>{{session_sliders[1].label}}: </b>
															<q-icon v-if="reflection.session_slider_2 == '--'" name="circle" color="grey-13" />
															<q-icon v-else-if="reflection.session_slider_2 <= 33" name="circle" color="red" />
															<q-icon v-else-if="reflection.session_slider_2 > 33 && reflection.session_slider_2 <= 66" name="circle" color="yellow-14" />
															<q-icon v-else-if="reflection.session_slider_2 > 66" name="circle" color="green-14" />
															{{reflection.session_slider_2}}
														</div>
														<div v-if="reflections_filter.session_slider_3">
															<b>{{session_sliders[2].label}}: </b>
															<q-icon v-if="reflection.session_slider_3 == '--'" name="circle" color="grey-13" />
															<q-icon v-else-if="reflection.session_slider_3 <= 33" name="circle" color="red" />
															<q-icon v-else-if="reflection.session_slider_3 > 33 && reflection.session_slider_3 <= 66" name="circle" color="yellow-14" />
															<q-icon v-else-if="reflection.session_slider_3 > 66" name="circle" color="green-14" />
															{{reflection.session_slider_3}}
														</div>
														<q-separator v-if="reflections_filter.session_slider_1 || reflections_filter.session_slider_2 || reflections_filter.session_slider_3" color="grey-13" class="q-my-sm" />
														<div v-if="reflections_filter.challenges"><b>Challenges...</b> {{reflection.challenges}}</div>
														<q-separator v-if="reflections_filter.challenges" color="grey-13" class="q-my-sm" />
														<div v-if="reflections_filter.successes"><b>The successes were...</b> {{reflection.successes}}</div>
														<q-separator v-if="reflections_filter.successes" color="grey-13" class="q-my-sm" />
														<div v-if="reflections_filter.summary"><b>Summary...</b> {{reflection.summary}}</div>
														<q-separator v-if="reflections_filter.summary" color="grey-13" class="q-my-sm" />
														<div v-if="reflections_filter.feedback"><b>Feedback/improvements for Future [intended as notes to observer only?]:</b> {{reflection.feedback}}</div>
													</q-card>
												</template>
											</template>
										</template>
										<div v-else class="q-mt-md">Sorry, there is not enough data to group by this field</div>
									</template>

								</template>
							</template>
							<template v-else>
							<!-- {{observations_filter}} -->
								<q-form class="row items-center q-mb-md" style="gap: 10px;" >
									<div class="text-h8 text-weight-medium">Filter by:</div>
									<q-input v-model="observations_filter.search" @update:model-value="getData" label="Search here" dense fill outlined square :class="$q.dark.isActive ? 'bg-black' : 'bg-white'" style="max-width: 200px" >
										<template v-slot:prepend>
											<q-icon name="search" />
										</template>
									</q-input>
									<q-select v-model="observations_filter.select_1" @update:model-value="clearObservationSelect" :options="observations_filter.select_1_options" label="-Select-" clearable dense fill outlined square :class="$q.dark.isActive ? 'bg-black' : 'bg-white'" style="min-width: 150px" />
									<q-select 
										:disable="!observations_filter.select_1" 
										v-model="observations_filter.select_2" 
										@update:model-value="getData" 
										:options="observations_filter.select_2_options[observations_filter.select_1]" 
										:reset-on-options-change="true" 
										label="-Select-" 
										clearable dense fill outlined square 
										:class="$q.dark.isActive ? 'bg-black' : 'bg-white'" 
										style="min-width: 150px" 
									/>

									<q-checkbox size="md" v-model="observations_filter.images" @update:model-value="getData" unchecked-icon="photo_camera" checked-icon="camera_alt" color="green" />
									<q-checkbox size="md" v-model="observations_filter.starred" @update:model-value="getData" unchecked-icon="star_border" checked-icon="star" indeterminate-icon="star_border" color="amber-13" />
								</q-form>

								<template class="row items-stretch" style="gap: 10px;">
									<!-- popup if an observation is clicked -->
									<q-card v-if="Object.keys(observation_popup).length > 0" class="q-pa-md row viewing-observation" style="width:100%;" >
										<div class="row no-wrap items-center" style="width: 100%;">
											<q-icon size="sm" :name="observation_popup.is_starred ? 'star' : 'star_border'" color="amber-13" />
											<div class="col-shrink text-subtitle2 text-weight-medium ellipsis" >{{observation_popup.session_name}}</div>
											<div class="text-subtitle2 text-weight-medium col-grow q-ml-xs"> | {{observation_popup.date}}</div>
											<q-btn @click="closeObservation" dense flat icon="close" color="grey" />
										</div>
										
										<q-img v-if="observation_popup.image" :src="CONFIG.directus_url+'/assets/' + observation_popup.image + '?access_token=' + user.userAccessToken" style="max-height: 400px; max-width: calc((100% - 25px) / 2); margin-right: 25px;" />

										<div>
											<div v-if="observation_popup.time" class="text-body2 text-weight-bold q-mb-sm" style="letter-spacing:-.5px;">{{observation_popup.time}}</div>
											<div v-if="observation_popup.note" class="text-caption q-mb-sm " style="letter-spacing: 0px; line-height: 15px;">Note: {{observation_popup.note}}</div>
											<div v-if="observation_popup.dimension" class="text-caption q-px-sm q-py-xs q-mb-sm" :style="'letter-spacing: 0px; line-height: 15px; width: fit-content; border-radius: 50px; color: white; background-color: ' + observation_popup.dimension_color + ';'">{{observation_popup.dimension}}</div>
											<div v-if="observation_popup.indicator" class="text-caption " style="letter-spacing: 0px; line-height: 15px;">Indicator: {{observation_popup.indicator}}</div>
											
											<div v-if="observation_popup.attendee_code" class="q-mt-sm">
												<q-icon name="person" />
												{{observation_popup.attendee_code}}
											</div>
										</div>
									</q-card>

									<template v-else>
										<template v-if="currently_grouping == false" >

											<template v-for="observation, i in observation_rows" >
												<div v-if="1==2 && (observations_filter.images == false || (observations_filter.images == true && observation.image != null))">{{observation.session_name}} ?? {{observations_filter.images == true}} && {{observation.image != null}} == {{observations_filter.images == true && observation.image != null}} <q-img v-if="observation.image" :src="CONFIG.directus_url+'/assets/' + observation.image + '?access_token=' + user.userAccessToken" style="height: 150px; width: 100%;" class="q-mb-md" /></div>
												<q-card 
													v-if="
													(
														(
															observations_filter.search == '' || observation.note.includes(observations_filter.search)
														) && 
														(
															observations_filter.select_2 == null || 
															(
																(
																	observations_filter.select_1 == 'dimensions' && observation.dimension == observations_filter.select_2
																) || (
																	observations_filter.select_1 == 'indicators' && observation.indicator == observations_filter.select_2
																) || (
																	observations_filter.select_1 == 'attendee_code' && observation.attendee_code == observations_filter.select_2
																)
															)
														) && 
														(
															observations_filter.images == false || (observations_filter.images == true && observation.image != null)
														) && 
														(
															observations_filter.starred == false || (observations_filter.starred == true && observation.is_starred == true)
														)
													) && 
													(
														observations_filter.search || observations_filter.select_2 || observations_filter.images || observations_filter.starred  || 
														observations_filter.search == '' && observations_filter.select_2 == null && observations_filter.images == false && observations_filter.starred == false && i < observations_showing
													)
													" 
													square flat bordered 
													class="my-card q-pa-sm q-pb-md observation-item" 
													:class="$q.dark.isActive ? 'bg-grey-7' : 'bg-grey-3'" 
												>
													<div class="row no-wrap items-center" style="max-width: 100%;">
														<q-icon size="sm" :name="observation.is_starred ? 'star' : 'star_border'" color="amber-13" />
														<div class="col-shrink text-subtitle2 text-weight-medium ellipsis" >{{observation.session_name}}</div>
														<div class="text-subtitle2 text-weight-medium col-grow q-ml-xs"> | {{observation.date}}</div>
														<q-icon @click="expandObservation(observation.id)" name="open_in_full" class="q-ml-sm" style="cursor: pointer;" />
													</div>

													<q-img v-if="observation.image" :src="CONFIG.directus_url+'/assets/' + observation.image + '?access_token=' + user.userAccessToken" style="height: 150px; width: 100%;" class="q-mb-md" />
													
													<q-separator v-else color="grey-13" class="q-mb-md" />

													<div v-if="observation.time" class="text-body2 text-weight-bold q-mb-sm" style="letter-spacing:-.5px;">{{observation.time}}</div>
													<div v-if="observation.note" class="text-caption q-mb-sm" style="letter-spacing: 0px; line-height: 15px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical;">Note: {{observation.note}}</div>
													<div v-if="observation.dimension" class="text-caption q-px-sm q-py-xs q-mb-sm" :style="'letter-spacing: 0px; line-height: 15px; width: fit-content; border-radius: 50px; color: white; background-color: ' + observation.dimension_color + ';'">{{observation.dimension}}</div>
													<div v-if="observation.indicator" class="text-caption ellipsis-2-lines" style="letter-spacing: 0px; line-height: 15px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical;">Indicator: {{observation.indicator}}</div>
													
													<div v-if="observation.attendee_code" class="q-mt-sm">
														<q-icon name="person" />
														{{observation.attendee_code}}
													</div>
												</q-card>
											</template>

										</template>
										
										<template v-else >
											<template v-if="number_of_groups > 0">
												<template v-for="group, title in observation_rows_grouped">
													<template v-if="group.length > 0" >

														<q-separator style="width: 100%;" color="black" />
														<div class="q-table__title" style="width: 100%;">{{title}}</div>

														<template v-for="observation, i in group" >
															<div v-if="1==2 && (observations_filter.images == false || (observations_filter.images == true && observation.image != null))">{{observation.session_name}} ?? {{observations_filter.images == true}} && {{observation.image != null}} == {{observations_filter.images == true && observation.image != null}} <q-img v-if="observation.image" :src="CONFIG.directus_url+'/assets/' + observation.image + '?access_token=' + user.userAccessToken" style="height: 150px; width: 100%;" class="q-mb-md" /></div>
															<q-card 
																v-if="
																(
																	(
																		observations_filter.search == '' || observation.note.includes(observations_filter.search)
																	) && 
																	(
																		observations_filter.select_2 == null || 
																		(
																			(
																				observations_filter.select_1 == 'dimensions' && observation.dimension == observations_filter.select_2
																			) || (
																				observations_filter.select_1 == 'indicators' && observation.indicator == observations_filter.select_2
																			) || (
																				observations_filter.select_1 == 'attendee_code' && observation.attendee_code == observations_filter.select_2
																			)
																		)
																	) && 
																	(
																		observations_filter.images == false || (observations_filter.images == true && observation.image != null)
																	) && 
																	(
																		observations_filter.starred == false || (observations_filter.starred == true && observation.is_starred == true)
																	)
																)
																" 
																square flat bordered 
																class="my-card q-pa-sm q-pb-md observation-item" 
																:class="$q.dark.isActive ? 'bg-grey-7' : 'bg-grey-3'" 
															>
																<div class="row no-wrap items-center" style="max-width: 100%;">
																	<q-icon size="sm" :name="observation.is_starred ? 'star' : 'star_border'" color="amber-13" />
																	<div class="col-shrink text-subtitle2 text-weight-medium ellipsis" >{{observation.session_name}}</div>
																	<div class="text-subtitle2 text-weight-medium col-grow q-ml-xs"> | {{observation.date}}</div>
																	<q-icon @click="expandObservation(observation.id)" name="open_in_full" class="q-ml-sm" style="cursor: pointer;" />
																</div>

																<q-img v-if="observation.image" :src="CONFIG.directus_url+'/assets/' + observation.image + '?access_token=' + user.userAccessToken" style="height: 150px; width: 100%;" class="q-mb-md" />
																
																<q-separator v-else color="grey-13" class="q-mb-md" />

																<div v-if="observation.time" class="text-body2 text-weight-bold q-mb-sm" style="letter-spacing:-.5px;">{{observation.time}}</div>
																<div v-if="observation.note" class="text-caption q-mb-sm ellipsis-2-lines" style="letter-spacing: 0px; line-height: 15px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical;">Note: {{observation.note}}</div>
																<div v-if="observation.dimension" class="text-caption q-px-sm q-py-xs q-mb-sm" :style="'letter-spacing: 0px; line-height: 15px; width: fit-content; border-radius: 50px; color: white; background-color: ' + observation.dimension_color + ';'">{{observation.dimension}}</div>
																<div v-if="observation.indicator" class="text-caption ellipsis-2-lines" style="letter-spacing: 0px; line-height: 15px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical;">Indicator: {{observation.indicator}}</div>
																
																<div v-if="observation.attendee_code" class="q-mt-sm">
																	<q-icon name="person" />
																	{{observation.attendee_code}}
																</div>
															</q-card>
														</template>
													</template>
												</template>
											</template>
											<div v-else class="q-mt-md">Sorry, there is not enough data to group by this field</div>
										</template>
									</template>
								</template>
								<q-btn v-if="Object.keys(observation_popup).length == 0 && observations_showing <= observation_rows.length && observations_filter.search == '' && !observations_filter.select_2 && observations_filter.images == false && observations_filter.starred == false && currently_grouping == false" @click="showMore" outline square color="grey-14" class="q-mt-md q-px-sm" >Show more</q-btn>
							</template>
						</div>
					</div>
				</div>
			</div>

		</q-expansion-item>

		<!-- footer -->
		<section class="row items-center justify-center">
		</section>
	</div>

	<div class="row justify-center fixed-bottom q-mb-md">
	</div>
	`,
  };