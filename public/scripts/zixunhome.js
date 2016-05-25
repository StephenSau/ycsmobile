(function (requirejs, BMap, YCS) {
'use strict'; 

var YM = YCS.BMAP;
var U = YCS.USER;
var Data = YCS.UTIL.Data;

requirejs(['vue', 'topBar', 'ajax', 'iscroll', 'backToTop', 'cityList', 'vueTouch', 'footerLogin'], function (vm, topBar, Ajax, iscroll, backToTop, cityList, vueTouch, footerLogin) {
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

	var newsList = new vm({
		el: '#newsList',
		ready: function () {
			this.cacluteHours();
			this.initScrollBar();
			window.addEventListener('scroll', this.listenScroll);
		},
		data: {
			newsList: [
				{image: 'http://fs.ycs.com/admin/infotxt/201603/39/224bb11623_m.jpg', title: '三证合一是哪三证，合一后怎么办怎么办怎么办', released: '2015-12-16 18:02:12', beforePresent: '2015-12-16', columnnames: '新政'},
				{image: 'http://fs.ycs.com/admin/infotxt/201603/39/224bb11623_m.jpg', title: '今天吃什么呢', released: '2016-04-29 15:02:12', beforePresent: '2016-04-29', columnnames: '新政'},
				{image: '', title: '公司法全文2016开公司必知', released: '2016-04-25 13:12:12', beforePresent: '2016-04-25', columnnames: '新政'},
				{image: '', title: '今天吃什么呢？', released: '2016-04-29 13:12:12', beforePresent: '2016-04-29', columnnames: '民生'},
				{image: 'http://fs.ycs.com/admin/infotxt/201603/39/224bb11623_m.jpg', title: '三证合一是哪三证，合一后怎么办怎么办怎么办', released: '2015-12-16 18:02:12', beforePresent: '2015-12-16', columnnames: '新政'},
				{image: 'http://fs.ycs.com/admin/infotxt/201603/39/224bb11623_m.jpg', title: '今天吃什么呢', released: '2016-04-29 15:02:12', beforePresent: '2016-04-29', columnnames: '新政'},
				{image: '', title: '公司法全文2016开公司必知', released: '2016-04-25 13:12:12', beforePresent: '2016-04-25', columnnames: '新政'},
				{image: '', title: '今天吃什么呢？', released: '2016-04-29 13:12:12', beforePresent: '2016-04-29', columnnames: '民生'},
				{image: 'http://fs.ycs.com/admin/infotxt/201603/39/224bb11623_m.jpg', title: '三证合一是哪三证，合一后怎么办怎么办怎么办', released: '2015-12-16 18:02:12', beforePresent: '2015-12-16', columnnames: '新政'},
				{image: 'http://fs.ycs.com/admin/infotxt/201603/39/224bb11623_m.jpg', title: '今天吃什么呢', released: '2016-04-29 15:02:12', beforePresent: '2016-04-29', columnnames: '新政'},
				{image: '', title: '公司法全文2016开公司必知', released: '2016-04-25 13:12:12', beforePresent: '2016-04-25', columnnames: '新政'},
				{image: '', title: '今天吃什么呢？', released: '2016-04-29 13:12:12', beforePresent: '2016-04-29', columnnames: '民生'},
				{image: 'http://fs.ycs.com/admin/infotxt/201603/39/224bb11623_m.jpg', title: '三证合一是哪三证，合一后怎么办怎么办怎么办', released: '2015-12-16 18:02:12', beforePresent: '2015-12-16', columnnames: '新政'},
				{image: 'http://fs.ycs.com/admin/infotxt/201603/39/224bb11623_m.jpg', title: '今天吃什么呢', released: '2016-04-29 15:02:12', beforePresent: '2016-04-29', columnnames: '新政'},
				{image: '', title: '公司法全文2016开公司必知', released: '2016-04-25 13:12:12', beforePresent: '2016-04-25', columnnames: '新政'},
				{image: '', title: '今天吃什么呢？', released: '2016-04-29 13:12:12', beforePresent: '2016-04-29', columnnames: '民生'},
				{image: 'http://fs.ycs.com/admin/infotxt/201603/39/224bb11623_m.jpg', title: '三证合一是哪三证，合一后怎么办怎么办怎么办', released: '2015-12-16 18:02:12', beforePresent: '2015-12-16', columnnames: '新政'},
				{image: 'http://fs.ycs.com/admin/infotxt/201603/39/224bb11623_m.jpg', title: '今天吃什么呢', released: '2016-04-29 15:02:12', beforePresent: '2016-04-29', columnnames: '新政'},
				{image: '', title: '公司法全文2016开公司必知', released: '2016-04-25 13:12:12', beforePresent: '2016-04-25', columnnames: '新政'},
				{image: '', title: '今天吃什么呢？', released: '2016-04-29 13:12:12', beforePresent: '2016-04-29', columnnames: '民生'},
				{image: 'http://fs.ycs.com/admin/infotxt/201603/39/224bb11623_m.jpg', title: '三证合一是哪三证，合一后怎么办怎么办怎么办', released: '2015-12-16 18:02:12', beforePresent: '2015-12-16', columnnames: '新政'},
				{image: 'http://fs.ycs.com/admin/infotxt/201603/39/224bb11623_m.jpg', title: '今天吃什么呢', released: '2016-04-29 15:02:12', beforePresent: '2016-04-29', columnnames: '新政'},
				{image: '', title: '公司法全文2016开公司必知', released: '2016-04-25 13:12:12', beforePresent: '2016-04-25', columnnames: '新政'},
				{image: '', title: '今天吃什么呢？', released: '2016-04-29 13:12:12', beforePresent: '2016-04-29', columnnames: '民生'},
				{image: 'http://fs.ycs.com/admin/infotxt/201603/39/224bb11623_m.jpg', title: '三证合一是哪三证，合一后怎么办怎么办怎么办', released: '2015-12-16 18:02:12', beforePresent: '2015-12-16', columnnames: '新政'},
				{image: 'http://fs.ycs.com/admin/infotxt/201603/39/224bb11623_m.jpg', title: '今天吃什么呢', released: '2016-04-29 15:02:12', beforePresent: '2016-04-29', columnnames: '新政'},
				{image: '', title: '公司法全文2016开公司必知', released: '2016-04-25 13:12:12', beforePresent: '2016-04-25', columnnames: '新政'},
				{image: '', title: '今天吃什么呢？', released: '2016-04-29 13:12:12', beforePresent: '2016-04-29', columnnames: '民生'},
				{image: 'http://fs.ycs.com/admin/infotxt/201603/39/224bb11623_m.jpg', title: '三证合一是哪三证，合一后怎么办怎么办怎么办', released: '2015-12-16 18:02:12', beforePresent: '2015-12-16', columnnames: '新政'},
				{image: 'http://fs.ycs.com/admin/infotxt/201603/39/224bb11623_m.jpg', title: '今天吃什么呢', released: '2016-04-29 15:02:12', beforePresent: '2016-04-29', columnnames: '新政'},
				{image: '', title: '公司法全文2016开公司必知', released: '2016-04-25 13:12:12', beforePresent: '2016-04-25', columnnames: '新政'},
				{image: '', title: '今天吃什么呢last？', released: '2016-04-29 13:12:12', beforePresent: '2016-04-29', columnnames: '民生'},
			],
			tags: [
				{name: '全部', active: true},
				{name: '壹财税头条', active: false},
				{name: '专家问答', active: false},
				{name: '案例解读', active: false},
				{name: '财税天地', active: false},
				{name: '创业学堂', active: false},
				{name: '壹财税动向', active: false}
			],
			scrollY: Number,
		},
		methods: {
			cacluteHours: function(){
				this.newsList.forEach(function(news){
					news.hours = '';
					news.days = '';
					var eTime = new Date();
					var sTime = new Date(news.released);
					var timeDifferent = eTime.getTime() - sTime.getTime();
					news.days = Math.floor(timeDifferent/(24*3600*1000));
					if(news.days === 0){
						news.hours = timeDifferent%(24*3600*1000);
						news.hours = Math.floor(news.hours/(3600*1000));
					} else{
						delete news.hours;
					}
				});
			},
			initScrollBar: function(){
				var navigation = new iscroll('#navigation', {
					scrollX: true,
					scrollY: false,
					momentum: false
				});
			},
			listenScroll: function(){
				this.scrollY = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
			},
			selectTag: function(target){
				this.tags.forEach(function(tag){
					tag.active = false;

					if (target === tag.name) {
						tag.active = true;
					}
				});
			}
		}
	});

	var globalFooterLogin = new vm({
		el: '#footerLogin'
	});
});

}(window.requirejs, window.BMap, window.YCS));