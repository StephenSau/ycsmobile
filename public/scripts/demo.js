(function (requirejs, BMap, Y) {
'use strict'; 

var YM = Y.BMAP;
var U = Y.USER;

requirejs(['vue', 'topBar', 'getDistance', 'bmapLink', 'backToTop', 'hint', 'codeBox', 'lazyLoad', 'cityList', 'dialBox', 'footerLogin'], 
	function (vm, topBar, getDistance, bmapLink, backToTop, hint, codeBox, lazyLoad, cityList, dialBox, footerLogin) {

	// Init Global Topbar
	var globalTopBar = new vm({el: '#globalTopBar'});


	// ====================
	// Baidu Map Demo
	// ====================
	
	var bdMapDemo = new vm({
		el: '#bdMapDemo',
		data: function () {
			return {
				// Demo only
			  theMap: undefined,
			  loading: {
			  	posAndAddr: false,
			  	pos: false,
			  	distances: false,
			  	customCoord: false
			  },
			  errMsg: '',
			  consoleMsgs: [],

			  destAddrList: undefined,

			  addresses: [
			    '广州市白云区三元里松柏东街13号A401房',      // 铭瑞企管
			    '广州市南沙区进港大道12号1402房',           // 粤南企管
			    '广州市天河区员村四横路自编8号9楼908',       // 粤企财税
			    '广州市黄埔区大沙地东256号602之自编608A房',  // 佰航财税
			    '广州市天河区中山大道中13号707房',          // 正穗财税
			    '深圳乱输入的假地址',
			    '广州乱输入的假地址',
			    '我不信你能找到我'
			  ],

			  corpNames: [
			    '铭瑞企管',
			    '粤南企管',
			    '粤企财税',
			    '佰航财税',
			    '正穗财税',
			    '深圳钓鱼公司',
			    '广州钓鱼公司',
			    '全国钓鱼企业'
			  ],

			  tempCustomAddr: undefined,

				// Real Data
			  userCoord: undefined,
			  userPos: undefined,
			  userAddr: undefined,
			  userGeoLocation: undefined,
			  customAddr: undefined,
			  customCoord: undefined
			};
		},

		methods: {
	    // Demo only
	    clearErrMsg: function () {
	      this.errMsg = '';
	    },

	    // Demo only
	    throwErr: function (msg) {
	      this.errMsg = msg;
	      window.console.warn(msg);
	    },

	    // Demo only
	    addConsole: function (consoleText) {
	      this.consoleMsgs.push(consoleText);
	    },

	    // Demo only
	    clearCurrentData: function () {
        this.userPos = undefined;
        this.userCoord = undefined;
        this.userGeoLocation = undefined;
        this.userAddr = undefined;
	    },

			// ==============================
	    // 主程序示例区
	    // ==============================

	    // 初始化

	    init: function () {
	      YM.init(this.theMap);
	    },

	    // 仅获取用户定位

	    renderPos: function () {
	    	this.loading.pos = false;
        this.userPos = U.geoPosition;
        this.userCoord = U.geoCoord;

        // Demo Only
        this.addConsole('您的位置：['+ this.userCoord.lng +', ' + this.userCoord.lat + ']');
	    },

	    getUserPos: function () {
	    	this.clearCurrentData(); // Demo Only

	    	this.loading.pos = true;
	    	YM.getUserPos(false, this.renderPos);
	    },

	    // 获取用户定位及地址

	    renderPosAndAddress: function () {
	    	this.loading.posAndAddr = false;

        this.userPos = U.geoPosition;
        this.userCoord = U.geoCoord;
        this.userGeoLocation = U.geoLocation;
        this.userAddr = U.geoAddress;

        // Demo Only
        this.addConsole('您的位置：['+ this.userCoord.lng +', ' + this.userCoord.lat + ']');
        this.addConsole('位于｀' + this.userAddr + '｀附近');
	    },

	    getUserPosAndAddress: function () {
	    	this.clearCurrentData(); // Demo Only

	    	this.loading.posAndAddr = true;
	    	YM.getUserPos(true, this.renderPosAndAddress);
	    },

	    showAddressList: function () {
	    	if (!U.geoCoord) {
		    	this.loading.distances = true;
	    		YM.getUserPos(false, this.showAddressList);
	    		return;
	    	} else if (!this.userCoord) {
	    		this.userCoord = U.geoCoord;
	    	}

	    	this.loading.distances = false;
	    	this.destAddrList = this.addresses;
	    },

	    // 根据用户输入地址重新校正经纬度

	    updateCustomAddress: function () {
	    	this.clearErrMsg();	// Demo Only
	    	this.loading.customCoord = true;	// Demo Only

	    	YM.addrToCoord(this.tempCustomAddr, this.renderCustomAddrAndCoord, 'custom');
	    },

	    renderCustomAddrAndCoord: function (callbackData) {
	    	this.loading.customCoord = false;	// Demo Only

	    	if (callbackData && callbackData === 'hasError') {
	    		this.throwErr('百度地图无法定位该地址');
	    	} else {
		    	this.customAddr = this.tempCustomAddr;
		    	this.customCoord = callbackData || U.customCoord;
	    	}
	    }

		},

		attached: function () {
			this.init();
		}
	});

	// ====================
	// Back To Top Demo
	// ====================

	var backToToDemo = new vm({
		el: '#backToToDemo'
	});

	// ====================
	// Top Bar Demo
	// ====================

	var topBarDemo = new vm({
		el: '#topBarDemo'
	});

	// ====================
	// Overlay Hint Demo
	// ====================

	var overlayHintDemo = new vm({
		el: '#overlayHintDemo',
		data: function () {
			return {
				// Demo Only
				demoHintText: String,

				// Must have
				show: false,

				// Optional
				delayInMs: Number
			};
		},
		methods: {
			showBasicHint: function () {
				this.show = true;
				this.demoHintText = 'SHOW ME';
				this.delayInMs = undefined;
			},

			showDelayedHint: function () {
				this.show = true;
				this.demoHintText = '4秒后消失';
				this.delayInMs = 4000;
			}
		}
	});

	// ====================
	// codeBox Demo
	// ====================

	var codeBoxDemo = new vm({
		el: '#codeBoxDemo',
		data: {
			mobile: '',
			imgCode: false,
			hintShow: false,
			demoHintText: '验证码已发送请注意查收'
		},
		events: {
			'got-code': function (msg) {
				if (msg) {
					this.hintShow = true;
				}
			}
		},
		methods: {
			showCodeBox: function () {
				this.imgCode = true;
				this.$broadcast('send-mobile', this.mobile);
			}
		}
	});

	// ====================
	// Lazy Load Demo
	// ====================

	var lazyLoadDemo = new vm({
		el: '#lazyLoadDemo',
		data: {
			// Demo Only
			imageList: [],

			// Demo Only
			images: [
				'http://fs.1caishui.com/admin/infotxt/201604/101/2688160a8c_l.jpg',
				'http://fs.1caishui.com/admin/infotxt/201604/101/215069b79a_l.jpg',
				'http://fs.1caishui.com/admin/infotxt/201604/101/22e32b5938_l.jpg',
				'http://fs.1caishui.com/admin/infotxt/201604/101/20e79089c4_l.jpg',
				'http://fs.1caishui.com/admin/infotxt/201604/101/2750e85a07_l.jpg',
				'http://fs.1caishui.com/admin/infotxt/201604/101/265f9bb14a_l.jpg',
				'http://fs.1caishui.com/admin/infotxt/201604/101/267346c26b_l.jpg',
				'http://fs.1caishui.com/admin/infotxt/201604/101/21702655e0_l.jpg'
			]
		},
		methods: {
			showImageList: function () {
				this.imageList = this.images;
			}
		}

	});

	// ====================
	// City List Demo
	// ====================

	var cityListDemo = new vm({
		el: '#cityListDemo',
		data: function () {
			return {
				showList: false,
				selectedCityName: '',
				selectedCity: {},
				ipCity: {}
			};
		},
		events: {
			'selected-city': function (eventData) {
				window.console.info('`selected-city` event returns:', eventData);
				this.selectedCityName = eventData.n;
				this.selectedCity = eventData;
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
			
			showCityList: function () {
				this.showList = true;
			}
		},

		ready: function () {
			this.checkExistingData();
		}
	});


	// ====================
	// dialBox Demo
	// ====================

	var dialBoxDemo = new vm({
		el: '#dialBoxDemo',
		data: {
			dial: '',
		},
		methods: {
			showDialBox: function (mobile) {
				this.dial = true;
				this.$broadcast('send-mobile', mobile);
			}
		}
	});

	// ====================
	// Footer Login Demo
	// ====================

	var footerLoginDemo = new vm({
		el: '#footerLoginDemo'

	});	

});

}(window.requirejs, window.BMap, window.YCS));