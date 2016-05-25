define(['vue', 'ajax'], function (vm, Ajax) {
'use strict'; 
	function coerceBoolean(val) {
		return typeof val !== 'string' ? val : val === 'true' ? true : val === 'false' ? false : val === 'null' ? false : val === 'undefined' ? false : val;
	}
	var DialBox = vm.extend({
		props: {
			show: {
				require: true,
				type: Boolean,
				coerce: coerceBoolean,
				twoWay: true
			}
		},

		data: function () {
			return {
				tab: {
					input: true,
					query: false,
				},
				reg: /(^1(3[0-9]|4[0-9]|5[0-35-9]|7[0-9]|8[0-9])\d{8}$)|(^(\d{0,4}\-)?\d{8}$)/,
				invalid: true,
				dirty: false,
				title: '请您的手机号码',
				params: {
					masterCallPhoneNo: '',
					slaveCallPhoneNo: '',
				},
				callParams: {}
			};
		},

		ready: function () {
			var that = this;
			this.$watch('show', function(val) {
				if (val === true) {
					that.title = '请输入您的手机号码';
					this.tab.input = true;
					this.tab.query = false;
					this.invalid = false;
					this.dirty = true;
					this.params.masterCallPhoneNo = '';
				}
			});
		},

		template: 
			'<modal style="display:none;" :title="title" :show.sync="show" effect="fade">' +
				'<div slot="modal-body" class="modal-body">' +
					'<p v-if="tab.input" class="mobile-line">' +
						'<input @keyup="checkPhone" class="mobile-text" maxlength="11" type="text" v-model="params.masterCallPhoneNo" />' +
						'<i v-if="invalid && dirty" class="form-error-icon fa fa-exclamation-circle"></i>' +
					'</p>' +
				'</div>' +
				'<div slot="modal-footer" class="modal-footer dial-button-group">' +
					'<button v-if="tab.input" @click="dialPhone">拨打</button>' +
					'<button v-if="tab.query" @click="close">关闭</button>' +
				'</div>' +
			'</modal>',
		events: {
			'send-mobile': function (mobile) {
				this.params.slaveCallPhoneNo = mobile;
			}
		},

		methods: {
			dialPhone: function () {
				var that = this,
					request = null;
				if (!this.invalid) {
					request = new Ajax(this, '/common/requestBinCall4Specialist.htm', this.params);
					request.then(function (res) {
						var data = res.data;
						if (data.status === '200') {
		                    that.callParams = data.re;
		                    that.tab.input = false;
							that.tab.query = true;
							that.title = '正在为您接线中...';
		                    that.queryCallStatus();
		                } else {
		                    that.title =  data.errormsg;
		                }
					});
				}
			},
			checkPhone: function (event) {
				this.dirty = true;
				if (this.reg.test(this.params.masterCallPhoneNo)) {
					this.invalid = false;
				} else {
					this.invalid = true;
				}
			},

			queryCallStatus: function () {
				var that = this,
	                poll = function () {
	                    var request = new Ajax(that, '/common/qryBinCallStatus.htm', that.callParams);
	                    request.then(function (res) {
	                    	var data = res.data;
	                        if (data.status === '200') {
	                            if (data.re.isCallFinish === '0') {
	                                setTimeout(poll, 5000);
	                            } else {
	                                that.show = false;
	                            }
	                        } else {
	                            that.show = false;
	                        }
	                    });
	                };
	            poll();
			},
			close: function () {
				this.show = false;
			}
			
		}
	});

	// register
	vm.component('dial-box', DialBox);

});