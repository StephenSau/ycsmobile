(function (requirejs) {
'use strict'; 

requirejs(['vue', 'topBar', 'backToTop', 'modal', 'ajax', 'vueValid', 'codeBox', 'hint', 'foot'], function (vm, topBar, backToTop, modal, Ajax, vueValid, codeBox, hint, foot) {
	// Init Global Topbar
	vm.use(vueValid);
	var globalTopBar = new vm({el: '#globalTopBar'});

	var footer = new vm({
		el: '#footer',
		data: {
			refreshFlag: false
		}
	});

	var register = new vm({
		el: '#register',
		validators: {
			mobile: {
				message: '请输入正确的手机号码',
				check: function (val) {
					return /^1(3[0-9]|4[0-9]|5[0-35-9]|7[0-9]|8[0-9])\d{8}$/.test(val);
				}
			},
			account: {
				message: '请输入4-20位字母、数字或“-”、“_”字符',
				check: function (val) {
					return /^[A-Za-z0-9\-\_]{4,20}$/.test(val);
				}
			},
			password: {
				message: '请输入6-20位非空格字符',
				check: function (val) {
					return /^\S{6,20}$/.test(val);
				}
			}
		},
		data: {
			hintShow: false,
			hint: '',
			refreshFlag: false,
			step: {
				one: true,
				two: false,
				three: false
			},
			modals: {
				imgCode: false
			},
			forms: {
				one: {
					warn: false,
					warnHtml: '',
					name: 'one',
					url: '',
					method: 'POST',
					fields: {
						mobile: {
							id: 'mobile',
							name: 'mobile',
							label: '手机号码',
							type: 'text',
							maxlength: 11,
							invalid: false,
							value: '',
							placeholder: '请输入手机号码',
							validate: {
								required: {
									rule: true,
									message: '请输入手机号码'
								},
								mobile: ''
							}
						}, 
						agree: {
							id: 'agree',
							name: 'agree',
							label: '我已阅读并同意<a href="#">《壹财税用户协议》</a>',
							type: 'checkbox',
							value: '',
							checked: true,
							validate: {
								required: {
									rule: true,
									message: '你是否同意《壹财税用户协议》'
								}
							}
						}
					}
				},
				two: {
					warn: false,
					warnHtml: '',
					name: 'two',
					url: '',
					method: 'POST',
					fields: {
						code: {
							id: 'code',
							name: 'code',
							label: '验证码',
							type: 'text',
							maxlength: 4,
							value: '',
							placeholder: '请输入手机短信中的验证码',
							validate: {
								required: {
									rule: true,
									message: '请输入手机短信中的验证码'
								},
								minlength: 4
							}
						}
					},
				},
				three: {
					warn: false,
					warnHtml: '请输入符合规则的用户名和密码',
					name: 'three',
					url: '',
					method: 'POST',
					fields: {
						username: {
							id: 'username',
							name: 'username',
							label: '用户名',
							type: 'text',
							maxlength: 20,
							value: '',
							placeholder: '请输入用户名',
							validate: {
								required: {
									rule: true,
									message: '请输入用户名'
								},
								account: ''
							}
						}, 
						password: {
							id: 'password',
							name: 'password',
							label: '密码',
							type: 'password',
							changeType: true,
							maxlength: 20,
							value: '',
							placeholder: '请输入密码',
							validate: {
								required: {
									rule: true,
									message: '请输入密码'
								},
								password: ''
							}
						}
					}
				}
			}
		},
		events: {
			'got-code': function (msg) {
				if (msg === true) {
					for (var item in this.step) {
						if (item === 'two') {
							this.step[item] = true;
						} else {
							this.step[item] = false;
						}
					}
					this.hint = '验证码已发送，请注意查收';
					this.hintShow = true;
				}
			}
		},
		methods: {
			showCodeBox: function () {
				this.$broadcast('send-mobile', this.forms.one.fields.mobile.value);
				this.modals.imgCode = true;
			},
			changeType: function (field) {
				if (field.type === 'text') {
					field.type = 'password';
				} else {
					field.type = 'text';
				}
			}
		}
	});
});

}(window.requirejs));