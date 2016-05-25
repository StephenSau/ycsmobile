define(['vue', 'ajax', 'hint', 'vueTouch', 'modal'], function (vm, ajax, hint, vueTouch, modal) {
'use strict'; 
	vm.use(vueTouch);

	var YM = window.YCS.BMAP;
	var Tool = window.YCS.TOOL;

	var footerLogin = vm.extend({
		name: 'footer-login',

		data: function () {
			return {
				hasRendered: false,
				isLoggedIn: false,
				username: '',
				selectedCityName: '定位中…',
				showHint: false,
				footerHintText: '',
				showConfirmModal: false
			};
		},

		methods: {
			checkSelectedCity: function () {
				var existingSelectedCity = YM.checkExisting('selectedCity', 'local');
				if (existingSelectedCity && existingSelectedCity.n) {
					this.selectedCityName = existingSelectedCity.n;
				}
			},

			checkIfLoggedIn: function () {
				var self = this;
				var reqs = new ajax(this, '/user/qryUserInfos.htm')
						.then( function (res) {
							var data = res.data;
							if (data.status === '200' && data.re && data.re.isLogin === '1') {
								self.isLoggedIn = true;
								self.username = data.re.username;
							} else {
								self.isLoggedIn = false;
								self.username = '';
							}

							self.hasRendered = true;
						});
			},

			logMeOut: function () {
				var self = this;
				var reqs = new ajax(this, '/user/loginout.htm')
						.then( function (res) {
							var data = res.data;
							if (data.status === '200') {
								self.isLoggedIn = false;
								self.username = '';
								self.showHint = true;
								self.footerHintText = '您已退出登录';
							} else {
								// placeholder
							}
							self.toggleConfirmModal(false);
						});
			},

			toggleConfirmModal: function (toShow) {
				this.showConfirmModal = toShow ? true : false;
			},

			handleNotes: function (evt) {
				var detail = evt.detail;
				this.selectedCityName = detail.data.n;
			},

			openCityList: function (e) {
				e.preventDefault();
				Tool.emitEvent(document, 'open-citylist', {}, 300);
			}
		},

		ready: function () {
			this.checkIfLoggedIn();
			this.checkSelectedCity();
		},

		attached: function () {
			Tool.listen(document, 'selected-city-updated', this.handleNotes);
		},

		dettached: function () {
			// Must remove listeners in order not to overwhelm the browser memories
			Tool.unlisten(document, 'selected-city-updated', this.handleNotes);
		},

		template:
		'<div class="footer-with-login" v-cloak>' +
			'<div class="left">' +
				'<div class="loading" v-if="!hasRendered">' +
					'<i class="fa fa-fw fa-spin fa-spinner"></i>' +
				'</div>' +
				'<div v-if="hasRendered && !isLoggedIn" class="is-guest" v-cloak>' +
					'<a class="btn btn-blue btn-login" href="/app/login.html">登录</a>' +
					'<a class="btn btn-default btn-register" href="/app/register.html">注册</a>' +
				'</div>' +
				'<div v-if="hasRendered && isLoggedIn" class="logged-in" v-cloak>' +
					'<span class="username" v-text="username"></span>' +
					'<a class="logout-link" @click.stop="toggleConfirmModal(true)" href="javascript:void(0)">退出</a>' +
				'</div>' +
			'</div>' +
			'<div class="right">' +
				'<button class="btn btn-default btn-city" v-touch:tap.stop="openCityList">' +
					'<span class="inner">' +
						'<span class="city-name">城市：{{ selectedCityName }}</span>' +
						'<i class="fa fa-fw fa-angle-down"></i>' +
					'</span>' +
				'</button>' +
			'</div>' +
			'<modal title="您确定要退出登录么？" :show.sync="showConfirmModal" effect="fade" v-cloak>' +
				'<div slot="modal-body"></div>' +
				'<div slot="modal-footer" class="modal-footer">' +
					'<a v-touch:tap="logMeOut" href="javascript:void(0)">确定退出</a>' + 
					'<a v-touch:tap="toggleConfirmModal(false)" href="javascript:void(0)">取消</a>' + 
				'</div>' +
			'</modal>' +
			'<o-hint v-bind:show.sync="showHint" v-bind:hint-text="footerHintText"></o-hint>' +
		'</div>'
	});

	vm.component('footer-login', footerLogin);
});