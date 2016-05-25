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

	var faqList = new vm({
		el: '#faqList',
		ready: function () {
		},
		data: {
			list: [
				{title: '判定房屋合法来源的材料有那些？', content: [{text:'1、《接管房地产通知书》(直管房提供)'}, {text:'2、《房地产权属证明书》'}], folded: true},
				{title: '新公司如何购买发票？', content: [{text: '1、 核定税种：即根据您办理税务登记时提供的资料和实地调查的结果，核定您的应纳税税种。这是购买发票之前的最重要的一个环节 注：需法人、财务一同至税务专管员处进行办理，税务专管员的联系方式通常由代理公司告知'}, {text:'2、办税员培训：办税员为企业日后购买发票、保管发票的重要人员，对发票的遗失等事项负相应责任 备注：培训后七个工作日至相关税务部门取办税员联系卡'}], folded: true},
				{title: '判定房屋合法来源的材料有哪些凑个两行字数也是不容易的哎呀怎么还不够?', content: [{text: '1、 核定税种：即根据您办理税务登记时提供的资料和实地调查的结果，核定您的应纳税税种。这是购买发票之前的最重要的一个环节 注：需法人、财务一同至税务专管员处进行办理，税务专管员的联系方式通常由代理公司告知'}, {text:'2、办税员培训：办税员为企业日后购买发票、保管发票的重要人员，对发票的遗失等事项负相应责任 备注：培训后七个工作日至相关税务部门取办税员联系卡'}], folded: true},
				{title: '新公司如何购买发票1？', content: [{text: '1、 核定税种：即根据您办理税务登记时提供的资料和实地调查的结果，核定您的应纳税税种。这是购买发票之前的最重要的一个环节 注：需法人、财务一同至税务专管员处进行办理，税务专管员的联系方式通常由代理公司告知'}, {text:'2、办税员培训：办税员为企业日后购买发票、保管发票的重要人员，对发票的遗失等事项负相应责任 备注：培训后七个工作日至相关税务部门取办税员联系卡'}], folded: true},
				{title: '新公司如何购买发票2？', content: [{text: '1、 核定税种：即根据您办理税务登记时提供的资料和实地调查的结果，核定您的应纳税税种。这是购买发票之前的最重要的一个环节 注：需法人、财务一同至税务专管员处进行办理，税务专管员的联系方式通常由代理公司告知'}, {text:'2、办税员培训：办税员为企业日后购买发票、保管发票的重要人员，对发票的遗失等事项负相应责任 备注：培训后七个工作日至相关税务部门取办税员联系卡'}], folded: true},
				{title: '新公司如何购买发票3？', content: [{text: '1、 核定税种：即根据您办理税务登记时提供的资料和实地调查的结果，核定您的应纳税税种。这是购买发票之前的最重要的一个环节 注：需法人、财务一同至税务专管员处进行办理，税务专管员的联系方式通常由代理公司告知'}, {text:'2、办税员培训：办税员为企业日后购买发票、保管发票的重要人员，对发票的遗失等事项负相应责任 备注：培训后七个工作日至相关税务部门取办税员联系卡'}], folded: true},
				{title: '新公司如何购买发票4？', content: [{text: '1、 核定税种：即根据您办理税务登记时提供的资料和实地调查的结果，核定您的应纳税税种。这是购买发票之前的最重要的一个环节 注：需法人、财务一同至税务专管员处进行办理，税务专管员的联系方式通常由代理公司告知'}, {text:'2、办税员培训：办税员为企业日后购买发票、保管发票的重要人员，对发票的遗失等事项负相应责任 备注：培训后七个工作日至相关税务部门取办税员联系卡'}], folded: true},
				{title: '新公司如何购买发票5？', content: [{text: '1、 核定税种：即根据您办理税务登记时提供的资料和实地调查的结果，核定您的应纳税税种。这是购买发票之前的最重要的一个环节 注：需法人、财务一同至税务专管员处进行办理，税务专管员的联系方式通常由代理公司告知'}, {text:'2、办税员培训：办税员为企业日后购买发票、保管发票的重要人员，对发票的遗失等事项负相应责任 备注：培训后七个工作日至相关税务部门取办税员联系卡'}], folded: true},
				{title: '新公司如何购买发票6？', content: [{text: '1、 核定税种：即根据您办理税务登记时提供的资料和实地调查的结果，核定您的应纳税税种。这是购买发票之前的最重要的一个环节 注：需法人、财务一同至税务专管员处进行办理，税务专管员的联系方式通常由代理公司告知'}, {text:'2、办税员培训：办税员为企业日后购买发票、保管发票的重要人员，对发票的遗失等事项负相应责任 备注：培训后七个工作日至相关税务部门取办税员联系卡'}], folded: true},
				{title: '新公司如何购买发票7？', content: [{text: '1、 核定税种：即根据您办理税务登记时提供的资料和实地调查的结果，核定您的应纳税税种。这是购买发票之前的最重要的一个环节 注：需法人、财务一同至税务专管员处进行办理，税务专管员的联系方式通常由代理公司告知'}, {text:'2、办税员培训：办税员为企业日后购买发票、保管发票的重要人员，对发票的遗失等事项负相应责任 备注：培训后七个工作日至相关税务部门取办税员联系卡'}], folded: true},
				{title: '新公司如何购买发票8？', content: [{text: '1、 核定税种：即根据您办理税务登记时提供的资料和实地调查的结果，核定您的应纳税税种。这是购买发票之前的最重要的一个环节 注：需法人、财务一同至税务专管员处进行办理，税务专管员的联系方式通常由代理公司告知'}, {text:'2、办税员培训：办税员为企业日后购买发票、保管发票的重要人员，对发票的遗失等事项负相应责任 备注：培训后七个工作日至相关税务部门取办税员联系卡'}], folded: true},
				{title: '新公司如何购买发票9？', content: [{text: '1、 核定税种：即根据您办理税务登记时提供的资料和实地调查的结果，核定您的应纳税税种。这是购买发票之前的最重要的一个环节 注：需法人、财务一同至税务专管员处进行办理，税务专管员的联系方式通常由代理公司告知'}, {text:'2、办税员培训：办税员为企业日后购买发票、保管发票的重要人员，对发票的遗失等事项负相应责任 备注：培训后七个工作日至相关税务部门取办税员联系卡'}], folded: true},
				{title: '新公司如何购买发票10？', content: [{text: '1、 核定税种：即根据您办理税务登记时提供的资料和实地调查的结果，核定您的应纳税税种。这是购买发票之前的最重要的一个环节 注：需法人、财务一同至税务专管员处进行办理，税务专管员的联系方式通常由代理公司告知'}, {text:'2、办税员培训：办税员为企业日后购买发票、保管发票的重要人员，对发票的遗失等事项负相应责任 备注：培训后七个工作日至相关税务部门取办税员联系卡'}], folded: true},
				{title: '新公司如何购买发票数也是不容易的哎呀怎么还不够数也是不容易的哎呀怎么还不够数也是不容易的哎呀怎么还不够', content: [{text: '1、 核定税种：即根据您办理税务登记时提供的资料和实地调查的结果，核定您的应纳税税种。这是购买发票之前的最重要的一个环节 注：需法人、财务一同至税务专管员处进行办理，税务专管员的联系方式通常由代理公司告知'}, {text:'2、办税员培训：办税员为企业日后购买发票、保管发票的重要人员，对发票的遗失等事项负相应责任 备注：培训后七个工作日至相关税务部门取办税员联系卡'}], folded: true},
			]
		}, 
		methods: {
			toggleExpand: function (index){
				this.list[index].folded = !this.list[index].folded;
			}
		},
	});

	var globalFooterLogin = new vm({
		el: '#footerLogin'
	});

});

}(window.requirejs, window.BMap, window.YCS));