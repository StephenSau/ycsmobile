(function (requirejs, YCS) {
'use strict'; 

requirejs(['vue', 'topBar', 'backToTop', 'modal', 'ajax', 'hint', 'foot'], function (vm, topBar, backToTop, modal, Ajax, hint, foot) {

	var globalTopBar = new vm({el: '#globalTopBar'});
	var footer = new vm({
		el: '#footer',
		data: {
			refreshFlag: false
		}
	});

	var user = new vm({
		el: '#user',
		data: {
			hintShow: false,
			hint: '',
			modals: {
				login: false
			},			
			tab: {
				orderlist: false,
				quan: true,
				info: false
			},
			userInfo: {
				username: '',
				updateflag: '0',
				mobile: '',
				modifyflag: '1'
			}
		},

		ready: function () {
			var that = this,
				tab = YCS.TOOL.getParams('hash') || 'orderlist',
				msg = decodeURI(YCS.TOOL.getParams('msg')),
				omsg = localStorage.getItem('msg'),
				hashListener = null;
			if (msg && msg !== omsg) {
				localStorage.setItem('msg', msg);
				this.hint = msg;
				this.hintShow = true;
			}

			hashListener = YCS.TOOL.listen(window, 'hashchange', function () {
				that.changeTab(YCS.TOOL.getParams('hash') || 'orderlist');
			});
			
			this.changeTab(tab);
			this._getUserInfo();
		},
		
		methods: {
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
						} else {
							setTimeout(function () {
								that.modals.login = true;
							}, 500);
						}
					} else {
						that.hint = data.errormsg;
						that.hintShow = true;
					}
				});
			},

			hideLoginModal: function () {
				this.modals.login = false;
			},

			changeTab: function (target) {
				for (var name in this.tab) {
					if (name === target) {
						this.tab[name] = true;
					} else {
						this.tab[name] = false;
					}
				}
				footer.refreshFlag = !footer.refreshFlag;
			},

			logout: function () {
				var that = this,
					request = new Ajax(this, '/user/loginout.htm');
				request.then(function (response) {
					var data = response.data;
					if (data.status === '200') {
						window.location.href = '/';
					}
				}); 
			},

			dail: function () {
				console.log('dail done');
			},

			linkto: function () {
				console.log('linkto done');
			}
		}
	});
});

}(window.requirejs, window.YCS));