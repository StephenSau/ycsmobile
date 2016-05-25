define(['vue', 'ajax'], function (vm, Ajax) {
'use strict'; 
	function coerceBoolean(val) {
		return typeof val !== 'string' ? val : val === 'true' ? true : val === 'false' ? false : val === 'null' ? false : val === 'undefined' ? false : val;
	}
	// define
	var CodeBox = vm.extend({
		props: {
			show: {
				require: true,
				type: Boolean,
				coerce: coerceBoolean,
				twoWay: true
			},
			url: {
				type: String,
				default: '/common/sendValidateCode.htm'
			}
		},

		data: function () {
			return {
				title: '请输入图形验证码',
				time: new Date().getTime(),
				params: {
					phoneNo: '',
					code: ''
				}
			};
		},

		ready: function () {
			var that = this;
			this.$watch('show', function(val) {
				if (val === true) {
					that.title = '请输入图形验证码';
					that.time = new Date().getTime();
				}
			});
		},

		template: 
			'<modal style="display:none;" :title="title" :show.sync="show" effect="fade">' +
				'<div slot="modal-body" class="modal-body">' +
					'<p class="code-line">' +
						'<input class="code-text" maxlength="4" type="text" v-model="params.code" />' +
						'<span class="code-img">' +
							'<img @click="change" :src="\'/vc.htm?time=\' + time" />' +
							'<a class="btn" @click="change" href="javascript:void(0)">换一换</a>' + 
						'</span>' +
					'</p>' +
				'</div>' +
				'<div slot="modal-footer" class="modal-footer">' +
					'<button @click="getCode">确定</button>' +
				'</div>' +
			'</modal>',
		events: {
			'send-mobile': function (mobile) {
				this.params.phoneNo = mobile;
			}
		},
		methods: {
			change: function () {
				this.time = new Date().getTime();
			},
			getCode: function () {
				var that = this,
					params = function () {
						var temp  = {};
						if (that.url === '/common/sendValidateCode.htm') {
							temp.phoneNo = that.params.phoneNo;
							temp.validateCodeImg = that.params.code;
						} else if (that.url === '/user/sendAuthCode4Login.htm') {
							temp.phoneNo = that.params.phoneNo;
							temp.authCodeImg = that.params.code;
						} else if (that.url === '/common/sendValidateCode4ValidateID8MobileNo.htm') {
							temp.validateCodeImg = that.params.code;
						}
						return temp;
					},
					request = null;
				if (this.params.code === '') {
					this.title = '图形验证码不能为空';
				}
				request = new Ajax(this, this.url, params());
				request.then(function (response) {
					var data = response.data;
					if (data.status === '200') {
						that.params.phoneNo = '';
						that.params.code = '';
						that.$dispatch('got-code', true);
						that.show = false;
					} else {
						that.title = data.errormsg;
					}
				});
			}
		}
	});

	// register
	vm.component('code-box', CodeBox);

});