(function (requirejs) {
'use strict'; 

requirejs(['vue', 'topBar', 'backToTop', 'modal', 'ajax', 'hint', 'foot'], function (vm, topBar, backToTop, modal, Ajax, hint, foot) {

	var globalTopBar = new vm({el: '#globalTopBar'});

	var footer = new vm({
		el: '#footer',
		data: {
			refreshFlag: false
		}
	});

	var user = new vm({
		el: '#order',
		
		data: {
			hintShow: false,
			hint: '',
			refreshFlag: false
		},

		ready: function () {
			
		},
		
		methods: {
			
		}
	});
});

}(window.requirejs));