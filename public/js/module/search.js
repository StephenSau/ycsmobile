define(['vue'], function (vm) {
	'use strict';
	var Search = vm.extend({
		props: {
			value: {
				require: true,
				type: String
			},
			tab: {
				coerce: function (val) {
					if (/^(\bservice\b|\bservicer\b|\bexpert\b|\bnews\b)$/.test(val)) {
						return val;
					}
					switch (val) {
						case '服务':
							return 'service';
						case '服务商':
							return 'servicer';
						case '专家':
							return 'expert';
						case '资讯':
							return 'news';
						default:
							return 'service';
					} 
				},
				type: String,
				default: 'service'
			}
		},
		data: function () {
			return {
				tabName: '服务',
				show: false,
				placeholder: '服务名称或类型',
				msg: {
					service: '服务名称或类型',
					servicer: '服务商名称或擅长领域',
					expert: '专家名称或擅长领域',
					news: '资讯关键词或标签',
				},
				tabNames: {
					service: '服务',
					servicer: '服务商',
					expert: '专家',
					news: '资讯',
				}
			};
		},
		ready: function () {
			this.placeholder = this.msg[this.tab];
			this.tabName = this.tabNames[this.tab];
		},
		template: 
			'<div class="search-box" v-cloak>' +
				'<form action="/article/tag.htm" method="get">' +
					'<p class="search-form">' +
						'<span :class="{\'search-class\': true, \'active\': show}" @click="changeList">{{tabName}}<i class="fa fa-fw fa-angle-down"></i></span>' +
						'<label for="search-text"><i class="fa fa-fw fa-search"></i></label>' +
						'<input v-model="value" :placeholder="placeholder" class="search-text" id="search-text" type="search" name="querycondition" />' +
					'</p>' +
					'<button class="search-reset" type="reset">取消</button>' +
				'</form>' +
				'<ul v-show="show" class="search-class-list" transition="fade-in">' +
					'<li @click="changeTab(\'service\')" :class="{\'active\': tab === \'service\'}"><i class="icon icon-service"><img src="../public/img/search-icon.png" /></i>服务</li>' +
					'<li @click="changeTab(\'servicer\')" :class="{\'active\': tab === \'servicer\'}"><i class="icon icon-servicer"><img src="../public/img/search-icon.png" /></i>服务商</li>' +
					'<li @click="changeTab(\'expert\')" :class="{\'active\': tab === \'expert\'}"><i class="icon icon-expert"><img src="../public/img/search-icon.png" /></i>专家</li>' +
					'<li @click="changeTab(\'news\')" :class="{\'active\': tab === \'news\'}"><i class="icon icon-info"><img src="../public/img/search-icon.png" /></i>资讯</li>' +
				'</ul>' +
			'</div>',
		methods: {
			changeList: function () {
				this.show = !this.show;
			},
			changeTab: function (name) {
				this.tab = name;
				this.placeholder = this.msg[name];
				this.tabName = this.tabNames[name];
				this.show = false;
			}
		}
	});

	vm.component('search', Search);
});