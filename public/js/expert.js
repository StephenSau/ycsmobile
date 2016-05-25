(function (requirejs, BMap, YCS) {
'use strict';

var YM = YCS.BMAP;
var U = YCS.USER;
var Data = YCS.UTIL.Data;

requirejs(['vue', 'topBar', 'cityList', 'vueTouch', 'footerLogin', 'dialBox'], function (vm, topBar, cityList, vueTouch, footerLogin, dialBox) {
	vm.use(vueTouch);
	
	// Init Global Topbar
	var globalTopBar = new vm({
		el: '#globalTopBar',
		data: function (){
			return {	
				showList: false,
				selectedCityName: '定位中…',
				selectedCity: {},
				ipCity: {}
			};
		},
		events: {
			'selected-city': function (data) {
			}
		},
		watch: {
			'selectedCity': {
				deep: true,
				handler: function (newVal, oldVal) {
					if (newVal && newVal.c && newVal.n) {
						this.renderSelectedCity(newVal);
					}
				}
			}
		},

		methods: {
			checkExistingData: function () {
				var existingSelectedCity = YM.checkExisting('selectedCity', 'local');
				if (existingSelectedCity && existingSelectedCity.n) {
					this.selectedCity = existingSelectedCity;
					this.selectedCityName = existingSelectedCity.n;
				}
				var existingIpCity = YM.checkExisting('ipCity', 'local');
				if (existingIpCity && existingIpCity.bc > 0) {
					this.ipCity = existingIpCity;
				}
			},
			showCityList: function (e) {
				e.preventDefault();
				this.showList = true;
			},
			renderSelectedCity: function (newItem) {
				this.selectedCityName = newItem.n;
				
			},
			getUserGeoCity: function (data) {
				if (!data || !data.address) { return; }

				if (!this.selectedCityName || !this.selectedCityName.length) {
					this.selectedCityName = data.address.city;
				}

				if (!this.selectedCity || !this.selectedCity.n || !this.selectedCity.bc) {
					// Polyfill for Baidu CityCode
					// coz' the returned `city_code` from the previous step is always `0` 
					YM.getUserCityCode(this.renderCityCode);
				}

			},
			renderCityCode: function (data) {
				if (data && data.bc) {
					this.selectedCity = data;
					this.ipCity = data;
					Data.store('ipCity', data, 'local');
				}
			}
		},

		ready: function () {
			this.checkExistingData();
		},

		attached: function () {
			YM.init();
			var self = this;
			window.setTimeout(function () {
				YM.getUserPos(true, self.getUserGeoCity, true);
			}, 2000);
		}
	});

	var expertDetail = new vm({
		el: '#expertDetail',
		data: function(){
			return{
				folded: true,
				dial: '',
			};
		},
		methods: {
			toggleExpand: function (toUnfold){
				if (toUnfold !== undefined){
					this.folded = !toUnfold;
				} else {
					this.folded = !this.folded;
				}
			},

			showDialBox: function (mobile) {
				this.dial = true;
				this.$broadcast('send-mobile', mobile);
			}
		}
	});

	var globalFooterLogin = new vm({
		el: '#footerLogin'
	});

});

}(window.requirejs, window.BMap, window.YCS));