define(['vue'], function (vm) {
'use strict';
	// define
	function Modals () {

	}
	var modals = vm.extend({
		data: function () {
			return {
				show: true,
				title: '标题',
				html: '主体'
			};
		},
		ready: function () {
			window.console.log('done');
		},


		template:
			'<div class="modal-backdrop"></div>' + 
			'<div class="modal" @click="close()">' +
    			'<div role="document" class="modal-dialog">' +
      				'<div class="modal-content">' +
        				'<div class="modal-header">' +
          					'<button class="close" type="button"><i class="fa fa-fw fa-remove"></i></button>' +
          					'<h4 class="modal-title">{{title}}</h4>' + 
        				'</div>' +
        				'<div class="modal-body">' +
          					'<p>1</p>' +
          					'<p>1</p>' +
          					'<p>1</p>' +
          					'<p>1</p>' +
          					'<p>1</p>' +
          					'<p>1</p>' +
          					'<p>1</p>' +
          					'<p>1</p>' +
          					'<p>1</p>' +
          					'<p>1</p>' +
          					'<p>1</p>' +
          					'<p>1</p>' +
          					'<p>1</p>' +
          					'<p>1</p>' +
          					'<p>1</p>' +
          					'<p>1</p>' +
          					'<p>1</p>' +
          					'<p>1</p>' +
          					'<p>1</p>' +
          					'<p>1</p>' +
          					'<p>1</p>' +
          					'<p>1</p>' +
        				'</div>' +
        				'<div class="modal-footer">' +
        					'<button type="button">Save changes</button>' +
        				'</div>'+
      				'</div>'+
    			'</div>'+
  			'</div>',

		methods: {
			close: function () {
				var that = this;
				this.show = false;
				
			},
			toTop: function () {
				window.console.log('toTop');
			}
		}
	});

	// register
	vm.component('modals', modals);

	return new Modals();

});