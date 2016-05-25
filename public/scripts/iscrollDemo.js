(function (requirejs) {
'use strict'; 

requirejs(['vue', 'iscroll'], function (vm, iscroll) {
	var scrollSpy = new iscroll('#wrapper', {
		mouseWheel: true,
		momentum: false,
		spy: '#nav'
	});

	var carousel = new iscroll('#carousel', {
		scrollX: true,
		scrollY: false,
		momentum: false,
		snap: true,
		snapSpeed: 400
	});

	var navigation = new iscroll('#navigation', {
		scrollX: true,
		scrollY: false,
		momentum: false
	});

	var app = new vm({
		el: '#content',
		data: {
			tab: {
				spy: true,
				carousel: false,
				nav: false
			}
		},
		ready: function () {
			
		},
		methods: {
			change: function (target) {
				for (var name in this.tab) {
					if (name === target) {
						this.tab[name] = true;
					} else {
						this.tab[name] = false;
					}
				}
			}
		}
	});
	


document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
});

}(window.requirejs));