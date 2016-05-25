define(['vue'], function (vm) {
'use strict'; 

	var TopBar = vm.extend({
		name: 'top-bar',
		props: {
			hideBackBtn: {
				type: Boolean,
				default: false
			},
			hideMenu: {
				type: Boolean,
				default: false
			},
			menuOpened: {
				twoWay: true,
				type: Boolean,
				default: false
			}			
		},

		methods: {
			toggleDropdown: function () {
				this.menuOpened = !this.menuOpened;
			},

			goBack: function (cb) {
				if (cb && typeof cb === 'function') {
					cb();
					return;
				} else {
					window.history.go(-1);
				}
			}
		},

		attached: function () {
			var self = this;
			this.$nextTick(function () {
				self.$dispatch('topbar-ready');
			});
		},

		template:
		'<div class="topBar">' +
			'<nav class="main clearfix">' +
				'<a @click="goBack()" v-if="!hideBackBtn" class="btn-back pull-left" href="javascript:void(0);" v-cloak>' +
					'<i class="fa fa-fw fa-angle-left"></i>' +
				'</a>' +
				'<span class="topBar-content">' +
					'<slot></slot>' +
				'</span>' +
				'<a v-if="!hideMenu" @click="toggleDropdown" class="btn-menu pull-right" v-bind:class="{active: menuOpened}" href="javascript:void(0);">' +
					'<i class="fa fa-fw fa-navicon"></i>' +
				'</a>' +
				'<nav v-if="menuOpened" class="dropdown" transition="fade-in" v-cloak>' +
					'<ul>' +
						'<li><a @click="toggleDropdown" href="/app/index.html"><i class="fa fa-fw fa-lg fa-home"></i> 首页</a></li>' +
						'<li><a @click="toggleDropdown" href="/app/user.html"><i class="fa fa-fw fa-lg fa-user"></i> 我的</a></li>' +
					'</ul>' +
				'</nav>' +
			'</nav>' +
		'</div>'
	});

	vm.component('top-bar', TopBar);
});