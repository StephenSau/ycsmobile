define(['vue'], function (vm) {
'use strict'; 

	var overlayHint = vm.extend({
		name: 'o-hint',
		props: {
			show: {
				type: Boolean,
				twoWay: true,
				default: false
			},
			delay: {
				type: Number,
				default: 1500
			},
			hintText: {
				type: String,
				required: true
			}
		},
		watch: {
			'show': function (toShow) {
				var self = this;

				if (toShow) {
					window.setTimeout(function(){
						self.show = false;
					}, self.delay);
				}
			}
		},

		template: 
		'<div v-show="show" class="overlay-hint" transition="fade-in">' +
			'<span class="hint-body">{{ hintText }}</span>' +
		'</div>'
	});

	vm.component('o-hint', overlayHint);

});