(function (requirejs, YCS) {
'use strict'; 

requirejs(['vue', 'topBar', 'modal', 'ajax', 'vueValid', 'codeBox', 'dialBox', 'hint', 'foot'], function (vm, topBar, modal, Ajax, vueValid, codeBox, dialBox, hint, foot) {
	// Init Global Topbar
	vm.use(vueValid);

	var globalTopBar = new vm({el: '#globalTopBar'});

	var footer = new vm({
		el: '#footer',
		data: {
			refreshFlag: false
		}
	});

	var login = new vm({
		el: '#login',
		validators: {
			mobile: {
				message: '请输入正确的手机号码',
				check: function (val) {
					return /^1(3[0-9]|4[0-9]|5[0-35-9]|7[0-9]|8[0-9])\d{8}$/.test(val);
				}
			}
		},
		data: {
			show: true,
			hintShow: false,
			hint: '',
			tab: {
				user: true,
				mobile: false
			},
			refreshFlag: false,
			modals: {
				imgCode: false,
				dial: false,
			},
			forms: {
				userForm: {
					warn: false,
					warnHtml: '',
					name: 'user',
					url: '',
					method: 'POST',
					fields: {
						username: {
							id: 'username',
							name: 'username',
							label: '用户名',
							type: 'text',
							maxlength: 20,
							invalid: false,
							value: '',
							placeholder: '请输入用户名',
							validate: {
								required: {
									rule: true,
									message: '请输入用户名'
								}
							}
						}, 
						password: {
							id: 'upassword',
							name: 'upassword',
							label: '密码',
							type: 'password',
							maxlength: 20,
							invalid: false,
							value: '',
							placeholder: '请输入您的密码',
							validate: {
								required: {
									rule: true,
									message: '请输入您的密码'
								}
							}
						}
					}
				},
				
				mobileForm: {
					warn: false,
					warnHtml: '',
					name: 'mobileForm',
					url: '',
					method: 'POST',
					fields: {
						mobile: {
							id: 'mobile',
							name: 'mobile',
							onCount: false,
							onCountFalg: null,
							count: 60,
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
								mobile: '',
							}
						}, 
						code: {
							id: 'code',
							name: 'code',
							label: '验证码',
							type: 'text',
							maxlength: 4,
							invalid: false,
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
					}
				}
			}
		},

		events: {
			'got-code': function (msg) {
				if (msg === true) {
					this.hint = '验证码已发送，请注意查收';
					this.hintShow = true;
				}
			}
		},
		
		methods: {
			_countDown: function (field) {
				field.onCount = true;
				field.count = 60;
				var count = function () {
					field.count -= 1;
					if (field.count === 0) {
						clearTimeout(field.onCountFalg);
						field.onCount = false;
					} else {
						field.onCountFalg = setTimeout(function () {
							count();
						}, 1000);
					}
				};
				count();
			},
			showCodeBox: function (field) {
				if (/^1(3[0-9]|4[0-9]|5[0-35-9]|7[0-9]|8[0-9])\d{8}$/.test(field.value)) {
					this.$broadcast('send-mobile', field.value);
					this.modals.imgCode = true;
					this._countDown(field);
				}
			},

			showDialBox: function (mobile) {
				this.$broadcast('send-mobile', mobile);
				this.modals.dial = true;
			},

			changeTab: function (target) {
				for (var name in this.tab) {
					if (name === target) {
						this.tab[name] = true;
					} else {
						this.tab[name] = false;
					}
				}
			},
			loginByUsername: function () {
				var form = this.forms.userForm,
					fields = form.fields,
					params = {
						username: fields.username.value,
	                    password: fields.password.value
					},
					request = new Ajax(this, '/user/login.htm', params);
				fields.username.invalid = false;
				fields.password.invalid = false;
				request.then(function (response) {
					var data = response.data;
					if (data.status === '200') {
						window.location.href = YCS.UTIL.Data.get('backpage', 'local');
					} else {
						if (data.errorcode === '3001') {
							fields.username.invalid = true;
							form.warnHtml = '账号不存在，请重新输入，或者尝试手机验证登录';
						} else if (data.errorcode === '3119') {
							fields.username.invalid = true;
							fields.password.invalid = true;
							form.warnHtml = '账号或密码错误，要 <a href="/app/info.html?tab=findPassword&title=找回秘密">找回密码</a> 吗？';
						} else if (data.errorcode === '3020') {
							if (!fields[0].value) {
								form.warnHtml = '请输入用户名';
								fields.username.invalid = true;
							} else if (!fields[1].vlaue) {
								form.warnHtml = '请输入密码';
								fields.password.invalid = true;
							}
						}
						form.warn = true;
					}
				});
			},
			loginByMobile: function () {
				var form = this.forms.mobileForm,
					fields = form.fields,
					params = {
						phoneNo: fields.mobile.value,
	                    authCode: fields.code.value
					},
					request = new Ajax(this, '/user/loginByPhone.htm', params);
				request.then(function (response) {
					var data = response.data;
					if (data.status === '200') {
						//TODO: 登录后返回那个页面，要全局考虑
						window.location.href = '/';
					} else {
						form.warnHtml = data.errormsg;
						form.warn = true;
					}
				});
			}
		}
	});
});

}(window.requirejs, window.YCS));