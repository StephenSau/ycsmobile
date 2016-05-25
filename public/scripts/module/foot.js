define(['vue'], function (vm) {
	'use strict';
	var Foot = vm.extend({
		props: {
			dataRefresh: {
				require: true,
				default: false,
				type: Boolean
			}
		},

		data: function () {
			return {
				onStatic: false
			};
		},

		watch: {
			'dataRefresh': function (flag) {
				this.onStatic = window.document.body.offsetHeight > window.innerHeight - 84;
			}
		},
		
		template: 
			'<p :class="{\'static\': onStatic}">' +
				'<i>©</i>' + 
				'壹财税客服电话：' +
				'<a href="tel:4008-310-866">4008-310-866</a>' +
			'</p>'
	});

	vm.component('foot', Foot);
});