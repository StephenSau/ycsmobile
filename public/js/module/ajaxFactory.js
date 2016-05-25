(function (define) {
	'use strict';
	define(['vue', 'vueResc'], function (vm, vueResc) {
		vm.use(vueResc);
		function Ajax(obj, url, params){
			return obj.$http.post(url, params ? params: '',{
		            headers: {
		                'X-Requested-With': 'XMLHttpRequest'
		            },
		            emulateJSON: true
		        });
		}

		return Ajax;
	});
}(window.define));