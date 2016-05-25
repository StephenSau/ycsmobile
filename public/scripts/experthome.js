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
			'selected-city': function (eventData) {
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

	var expertList = new vm({
		el: '#expertList',
		ready: function () {
			this.getUserPosAndAddress();
		},
		data: function () {
			return {
				experts: [
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', years:'1年经验', field: '工商,财务会计,审计,税务,法律,资产评估,许可证,商标专利,人力资源', address: '广东省广州天河区天河路633号'},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', years:'2年经验', field: '工商,财务会计,审计,税务', address: ' 广东省广州市天河区中山大道中268号'},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思思宏', years:'3年经验', field: '工商,财务会计,审计,税务,法律,资产评估', address: '广东省广州市白云区上步花园A3幢D梯803'},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', years:'13年经验', field: '工商,财务会计,审计,税务,法律,资产评估,许可证', address: '广东省广州市天河区林和西路43号公安城管综合大楼'},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', years:'88年经验', field: '工商,财务会计,审计,税务,法律,资产评估,许可证,商标专利', address: '广东省广州市天河区林和西路43号公安城管综合大楼'},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', years:'77年经验', field: '工商,财务会计', address: '广东省广州市天河区林和西路43号公安城管综合大楼'},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', years:'13年经验', field: '工商,财务会计', address: '广东省广州市天河区林和西路43号公安城管综合大楼'},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', years:'13年经验', field: '工商', address: '广东省广州市天河区林和西路43号公安城管综合大楼'},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', years:'13年经验', field: '财务会计', address: '广东省广州市天河区林和西路43号公安城管综合大楼'},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', years:'13年经验', field: '审计', address: '广东省广州市天河区林和西路43号公安城管综合大楼'},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', years:'13年经验', field: '税务', address: '广东省广州市天河区林和西路43号公安城管综合大楼'},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', years:'13年经验', field: '法律', address: '广东省广州市天河区林和西路43号公安城管综合大楼'},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', years:'13年经验', field: '资产评估', address: '广东省广州市天河区林和西路43号公安城管综合大楼'},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', years:'13年经验', field: '许可证', address: '广东省广州市天河区林和西路43号公安城管综合大楼'},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', years:'13年经验', field: '商标专利', address: '广东省广州市天河区林和西路43号公安城管综合大楼'},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', years:'13年经验', field: '人力资源', address: '广东省广州市天河区林和西路43号公安城管综合大楼'},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', years:'13年经验', field: '财务会计,审计,税务', address: '广东省广州市天河区林和西路43号公安城管综合大楼'},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', years:'13年经验', field: '税务,法律,资产评估', address: '广东省广州市天河区林和西路43号公安城管综合大楼'},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', years:'13年经验', field: '资产评估,许可证', address: '广东省广州市天河区林和西路43号公安城管综合大楼'},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', years:'13年经验', field: '税务,法律', address: '广东省广州市天河区林和西路43号公安城管综合大楼'},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', years:'13年经验', field: '审计,税务', address: '广东省广州市天河区林和西路43号公安城管综合大楼'},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', years:'13年经验', field: '工商,审计', address: '广东省广州市天河区林和西路43号公安城管综合大楼'},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', years:'13年经验', field: '工商,财务会计,审计', address: '广东省广州市天河区林和西路43号公安城管综合大楼'},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', years:'13年经验', field: '工商,财务会计,审计,税务,法律', address: '广东省广州市天河区林和西路43号公安城管综合大楼'},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', years:'13年经验', field: '工商,财务会计,审计,税务,法律', address: '广东省广州市天河区林和西路43号公安城管综合大楼'}	
				],
				userCoord: undefined,
				userAddr: undefined,
				userPos: undefined,
				userGeoLocation: undefined,
				currentField: '全部擅长领域',
				currentDistance: '综合排序',
				filterField: false,
				filterDistance: false,
				fields: [
					{name: '全部擅长领域', active: true},
					{name: '工商服务', active: false},
					{name: '财会服务', active: false},
					{name: '税务服务', active: false},
					{name: '行政许可', active: false},
					{name: '商标专利', active: false},
					{name: '人事服务', active: false},
					{name: '社保公积金', active: false}
				],
				distances: [
					{name: '综合排序', active: true},
					{name: '离我最近', active: false},
					{name: '经验最好', active: false}
				],			
				showList: false,
				selectedCityCode: 440100
			};
		},
		methods: {
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

	    selectField: function (target) {
	    	this.fields.forEach(function(field){
	    		field.active = false;
	    		if(field.name === target){
	    			field.active = true;
	    		}
	    	});

	    	this.currentField = target;

	    	this.filterField = false;
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

	    toFilterField: function (){
	    	this.filterField = !this.filterField;
	    	this.filterDistance = false;
	    },

	    toFilterDistance: function (){
	    	this.filterDistance = !this.filterDistance;
	    	this.filterField = false;
	    },

	    selectLocation: function (){
	    	positionWrapper.userAddr = this.userAddr;
	    	positionWrapper.show = true;
	    }
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

	        expertList.userCoord = this.customCoord;
					expertList.userAddr = this.customAddr;
	    	}
	    },
	    showRedirect: function () {
	    	this.redirect = true;
	    },
	    closeRedirect: function () {
	    	this.redirect = false;
	    },
	    locateAgain: function () {
				expertList.getUserPosAndAddress();
				this.show = undefined;
	    },
		}
	});

	var globalFooterLogin = new vm({
		el: '#footerLogin'
	});

});

}(window.requirejs, window.BMap, window.YCS));