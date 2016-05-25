define(['vue', 'iscroll', 'vueTouch'], function (vm, iscroll, vueTouch) {
'use strict'; 
	vm.use(vueTouch);

	vueTouch.registerCustomEvent('press', {
	   type: 'press',
	   time: 100 
	});

	var Lib = window.YCS.LIB;
	var list = Lib.cityList;
	var YM = window.YCS.BMAP;
	var Data = window.YCS.UTIL.Data;
	var Tool = window.YCS.TOOL;

	var cityList = vm.extend({
		name: 'city-list',
		props: {
	    showList: {
	      type: Boolean,
	      twoWay: true,
	      default: false
	    },

	    selectedCity: {
	    	type: Object,
	    	twoWay: true
	    },

	    ipCity: {
	    	type: Object
	    }
		},

		data: function () {
			return {
				list: list,
				skipNotify: false
			}
		},

	  watch: {
	    'showList': function (value) {
	      if (value) {
	        document.body.className += ' city-list-open';
	      	this.showMe();
	      } else {
	        document.body.className = document.body.className.replace(' city-list-open', '');
	      }
	    },

	    'selectedCity': function (selectedCity) {
	    	if (selectedCity && selectedCity.bc && selectedCity.n) {
					YM.saveSelectedCity(selectedCity.bc);

					// 通知其他组件（e.g. footer-login）
					this.notify(selectedCity);
	    	}
	    }
	  },

		methods: {
			select: function (selectedCity) {
				// Method 1: catch 'selected-city' event data
				this.$dispatch('selected-city', selectedCity);

				// Method 2: bind to a two-way `selectedCity` prop data
				this.selectedCity = selectedCity;

				this.hideMe();
			},

			grabIpCity: function () {
				this.ipCity = Data.get('ipCity', 'local');
			},

			hideMe: function () {
  			this.showList = false;
			},

			showMe: function () {
				this.grabIpCity();

				this.$nextTick(function (){
					var scrollSpy = new iscroll('#cityListWrapper', {
						mouseWheel: true,
						momentum: false,
						spy: '#cityListNav'
					});
				});
			},

			handleShow: function () {
				this.showList = true;
			},

			handleNotes: function (evt) {
				if (this.skipNotify) { return; }

				var detail = evt.detail;
				this.selectedCity = detail.data;
			},

			notify: function (data) {
				Tool.emitEvent(document, 'selected-city-updated', data);

				this.skipNotify = true;
				var self = this;
				window.setTimeout(function () {
					self.skipNotify = false;
				}, 500);
			}
		},

		attached: function () {
			Tool.listen(document, 'selected-city-updated', this.handleNotes);
			Tool.listen(document, 'open-citylist', this.handleShow);
		},

		dettached: function () {
			// Must remove listeners in order not to overwhelm the browser memories
			Tool.unlisten(document, 'selected-city-updated', this.handleNotes);
			Tool.unlisten(document, 'open-citylist', this.handleShow);
		},

		template:
		'<div id="cityList" class="cityList" v-show="showList">' +
			'<div class="innerTopBar topBar">' + 
				'<nav class="clearfix">' +
					'<a v-touch:tap="hideMe" class="btn-back pull-left">' +
						'<i class="fa fa-fw fa-angle-left"></i>' +
					'</a>' +
					'<span class="topBar-content">选择城市</span>' +
				'</nav>' +
			'</div>' +
			'<nav id="cityListNav" class="cityListNav">' +
				'<ul>' +
					'<li class="current" v-if="selectedCity.n && selectedCity.n.length">' +
						'<a href="#currentSelected">当前</a>' +
					'</li>' +
					'<li v-for="block in list" v-if="block.cityList.length">' +
						'<a href="#block{{ block.spell }}">{{ block.spell }}</a>' +
					'</li>' +
				'</ul>' +
			'</nav>' +
			'<div id="cityListWrapper">' +
				'<div id="cityListScroller">' +
					'<ul id="cityListContent" class="lv1">' +
						'<li class="current" v-if="selectedCity.n && selectedCity.n.length">' +
							'<h5 class="bookmark" id="currentSelected">当前选择</h5>' +
							'<ul class="lv2"><li>' +
								'<a href="javascript:void(0);" v-touch:tap="hideMe">{{ selectedCity.n }}</a>' +
							'</li></ul>' +
						'</li>' +
						'<li class="gps">' +
							'<h5 class="bookmark" id="currentSelected">GPS定位</h5>' +
							'<ul class="lv2">' +
								'<li class="pending" v-if="!ipCity || !ipCity.n">' +
									'<a href="javascript:void(0);">定位中…</a>' +
								'</li>' +
								'<li class="pending" v-if="ipCity && ipCity.n">' +
									'<a href="javascript:void(0);" v-touch:tap="select(ipCity)">{{ ipCity.n }}</a>' +
								'</li>' +
							'</ul>' +
						'</li>' +
						'<li v-for="block in list" v-if="block.cityList.length">' +
							'<h5 class="bookmark" id="block{{ block.spell }}">{{ block.spell }}</h5>' +
							'<ul class="lv2">' +
								'<li v-for="item in block.cityList">' +	// 如要自动跳到列表项，增加active class, 例如： `:class="{\'active\': item.n === \'广州市\'}"`
									'<a href="javascript:void(0);" v-touch:tap="select(item)">{{ item.n }}</a>' +
								'</li>' +
							'</ul>' +
						'</li>' +
					'</ul>' +
				'</div>' +
			'</div>' +
		'</div>',



	});

	vm.component('city-list', cityList);

});