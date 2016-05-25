(function (requirejs) {
'use strict'; 

requirejs(['vue', 'topBar'], function (vm, topBar) {
	
	// Init Global Topbar
	var globalTopBar = new vm({el: '#globalTopBar'});

});

}(window.requirejs));