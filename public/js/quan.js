(function (requirejs, YCS) {
'use strict'; 

requirejs(['vue', 'topBar', 'backToTop', 'modal', 'ajax', 'hint', 'foot'], function (vm, topBar, backToTop, modal, Ajax, hint, foot) {

	function coerceBoolean(val) {
		return typeof val !== 'string' ? val : val === 'true' ? true : val === 'false' ? false : val === 'null' ? false : val === 'undefined' ? false : val;
	}

    var footer = new vm({
		el: '#footer',
		data: {
			refreshFlag: false
		}
	});

	var globalTopBar = new vm({
		el: '#globalTopBar',
		data: {
			title: '我的卡券'
		},
		ready: function () {
			if (YCS.TOOL.getParams('tab') && YCS.TOOL.getParams('tab') === 'disabled') {
				this.title = '卡券使用历史';
			}
		}
	});

	var main = new vm({
		el: '#quan',
		data: {
			exchange: {
				show: false
			},
			hasActivedCoupon: false,
			hasDisabledCoupon: false,
			coupons: {},
			exchangeCode: '',
			hintShow: false,
			hint: '',
			tab: {
				efficient: true,
				disabled: false
			}
		},

		ready: function () {
			var that = this;
			this._changeTab(YCS.TOOL.getParams('hash') || YCS.TOOL.getParams('tab'));
			YCS.TOOL.listen(window, 'hashchange', function () {
				that._changeTab(YCS.TOOL.getParams('hash') || YCS.TOOL.getParams('tab'));
			});
			this._queryMyCouponList();

		},

		events: {
			'exchange-data': function (data) {
				this.coupons.exchange = data;
			}
		},

		
		methods: {
			_hintShow: function (msg) {
				this.hint = msg;
				this.hintShow = true;
			},

			_changeTab: function (target) {
				for (var name in this.tab) {
					if (name === target) {
						this.tab[name] = true;
					} else {
						this.tab[name] = false;
					}
				}
				globalTopBar.title = target === 'efficient' ? '我的卡券' : '卡券使用历史';
				window.scrollTo(0, 0);
				footer.refreshFlag = !footer.refreshFlag;
			},

			_queryMyCouponList: function () {
                var that = this,
                    request = new Ajax(this, '/user/qryMyCouponList.htm');
                request.then(function (res) {
                	var data = res.data;
                    if (data.status === '200') {
                    	that.coupons = data.re;
                    	if (data.re.servicer.length || data.re.area.length) {
                    		that.hasActivedCoupon = true;
                    		footer.refreshFlag = !footer.refreshFlag;
                    	}
                    	if (data.re.invali.length || data.re.used.length) {
                    		that.hasDisabledCoupon = true;
                    	}
                    } else {
                    	that._hintShow(data.errormsg);
                    }
                    
                });
            },

			showExchange: function () {
				this.exchange.show = true;
			}
		},
		//components start
		components: {
			'exchange-box': {
				template: 
					'<modal :title="title" :show.sync="show" effect="fade" v-cloak>' +
						'<div slot="modal-body" class="modal-body">' +
							'<p class="exchange-code-line">' +
								'<input @keyup="checkCode" type="text" v-model="params.activateCode" placeholder="优惠卡券兑换码" maxlength="15" class="exchange-code" />' +
								'<i v-if="invalid && dirty" class="form-error-icon fa fa-exclamation-circle"></i>' +
							'</p>' +
						'</div>' +
						'<div slot="modal-footer" class="modal-footer col-2">' +
							'<button @click="exchangeQuan">兑换</button>' +
							'<button @click="closeExchange">取消</button>' +
						'</div>' +
					'</modal>',
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
						title: '请输入优惠卡券的兑换码',
						code: '',
						params: {
							activateCode: ''
						},
						invalid: true,
						dirty: false,
					};
				},
				watch: {
					show: function (val) {
						if (val = true) {
							this.params.activateCode = '';
							this.invalid = false;
							this.dirty = true;
							this.title = '请输入优惠卡券的兑换码';
						}
					}
				},
				methods: {
					closeExchange: function () {
						this.show = false;
					},

					checkCode: function (event) {
						this.dirty = true;
						if (/^[A-Za-z0-9\-]{15}$/.test(this.params.activateCode)) {
							this.invalid = false;
						} else {
							this.invalid = true;
						}
					},

					exchangeQuan: function () {
						var that = this,
							request = null;
						if (this.invalid) {
							this.title = '请输入长度为15位的兑换码';
							return;
						}
						request = new Ajax(this, '/user/activeMyCouponCard.htm', this.params);
						request.then(function (response) {
							var data = response.data;
							if (data.status === '200') {
								that.$dispatch('exchange-data', data.re.list);
								footer.refreshFlag = !footer.refreshFlag;
		                    } else {
		                        that.title = data.errormsg;
		                        that.invalid = true;
		                    }
						});
					}
				}
			}
		}
		//components end
	});
});

}(window.requirejs, window.YCS));