(function (requirejs, YCS) {
'use strict'; 

requirejs(['vue', 'topBar', 'backToTop', 'modal', 'codeBox', 'ajax', 'vueValid', 'hint', 'foot'], 
    function (vm, topBar, backToTop, modal, codeBox, Ajax, vueValid, hint, foot) {

	vm.use(vueValid);

	var globalTopBar = new vm({
		el: '#globalTopBar', 
		data: {
			title: '',
			tname: {
				username: '修改用户名',
				setPassword: '设置密码',
				modifyPassword: '修改密码',
				findPassword: '找回密码',
				contactor: '联系人信息'
			}
		},
		ready: function () {
			this.title = this.tname[YCS.TOOL.getParams('tab')];
		}
	});

	var footer = new vm({
		el: '#footer',
		data: {
			refreshFlag: false
		}
	});



	var app = new vm({
		el: '#info',
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
			codeUrl: '/common/sendValidateCode4ValidateID8MobileNo.htm',
			modals: {
				imgCode: false,
				login: false,
			},
			tab: {
				username: true,
				contactor: false,
				mobile: false,
				setPassword: false,
				modifyPassword: false,
				findPassword: false
			},
			userInfo: {
				username: '',
				updateflag: '0',
				mobile: '',
				isLogin: false,
			},
			contactor: {
				list: [],
				title: '确认删除联系人吗？',
				show: false,
				edit: true
			},
			forms: {
				username: {
					warn: false,
					warnHtml: '',
					name: 'usernameForm',
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
							placeholder: '请输入新的用户名',
							validate: {
								required: {
									rule: true,
									message: '请输入新的用户名'
								},
								account: ''
							}
						}
					}
				},
				contactorForm: {
					warn: false,
					warnHtml: '',
					name: 'contactorForm',
					url: '',
					method: 'POST',
					fields: {
						cname: {
							id: 'canme',
							name: 'cname',
							label: '联系人姓名',
							type: 'text',
							maxlength: 20,
							invalid: false,
							value: '',
							placeholder: '请输入联系人姓名',
							validate: {
								required: {
									rule: true,
									message: '请输入联系人姓名',
								}
							}
						},
						cmobile: {
							id: 'cmobile',
							name: 'cmobile',
							onCount: false,
							onCountFalg: null,
							count: 60,
							label: '联系人手机号码',
							type: 'text',
							maxlength: 11,
							invalid: false,
							value: '',
							placeholder: '请输入联系人手机号码',
							validate: {
								required: {
									rule: true,
									message: '请输入联系人手机号码'
								},
								mobile: ''
							}
						}, 
						carea: {
							id: 'carea',
							name: 'carea',
							label: '联系人所在区域',
							type: 'hidden',
							invalid: false,
							value: '',
							validate: {
								required: {
									rule: true,
									message: '请选择联系人所在区域',
								}
							}
						}
					}
				},
				mobile: {
					warn: false,
					warnHtml: '',
					name: 'mobileForm',
					show: true,
					url: '',
					method: 'POST',
					fields: {
						code: {	
							id: 'code',
							name: 'code',
							onCount: false,
							onCountFalg: null,
							count: 60,
							label: '验证码',
							type: 'text',
							maxlength: 4,
							invalid: false,
							value: '',
							placeholder: '请输入手机短信中的验证码',
							validate: {
								required: {
									rule: true,
									message: '请输入请输入手机短信中的验证码'
								},
								minlength: 4
							}
						}
					}
				},
				newMobile: {
					warn: false,
					warnHtml: '',
					name: 'newMobileForm',
					show: false,
					url: '',
					method: 'POST',
					fields: {
						accesskey: {
							id: 'accesskey',
							name: 'accesskey',
							type: 'hidden',
							value: ''
						},
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
							placeholder: '请输入要绑定的新手机号',
							validate: {
								required: {
									rule: true,
									message: '请输入要绑定的新手机号'
								},
								mobile: ''
							}
						},
						code: {	
							id: 'ncode',
							name: 'code',
							label: '验证码',
							type: 'text',
							maxlength: 4,
							invalid: false,
							value: '',
							placeholder: '请输入请输入新手机短信中的验证码',
							validate: {
								required: {
									rule: true,
									message: '请输入请输入新手机短信中的验证码'
								},
								minlength: 4
							}
						}
					}
				},
				setPassword: {
					warn: false,
					warnHtml: '',
					name: 'setPasswordForm',
					url: '',
					method: 'POST',
					fields: {
						password: {	
							id: 'password',
							name: 'password',
							label: '密码',
							type: 'password',
							maxlength: 20,
							value: '',
							placeholder: '请输入登录密码',
							validate: {
								required: {
									rule: true,
									message: '请输入登录密码'
								}
							}
						}
					}
				}, 
				checkPassword: {
					warn: false,
					warnHtml: '',
					name: 'checkPassword',
					show: true,
					url: '',
					method: 'POST',
					fields: {
						password: {	
							id: 'cpassword',
							name: 'password',
							label: '密码',
							type: 'password',
							maxlength: 20,
							value: '',
							placeholder: '请输入现在登录密码',
							validate: {
								required: {
									rule: true,
									message: '请输入现在登录密码'
								}
							}
						}
					}
				},
				modifyPassword: {
					warn: false,
					warnHtml: '',
					name: 'modifyPassword',
					show: false,
					url: '',
					method: 'POST',
					fields: {
						accesskey: {
							id: 'accesskey',
							name: 'accesskey',
							type: 'hidden',
							value: ''
						},
						password: {	
							id: 'mpassword',
							name: 'password',
							label: '密码',
							type: 'password',
							maxlength: 20,
							value: '',
							placeholder: '请输入新登录密码',
							validate: {
								required: {
									rule: true,
									message: '请输入新登录密码'
								},
								password: ''
							}
						}
					}
				},
				checkId: {
					warn: false,
					warnHtml: '',
					name: 'checkId',
					show: true,
					url: '',
					method: 'POST',
					fields: {
						code:{	
							id: 'code',
							name: 'code',
							onCount: false,
							onCountFalg: null,
							count: 60,
							label: '验证码',
							type: 'text',
							maxlength: 4,
							value: '',
							placeholder: '请输入手机短信中的验证码',
							validate: {
								required: {
									rule: true,
									message: '请输入请输入手机短信中的验证码'
								},
								minlength: 4
							}
						}
					}
				},
				findPassword: {
					warn: false,
					warnHtml: '',
					name: 'findPassword',
					show: false,
					url: '',
					method: 'POST',
					fields: {
						password: {	
							id: 'password',
							name: 'password',
							label: '密码',
							type: 'password',
							maxlength: 20,
							value: '',
							placeholder: '请输入新的登录密码',
							validate: {
								required: {
									rule: true,
									message: '请输入新的登录密码'
								},
								password: ''
							}
						}
					}
				}
			}
		},

		ready: function () {
			var that = this;
			this._changeTab();
			this._getUserInfo();
		},

		methods: {
			_changeTab: function () {
				var tab = YCS.TOOL.getParams('tab') || YCS.TOOL.getParams('hash');
				for (var name in this.tab) {
					if (name === tab) {
						this.tab[name] = true;
					} else {
						this.tab[name] = false;
					}
				}
			},
			
			_getUserInfo: function () {
				var that = this,
					request = new Ajax(this, '/user/qryUserInfos.htm');
				request.then(function (response) {
					var data = response.data;
					if (data.status === '200') {
						if (data.re.isLogin === '1') {
							that.userInfo.username = data.re.username;
							that.userInfo.updateflag = data.re.updateflag;
							that.userInfo.mobile = data.re.mobile;
						} else if (data.re.isLogin === '0' && !that.tab.findPassword) {
							setTimeout(function () {
								that.modals.login = true;
							}, 500);
						}
					} else {
						that._hintShow(data.errormsg);
					}
				});
			},

			_hintShow: function (msg) {
				this.hint = msg;
				this.hintShow = true;
			},

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

			showDelModal: function () {
				this.contactor.show = true;
			},

			hideDelModal: function () {
				this.contactor.show = false;
			},

			hideLoginModal: function () {
				this.modals.login=false;
			},


    		showCodeBox: function (field, needPhone) {
    			if (needPhone) {
    				this.$broadcast('send-mobile', this.forms.newMobile.fields.mobile.value);
    			}
    			this.modals.imgCode = true;
    			this._countDown(field);
    		},

    		usernameUpdate: function () {
    			var that = this,
    				params = {
    					username: this.forms.username.fields.username.value
    				},
    				require = new Ajax(this, '/user/updateNewUserNameOnce.htm', params);
    			require.then(function (response) {
    				var data = response.data;
    				if (data.status === '200') {
    					window.location.href = '/app/user.html?msg=用户名修改成功#info';
    				} else {
    					that._hintShow(data.errormsg);
    				}
    			});
    		},

    		getAccesskey: function (target) {
    			var that = this,
    				form = this.forms[target],
    				params = {
    					validatecode: form.fields.code.value
    				},
    				url = target === 'mobile' ?  '/common/checkValidateID8MobileNo.htm' : '/common/checkValidateID.htm',
    				require = new Ajax(this, url, params);
    			require.then(function (response) {
    				var data = response.data;
    				if (data.status === '200') {
    					if (target === 'mobile') {
    						that.codeUrl = '/common/sendValidateCode.htm';
	    					that.forms.newMobile.fields.accesskey.value = data.re.accesskey;
	    					that.forms.mobile.show = false;
	    					that.forms.newMobile.show = true;
    					} else if (target === 'findPassword') {
    						that.forms.findPassword.fields.accesskey.value = data.re.accesskey;
	    					that.forms.checkId.show = false;
	    					that.forms.findPassword.show = true;
    					}
    				} else {
    					that._hintShow(data.errormsg);
    				}
    			});
    		},

    		rebindMobile: function () {
    			var that = this,
    				fields = this.forms.newMobile.fields,
    				params = {
    					accesskey: fields.accesskey.value,
    					validatecode: fields.code.value
    				},
    				require = new Ajax(this, '/user/rebindUserMobile.htm', params);
    			require.then(function (response) {
    				var data = response.data;
    				if (data.status === '200') {
    					window.location.href = '/app/user.html?msg=手机改绑成功#info';
    				} else {
    					that._hintShow(data.errormsg);
    				}
    			});
    		},

    		updatePassword: function (target) {
    			var that = this,
    				form = this.forms[target],
    				url = '',
    				params = {},
    				require = null;
    			if (target === 'findPassword') {
    				url = '/pwdBack/updateNewUserPassword.htm';
    				params = {
    					accesskey: form.fields.accesskey.value,
    					newpassword: form.fields.password.value,
    					confirmpassword: form.fields.password.value
    				};
    			}
    			require = new Ajax(this, url, params);
    			require.then(function (response) {
    				var data = response.data;
    				if (data.status === '200') {
    					window.location.href = '/app/user.html?msg=密码修改成功#info';
    				} else {
    					that._hintShow(data.errormsg);
    				}
    			});
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

}(window.requirejs, window.YCS));