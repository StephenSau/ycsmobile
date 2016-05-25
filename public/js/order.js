(function (requirejs) {
'use strict'; 

requirejs(['vue', 'topBar', 'backToTop', 'modal', 'ajax', 'hint', 'foot'], function (vm, topBar, backToTop, modal, Ajax, hint, foot) {

	var globalTopBar = new vm({el: '#globalTopBar'});

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
			

			_getParams: function (seg) {
                if (window.location.search) {
                    var items = window.location.search.substring(1).split('&'),
                        params = {},
                        i = 0;
                    for (i = 0; i < items.length; i += 1) {
                        params[items[i].split('=')[0]] = items[i].split('=')[1];
                    }
                    if (params[seg]) {
                        return params[seg];
                    } else {
                        return '';
                    }
                } else {
                    return '';
                }
            },
		}
	});
});

}(window.requirejs));