(function (requirejs) {
'use strict'; 

var YM = YCS.BMAP;
var U = YCS.USER;

requirejs(['vue', 'backToTop', 'modal', 'ajax', 'hint', 'search', 'getDistance'], function (vm, backToTop, modal, Ajax, hint, search, getDistance) {

	var user = new vm({
		el: '#search',
		data: {
			userCoord: undefined,
			hintShow: false,
			hint: 'avd'
		},

		ready: function () {
			
		},

		attached: function () {
			var self = this;
			YM.init();
			window.setTimeout(function () {
				YM.getUserPos(true, self.getUserCoord);
			}, 1000);
		},
		
		methods: {
			getUserCoord: function () {
				this.userCoord = U.geoCoord;
			}
		}
	});
});

}(window.requirejs));