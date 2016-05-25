(function (requirejs) {
'use strict'; 

requirejs(['vue', 'topBar', 'backToTop', 'modal', 'ajax', 'hint'], function (vm, topBar, backToTop, modal, Ajax, hint) {

	

	var globalTopBar = new vm({
		el: '#globalTopBar'
	});

	var app = new vm({
		el: '#cashier',
		data: {
			hintShow: false,
			hint: ''
		},

		ready: function () {
			
		},
		
		methods: {
			
		}
	});
});

}(window.requirejs));