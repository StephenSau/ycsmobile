define(['vue'], function (vm) {
'use strict';
	function listen (target, eventType, callback) {
		if (target.addEventListener) {
			target.addEventListener(eventType, callback, false);
	      	return {
	        	remove: function remove() {
	          		target.removeEventListener(eventType, callback, false);
	        	}
	      	};
		} else if (target.attachEvent) {
		    target.attachEvent('on' + eventType, callback);
		    return {
		        remove: function remove() {
		        	target.detachEvent('on' + eventType, callback);
		        }
		    };
		}
	}

	function coerceBoolean(val) {
		return typeof val !== 'string' ? val : val === 'true' ? true : val === 'false' ? false : val === 'null' ? false : val === 'undefined' ? false : val;
	}

	function isInteger(val) {
		return /^[1-9]\d*$/.test(val);
	}

	function getScrollBarWidth () {
		if (document.documentElement.scrollHeight <= document.documentElement.clientHeight) {
			return 0;
		}
		var inner = document.createElement('p');
		inner.style.width = '100%';
		inner.style.height = '200px';

		var outer = document.createElement('div');
		outer.style.position = 'absolute';
		outer.style.top = '0px';
		outer.style.left = '0px';
		outer.style.visibility = 'hidden';
		outer.style.width = '200px';
		outer.style.height = '150px';
		outer.style.overflow = 'hidden';
		outer.appendChild(inner);

		document.body.appendChild(outer);
		var w1 = inner.offsetWidth;
		outer.style.overflow = 'scroll';
		var w2 = inner.offsetWidth;
		if (w1 === w2) {
			w2 = outer.clientWidth;
		}

		document.body.removeChild(outer);

		return w1 - w2;
	}

	var Modal = vm.extend({
		props: {
			title: {
				type: String,
				default: ''
			},
			show: {
				require: true,
				type: Boolean,
				coerce: coerceBoolean,
				twoWay: true
			},
			animation: {
				type: Boolean,
				default: true
			},
			width: {
				default: null
			},
			backdrop: {
				type: Boolean,
				coerce: coerceBoolean,
				default: true
			},
			needClose: {
                type: Boolean,
                coerce: coerceBoolean,
                default: false
            },
			large: {
				type: Boolean,
				coerce: coerceBoolean,
				default: false
			},
			small: {
				type: Boolean,
				coerce: coerceBoolean,
				default: false
			},
			effect: {
		      	type: String,
		      	default: null
		    },
			callback: {
				type: Function,
				default: function () {}
			}
		},
		template: 	'<div role="dialog" class="modal" v-bind:class="{\'modal\': true, \'fade\': effect===\'fade\', \'zoom\': effect === \'zoom\'}">' +
						'<div v-bind:class="{\'modal-dialog\': true, \'modal-lg\': large, \'modal-sm\': small}" role="document" v-bind:style="{width: optionalWidth}">' +
							'<div class="modal-content">' +
								'<slot name="modal-header">' +
									'<div class="modal-header">' +
										'<button v-if="needClose" type="button" class="close" v-on:click="close"><span>&times;</span></button>' +
										'<h4 class="modal-title">{{title}}</h4>' +
									'</div>' +
								'</slot>' +
								'<slot name="modal-body">' +
									'<div class="modal-body"></div>' +
								'</slot>' +	
								'<slot name="modal-footer">' +
									'<div class="modal-footer">' +
										'<button style="width:50%" type="button" v-on:click="callback">Save changes</button>' +
										'<button style="width:50%" type="button" v-on:click="close">Close</button>' +
									'</div>' +
								'</slot>' +
							'</div>' +
							'<slot name="modal-extend">' +
								'<div class="modal-extend">' +
								'</div>' +
							'</slot>' +
						'</div>'+
					'</div>',
		methods: {
			close: function () {
				this.show = false;
			}
		},
		ready: function () {
			var _this = this;
			this.$watch('show', function (val) {
				var el = _this.$el,
					body = document.body,
					scrollBarWidth = (0, getScrollBarWidth).call();
				if (val) {
					el.querySelector('.modal-content').focus();
					el.style.display = 'block';
					setTimeout(function () {
						return el.classList.add('in');
					}, 0);
					body.classList.add('modal-open');
					if (scrollBarWidth !== 0) {
						body.style.paddingRight = scrollBarWidth = 'px';
					}
					if (_this.backdrop) {
						_this._blurModalContentEvent = listen(_this.$el, 'click', function (e) {
							if (e.target === el) {
								_this.show = false;
							}
						});
					}
				} else {
					if (_this._blurModalContentEvent) {
						_this._blurModalContentEvent.remove();
					}
					body.classList.remove('modal-open');
					el.classList.remove('in');
					setTimeout(function () {
						el.style.display = 'none';
					}, 300);
				}
			}, {immediate: true});
		},
		computed: {
			optionalWidth: function () {
				if (this.width === null) {
					return null;
				} else if ((0, isInteger).call(this.width)) {
					return this.width + 'px';
				}
				return this.width;
			}
		}
	});

	vm.component('modal', Modal);

});