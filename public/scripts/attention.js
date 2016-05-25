(function (requirejs, BMap, YCS) {
'use strict'; 

var YM = YCS.BMAP;
var U = YCS.USER;
var Data = YCS.UTIL.Data;

requirejs(['vue', 'topBar', 'ajax', 'backToTop', 'cityList', 'vueTouch', 'footerLogin'], function (vm, topBar, Ajax, backToTop, cityList, vueTouch, footerLogin) {
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

	var attentionList = new vm({
		el: '#attentionList',
		ready: function () {
		},
		data: {
			list: [
				{spec: '你', title: '企业核名', detail: '使用非常见文字能提高名字通过率。如果名称由“ABC”组成，则“AB”与“BC”组合需同时满足不重名的条件下，“ABC”方看作不重名。'},
				{spec: '知', title: '注册地址', detail: '1、注册地址必须具备商业用途 2、地址用途与行业特质相匹配，如制造业需要有厂房，大型医疗器械需要有一定面积的仓库 3、承租人信息需为法人或股东之一'},
				{spec: '道', title: '注册地址', detail: '1、注册地址必须具备商业用途 2、地址用途与行业特质相匹配，如制造业需要有厂房，大型医疗器械需要有一定面积的仓库 3、承租人信息需为法人或股东之一'},
				{spec: '邪', title: '注册地址', detail: '1、注册地址必须具备商业用途 2、地址用途与行业特质相匹配，如制造业需要有厂房，大型医疗器械需要有一定面积的仓库 3、承租人信息需为法人或股东之一'},
				{spec: '花', title: '注册地址', detail: '1、注册地址必须具备商业用途 2、地址用途与行业特质相匹配，如制造业需要有厂房，大型医疗器械需要有一定面积的仓库 3、承租人信息需为法人或股东之一'},
				{spec: '真', title: '注册地址', detail: '1、注册地址必须具备商业用途 2、地址用途与行业特质相匹配，如制造业需要有厂房，大型医疗器械需要有一定面积的仓库 3、承租人信息需为法人或股东之一'},
				{spec: '的', title: '注册地址', detail: '1、注册地址必须具备商业用途 2、地址用途与行业特质相匹配，如制造业需要有厂房，大型医疗器械需要有一定面积的仓库 3、承租人信息需为法人或股东之一'},
				{spec: '萌', title: '注册地址', detail: '1、注册地址必须具备商业用途 2、地址用途与行业特质相匹配，如制造业需要有厂房，大型医疗器械需要有一定面积的仓库 3、承租人信息需为法人或股东之一'},
				{spec: '啊', title: '注册地址', detail: '1、注册地址必须具备商业用途 2、地址用途与行业特质相匹配，如制造业需要有厂房，大型医疗器械需要有一定面积的仓库 3、承租人信息需为法人或股东之一'},
				{spec: '哈', title: '注册地址', detail: '1、注册地址必须具备商业用途 2、地址用途与行业特质相匹配，如制造业需要有厂房，大型医疗器械需要有一定面积的仓库 3、承租人信息需为法人或股东之一'},
			]
		}, 
		methods: {
		},
	});

	var globalFooterLogin = new vm({
		el: '#footerLogin'
	});

});

}(window.requirejs, window.BMap, window.YCS));