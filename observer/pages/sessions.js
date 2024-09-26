const { reactive, computed, ref, watch, date } = Vue

import {user} from '/observer/store/user.js'
import {data} from '/observer/store/data.js'

export default {
    name: 'All Sessions',

	setup() {
		// console.log('user', user);
		const title = 'All Sessions';
		data.currentPage = 'All Sessions';

		// // getting color for fixed table
        // const $q = Quasar.useQuasar()
		// $q.dark.set('auto');
		// let dark_mode = ref($q.dark.isActive);
		let background_color = ref((user.darkmode) ? 'black' : 'white');
		// watch(dark_mode, (newValue, oldValue) => {
		// 	background_color = (newValue) ? 'black' : 'white'
		// 	console.log('watch', newValue);
		// 	// TODO save to user's preferences?
		// 	// $q.dark.set(newValue);
		// });

		let columns = [ // array of Objects
			{ name: 'complete', align: 'left', label: '', field: 'complete', sortable: true },
			{
				// unique id (used by pagination.sortBy, "body-cell-[name]" slot, ...)
				name: 'name',
				// label for header
				label: 'Name',
				field: 'name',
				// (optional) if we use visible-columns, this col will always be visible
				// required: true,

				// (optional) alignment
				align: 'left',
			
				// (optional) tell QTable you want this column sortable
				sortable: true,
			
				// (optional) compare function if you have
				// some custom data or want a specific way to compare two rows
				// sort: (a, b, rowA, rowB) => parseInt(a, 10) - parseInt(b, 10),
				// function return value:
				//   * is less than 0 then sort a to an index lower than b, i.e. a comes first
				//   * is 0 then leave a and b unchanged with respect to each other, but sorted with respect to all different elements
				//   * is greater than 0 then sort b to an index lower than a, i.e. b comes first
			
				// (optional) override 'column-sort-order' prop;
				// sets column sort order: 'ad' (ascending-descending) or 'da' (descending-ascending)
				// sortOrder: 'ad', // or 'da'
			
				// (optional) you can format the data with a function
				// format: (val, row) => `${val}%`,
				// one more format example:
				// format: val => val
			},
			{ name: 'date', align: 'left', label: 'Date', field: 'date', sortable: true },
			{ name: 'location_id', align: 'left', label: 'Location', field: 'location_id', sortable: true },
			{ name: 'partner_id', align: 'left', label: 'Partner', field: 'partner_id', sortable: true },
			{ name: 'framework_id', align: 'left', label: 'Framework', field: 'framework_id', sortable: true },
			//{ name: 'id', label: '', field: 'id', classes: 'hidden' },
			{ name: 'actions', label: '', field: '', style:"position: sticky;right: 0;z-index: 1;", align:'center' },
		];
		let complete_rows = user.sessions.data.filter(function (el) {
			return el.complete == 1;
		});
		let incomplete_rows = user.sessions.data.filter(function (el) {
			return el.complete == 0;
		});
		function myfilterMethod() {
			// console.log('???', filter_form.value['status'].value, filter_search.value, user.sessions.data);
			const filteredRows = user.sessions.data.filter((row, i) =>{
				// console.log('?', i, row.complete);
				// additive search so we'll fine any reason for ans to be false
				let it_matches = true;
				// match first filter
				if (filter_form.value['status'].value != null) {
					if (filter_form.value['status'].value=='Incomplete' && row.complete) it_matches = false;
					if (filter_form.value['status'].value=='Complete' && !row.complete) it_matches = false;
				}
				// match location
				if (filter_form.value['location'].value != null) {
					if (row.location_id != filter_form.value['location'].value) it_matches = false;
				}
				// match partner
				if (filter_form.value['partner'].value != null) {
					if (row.partner_id != filter_form.value['partner'].value) it_matches = false;
				}
				// match framework
				if (filter_form.value['framework'].value != null) {
					if (row.framework_id != filter_form.value['framework'].value) it_matches = false;
				}
				// if there's a search, we have to match both
				if (filter_search.value.trim()) {
					// try name:
					let s1 = false;
					// // see if any of the values match? -- not needed here
					// let s1_values = Object.values(row);
					// for (let val = 0; val<s1_values.length; val++){
					// 	// console.log('?????', val, s1_values[val]);
					// 	let my_val = s1_values[val];
					// 	if (my_val === null) my_val = '';// safety against null
					// 	if (my_val.toString().toLowerCase().includes(filter_search.value.toLowerCase())){
					// 		s1 = true;
					// 		break
					// 	}
					// }
					// see if our name matches?
					// console.log('??', row.name.toString().toLowerCase(), filter_search.value.toLowerCase());
					if (row.name.toString().toLowerCase().includes(filter_search.value.toLowerCase())) s1 = true;;
					// see if our location name matches typed in search
					// console.log('find me', row.location_id, user.locations.data[2]['name'].toLowerCase(), filter_search.value.toLowerCase());
					if (row.location_id && user.locations.data.find(obj => {return obj.id === row.location_id})['name'].toLowerCase().includes(filter_search.value.toLowerCase())) s1 = true;
					// see if our partner name matches typed in search
					// console.log('find me', row.location_id, user.locations.data[2]['name'].toLowerCase(), filter_search.value.toLowerCase());
					if (row.partner_id && user.partners.data.find(obj => {return obj.id === row.partner_id})['name'].toLowerCase().includes(filter_search.value.toLowerCase())) s1 = true;
					// see if our framework name matches typed in search
					// console.log('fine md', user.fdis.data[row.framework_id]);
					if (row.framework_id && user.fdis.data[row.framework_id]['framework_name'].toLowerCase().includes(filter_search.value.toLowerCase())) s1 = true;
					
					if (!s1) it_matches = false;
				}
				if (it_matches) return true;
			});
			return filteredRows;
		}
		// pagination
		const pagination = ref({
			rowsPerPage: 0
		})
		// filtering
		let filter_advanced_mode = ref(false);
		let filter_search = ref('');
		let filter_status = ref(null);
		let filter_location = ref(null);
		let filter_partner = ref(null);
		let filter_framework = ref(null);
		// a computed ref
		const filter_form = computed(() => {
			return {
				search: filter_search,
				status: filter_status,
				location: filter_location,
				partner: filter_partner,
				framework: filter_framework,
			}
		})
		function go_to_page(which_id) {
			Vue.$router.push(which_id);
		}
		function editSession(which) {
			console.log('editSession', which);
			Vue.$router.push('/session/'+which.key);
		}
		let quasarDate = Quasar.date;
		return {user, data, columns, complete_rows, incomplete_rows, editSession, quasarDate, go_to_page, myfilterMethod, pagination, filter_advanced_mode, filter_search, filter_status, filter_location, filter_framework, filter_partner, filter_form}
	},


    template: `
	<div>
		<!-- home -->
		<q-table flat :filter="filter_form" :filter-method="myfilterMethod" title="Sessions" :rows="user.sessions.data" :columns="columns" v-model:pagination="pagination" :hide-pagination="true" :rows-per-page-options="[0]" row-key="id" class="q-mb-lg" style="height: calc(100vh - 103px)" virtual-scroll>
			<template v-slot:top>
				<div class="row no-wrap full-width">
					<q-btn outline @click="filter_advanced_mode = !filter_advanced_mode" style="opacity: .4"><q-icon name="tune" /></q-btn>
					<q-input class="full-width" outlined dense debounce="300" v-model="filter_search" label="Search all fields">
						<template v-slot:append>
							<q-icon name="search" />
						</template>
					</q-input>
				</div>
				<div v-if="filter_advanced_mode" class="row no-wrap full-width">
					<q-select outlined dense clearable :options="['Incomplete','Complete']" v-model="filter_status" label="Status" class="col-4" />
					<q-select outlined dense clearable label="Location" v-model="filter_location" emit-value map-options :options="user.locations.data" option-label="name" option-value="id" class="col-8 text-no-wrap ellipsis"></q-select>
				</div>
				<div v-if="filter_advanced_mode" class="row no-wrap full-width">
					<q-select outlined dense clearable label="Partner" v-model="filter_partner" emit-value map-options :options="user.partners.data" option-label="name" option-value="id" class="col-6 text-no-wrap ellipsis"></q-select>
					<q-select outlined dense clearable label="Framework" v-model="filter_framework" emit-value map-options 
						:options="Object.values(user.fdis.data)" 
						:option-label="(opt) => (Object(opt) === opt && 'framework_name' in opt ? opt.framework_name : null)" 
						:option-value="(opt) => (Object(opt) === opt && 'framework_id' in opt ? opt.framework_id : null)" 
						class="col-6 text-no-wrap ellipsis">
					</q-select>
				</div>
			</template>

			<template v-slot:body-cell-complete="props">
				<q-td :props="props" @click="editSession(props)" style="cursor:pointer;">
					<q-icon v-if="props.row.complete" size="xs" color="secondary" name="check_circle_outline" />
					<q-icon v-else color="grey-5" size="xs" name="check_circle_outline" />
				</q-td>
			</template>
			<template v-slot:body-cell-name="props">
				<q-td :props="props" @click="editSession(props)" style="cursor:pointer;">
					{{ props.row.name }}
				</q-td>
			</template>
			<template v-slot:body-cell-date="props">
				<q-td :props="props" @click="editSession(props)" style="cursor:pointer;">
					{{ quasarDate.formatDate(props.row.date, 'MMM D') }}
				</q-td>
			</template>
			<template v-slot:body-cell-location_id="props">
				<q-td :props="props" @click="editSession(props)" style="cursor:pointer;">
					{{ (props.row.location_id) ? user.locations.data.find(obj => {return obj.id === props.row.location_id})['name'] : '' }}
				</q-td>
			</template>
			<template v-slot:body-cell-partner_id="props">
				<q-td :props="props" @click="editSession(props)" style="cursor:pointer;">
					{{ (props.row.partner_id) ? user.partners.data.find(obj => {return obj.id === props.row.partner_id})['name'] : '' }}
				</q-td>
			</template>
			<template v-slot:body-cell-framework_id="props">
				<q-td :props="props" @click="editSession(props)" style="cursor:pointer;">
					{{ user.fdis.data[props.row.framework_id].framework_name }}
				</q-td>
			</template>
			<template v-slot:body-cell-actions="props">
				<q-td :props="props" @click="editSession(props)" :style="'cursor:pointer;padding-left:12px;padding-right:12px;background-color:'+((user.darkmode=='dark') ? 'black' : 'white')">
					<q-icon name="arrow_forward_ios" size="medium" />
				</q-td>
			</template>

			<template v-slot:pagination="scope">
				<q-btn v-if="scope.pagesNumber > 2" icon="first_page" color="grey-8" round dense flat :disable="scope.isFirstPage" @click="scope.firstPage"/>
				<q-btn icon="chevron_left" color="grey-8" size="large" round dense flat :disable="scope.isFirstPage" @click="scope.prevPage" />
				<q-btn icon="chevron_right" color="grey-8" size="large" round dense flat :disable="scope.isLastPage" @click="scope.nextPage" />
				<q-btn v-if="scope.pagesNumber > 2" icon="last_page" color="grey-8" round dense flat :disable="scope.isLastPage" @click="scope.lastPage" />
			</template>
		</q-table>
	</div>
	<div class="row justify-center fixed-bottom q-mb-sm">
		<q-btn color="primary" tag="a" href="../session">New Session</q-btn>
	</div>
	`,
  };