(function (requirejs, YCS, BMap) {
'use strict'; 

var YM = YCS.BMAP;
var U = YCS.USER;
var Data = YCS.UTIL.Data;

requirejs(['vue', 'topBar', 'carousel', 'lazyLoad', 'getDistance', 'cityList', 'backToTop', 'vueTouch', 'footerLogin'], 
 function (vm, topBar, carousel, lazyLoad, getDistance, cityList, backToTop, vueTouch, footerLogin) {

	vm.use(vueTouch);

	var globalTopBar = new vm({
		el: '#globalTopBar',
		data: function () {
			return {
				hasRendered: false,
				showList: false,
				selectedCityName: '定位中…',
				selectedCity: {},
				ipCity: {}
			};
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
		},

		events: {
			'topbar-ready': function () {
				this.hasRendered = true;
			}
		}

	});

	var homeSlider = new vm({
		el: '#homeSlider',
		data: function () {
			return {
				hasRendered: false,
				items: [
					{
						img: 'http://fs.ycs.com/idxturn/201602/7/1636a93362.png',
						link: '#1'
					},
					{
						img: 'http://fs.ycs.com/idxturn/201602/7/162a488242.jpg',
						link: '#2'
					},
					{
						img: 'http://fs.ycs.com/idxturn/201602/7/16a91f3f14.png',
						link: '#3'
					}
				]
			};
		},
		events: {
			'carousel-ready': function () {
				this.hasRendered = true;
			}
		}
	});

	var expertList = new vm({
		el: '#hotExpertsList',
		data: function () {
			return {
				loopCount: 0,

				userCoord: undefined,

				experts: [
					{
						name: '刘兴懿',
						experience: 12,
						tags: '工商、审计、财务会计、税务、许可证、商标审计、资产评估',
						address: '广州市白云区云城西路888号1221房',
						image: 'http://fs.1caishui.com/propepo/201601/16/208baf2c9f.jpg'
					},
					{
						name: '朱利新',
						experience: 13,
						tags: '工商、审计、财务会计、税务、资产评估',
						address: '广州市白云区三元里松柏东街13号A401房',
						image: 'http://fs.1caishui.com/propepo/201601/77/13dc6d5f35.jpg'
					},
					{
						name: '苏志明',
						experience: 24,
						tags: '工商、审计、财务会计、税务、商标审计、资产评估',
						address: '广州市海珠区宝岗大道268号1417',
						image: 'http://fs.1caishui.com/propepo/201601/77/138dbe34b8.jpg'
					},
					{
						name: '李贵花',
						experience: 13,
						tags: '工商、审计、财务会计、税务、资产评估',
						address: '广州市越秀区光塔路183号樱花大厦610',
						image: 'http://fs.1caishui.com/propepo/201601/77/135558202d.jpg'
					},
					{
						name: '皮丽娟',
						experience: 5,
						tags: '工商、审计、财务会计、税务、资产评估',
						address: '广州市天河区黄埔大道中路152号22E房之一',
						image: 'http://fs.1caishui.com/propepo/201601/77/13c8bf2fb3.jpg'
					}
				]
			};
		},

		methods: {
			getUserCoord: function () {
				if (!U.geoCoord) {
					if (this.loopCount >= 30 ) { return; }

					var self = this;
					window.setTimeout(function () {
						self.loopCount++;
						self.getUserCoord();
					}, 1000);
					return;
				}

				this.userCoord = U.geoCoord;
			}
		},

		attached: function () {
			var self = this;
			window.setTimeout(function () {
				self.getUserCoord();
			}, 3000);
		}
	});

	var globalFooterLogin = new vm({
		el: '#footerLogin'
	});

});

}(window.requirejs, window.YCS, window.BMap));