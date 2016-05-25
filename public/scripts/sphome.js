(function (requirejs, BMap, YCS) {
'use strict'; 

var YM = YCS.BMAP;
var U = YCS.USER;
var Data = YCS.UTIL.Data;

requirejs(['vue', 'topBar', 'ajax', 'getDistance', 'backToTop', 'hint', 'cityList', 'vueTouch', 'footerLogin'], function (vm, topBar, Ajax, getDistance, backToTop, hint, cityList, vueTouch, footerLogin) {
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
				window.setTimeout(function () {
					sphomeList.getData();
				}, 1000);
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

	var sphomeList = new vm({
		el: '#sphomeList',
		ready: function () {
			this.getData();
			this.getUserPosAndAddress();
		},
		data: function () {
			return {
				spList: [],
				userCoord: undefined,
				userAddr: undefined,
				userPos: undefined,
				userGeoLocation: undefined,
				districts: [
					{name: '全部区域', num: null, active: true},
					{name: '荔湾区', num: 22, active: false},
					{name: '越秀区', num: 51, active: false},
					{name: '海珠区', num: 39, active: false},
					{name: '天河区', num: 74, active: false},
					{name: '白云区', num: 40, active: false},
					{name: '黄埔区', num: 21, active: false},
					{name: '番禺区', num: 52, active: false},
					{name: '南沙区', num: 1, active: false},
					{name: '从化区', num: 5, active: false},
					{name: '增城区', num: 9, active: false},
				],
				distances: [
					{name: '离我最近', active: true},
					{name: '综合排序', active: false},
					{name: '销量最大', active: false},
					{name: '评价最高', active: false}
				],
				filterDistrict: false,
				filterDistance: false,
				currentDistrict: '全部区域',
				currentDistance: '离我最近',			
				showList: false,
				selectedCityCode: 440100,
				selectedCityName: '广州市',
				selectedCity: undefined
			};
		},
		methods: {
	    getData: function () {
	    	var qData = {
					province: globalTopBar.selectedCity.pc,
					city: globalTopBar.selectedCity.c,
	        ascOrDesc: 'desc',
	        pageNumber: '1',
	        pageSize: 999
				};

				var request = new Ajax(this, '/servicer/getServicerListById.htm', qData);
				request.then(function (response) {
					if(response.data.status === '200'){
						this.spList = response.data.re.servicerList;
					}
				});

	    },

	    renderPosAndAddress: function () {
        this.userPos = U.geoPosition;
        this.userCoord = U.geoCoord;
        this.userGeoLocation = U.geoLocation;
        this.userAddr = U.geoAddress;
	    },

	    getUserPosAndAddress: function () {
	    	this.$nextTick(function () {
	        YM.getUserPos(true, this.renderPosAndAddress);
	      });
	    },

	    selectDistrict: function (target) {
	    	this.districts.forEach(function(district){
	    		district.active = false;
	    		if(district.name === target){
	    			district.active = true;
	    		}
	    	});

	    	this.currentDistrict = target;

	    	this.filterDistrict = false;
	    },

	    selectDistance: function (target) {
	    	this.distances.forEach(function(distance){
	    		distance.active = false;
	    		if(distance.name === target){
	    			distance.active = true;
	    		}
	    	});

	    	this.currentDistance = target;

	    	this.filterDistance = false;
	    },

	    toFilterDistrict: function (){
	    	this.filterDistrict = !this.filterDistrict;
	    	this.filterDistance = false;
	    },

	    toFilterDistance: function (){
	    	this.filterDistance = !this.filterDistance;
	    	this.filterDistrict = false;
	    },

	    selectLocation: function (){
	    	positionWrapper.userAddr = this.userAddr;
	    	positionWrapper.show = true;
	    },
		}
	});

	var positionWrapper = new vm({
		el: '#position-wrapper',
		data: {
			show: undefined,
			redirect: undefined,
			userAddr: undefined,
			customAddr: undefined,
			customCoord: undefined,
			tempCustomAddr: undefined,
			showHint: undefined,
			delayInMs: Number,
			hintText: String
		}, 
		methods: {
			hideIt : function () {
				this.show = undefined;
			},

			updateCustomAddress: function (tempCustomAddr) {
	    	YM.addrToCoord(this.tempCustomAddr, this.renderCustomAddrAndCoord, 'custom');
	    },

	    renderCustomAddrAndCoord: function (callbackData) {
	    	if (callbackData && callbackData === 'hasError') {
	    		this.showHint = true;
					this.hintText = '百度无法定位' + this.tempCustomAddr;
					this.delayInMs = 1000;
	    	} else {
		    	this.customAddr = this.tempCustomAddr;
		    	this.customCoord = callbackData || U.customCoord;
					this.show = undefined;
					this.redirect = undefined;
					this.tempCustomAddr = undefined;
					sphomeList.spList = [];
	        sphomeList.userCoord = this.customCoord;
					sphomeList.userAddr = this.customAddr;
					sphomeList.getData();
	    	}
	    },
	    showRedirect: function () {
	    	this.redirect = true;
	    },
	    closeRedirect: function () {
	    	this.redirect = false;
	    },
	    locateAgain: function () {
	    	sphomeList.spList = [];
				sphomeList.getUserPosAndAddress();
	    	sphomeList.getData();
				this.show = undefined;
	    },
		}
	});

	var globalFooterLogin = new vm({
		el: '#footerLogin'
	});

});

}(window.requirejs, window.BMap, window.YCS));