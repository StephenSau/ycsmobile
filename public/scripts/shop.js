(function (requirejs, BMap, YCS) {
'use strict'; 

var YM = YCS.BMAP;
var U = YCS.USER;
var Data = YCS.UTIL.Data;

requirejs(['vue', 'topBar', 'iscroll', 'bmapLink', 'dialBox', 'vueTouch'], function (vm, topBar, iscroll, bmapLink, dialBox, vueTouch) {
	vm.use(vueTouch);
	
	// Init Global Topbar
	var globalTopBar = new vm({el: '#globalTopBar'});

	var showTabContent = new vm({
		el: '#contentWrapper',
		ready: function (){
			this.initScrollSpy();
			this.divideTag();
		},
		attached: function (){
			this.init();
		},
		data: function (){
			return{
				currentTab:'服务',
				showTab:'',
				dial: '',
				tabs: [
					{text: '服务', isActive: true},
					{text: '专家', isActive: false},
					{text: '介绍', isActive: false}
				],
				services: [
					{title: '工商服务', serviceGroup: [{image: 'http://fs.ycs.com/admin/serviceicon/201601/7/15511477a2.png', title: '大众创业优选A餐', isOne: true, giveCoupon: true}, {image: 'http://fs.ycs.com/admin/serviceicon/201601/7/15511477a2.png', title: '大众创业AA', isOne: false, giveCoupon: true},{image: 'http://fs.ycs.com/admin/serviceicon/201601/7/15511477a2.png', title: '大众创业AA', isOne: false, giveCoupon: true},{image: 'http://fs.ycs.com/admin/serviceicon/201601/7/15511477a2.png', title: '大众创业AA', isOne: false, giveCoupon: true},{image: 'http://fs.ycs.com/admin/serviceicon/201601/7/15511477a2.png', title: '大众创业AA', isOne: false, giveCoupon: true},{image: 'http://fs.ycs.com/admin/serviceicon/201601/7/15511477a2.png', title: '大众创业AA', isOne: false, giveCoupon: true},{image: 'http://fs.ycs.com/admin/serviceicon/201601/7/15511477a2.png', title: '大众创业AA', isOne: false, giveCoupon: true},{image: 'http://fs.ycs.com/admin/serviceicon/201601/7/15511477a2.png', title: '大众创业AA', isOne: false, giveCoupon: true},{image: 'http://fs.ycs.com/admin/serviceicon/201601/7/15511477a2.png', title: '大众创业AA', isOne: false, giveCoupon: true},{image: 'http://fs.ycs.com/admin/serviceicon/201601/7/15511477a2.png', title: '大众创业AA', isOne: false, giveCoupon: true},{image: 'http://fs.ycs.com/admin/serviceicon/201601/7/15511477a2.png', title: '大众创业AA', isOne: false, giveCoupon: true},{image: 'http://fs.ycs.com/admin/serviceicon/201601/7/15511477a2.png', title: '大众创业AA', isOne: false, giveCoupon: true},{image: 'http://fs.ycs.com/admin/serviceicon/201601/7/15511477a2.png', title: '大众创业AA', isOne: false, giveCoupon: true},{image: 'http://fs.ycs.com/admin/serviceicon/201601/7/15511477a2.png', title: '大众创业AA', isOne: false, giveCoupon: true}]},
					{title: '财会服务', serviceGroup: [{image: 'http://fs.ycs.com/admin/serviceicon/201601/7/15511477a2.png', title: '大众创业B', isOne: true, giveCoupon: false}, {image: 'http://fs.ycs.com/admin/serviceicon/201601/7/15511477a2.png', title: '大众创业BB', isOne: true, giveCoupon: false}, {image: 'http://fs.ycs.com/admin/serviceicon/201601/7/15511477a2.png', title: '大众创业BB', isOne: true, giveCoupon: false}, {image: 'http://fs.ycs.com/admin/serviceicon/201601/7/15511477a2.png', title: '大众创业BB', isOne: true, giveCoupon: false}, {image: 'http://fs.ycs.com/admin/serviceicon/201601/7/15511477a2.png', title: '大众创业BB', isOne: true, giveCoupon: false}, {image: 'http://fs.ycs.com/admin/serviceicon/201601/7/15511477a2.png', title: '大众创业BB', isOne: true, giveCoupon: false}, {image: 'http://fs.ycs.com/admin/serviceicon/201601/7/15511477a2.png', title: '大众创业BB', isOne: true, giveCoupon: false}, {image: 'http://fs.ycs.com/admin/serviceicon/201601/7/15511477a2.png', title: '大众创业BB', isOne: true, giveCoupon: false}, {image: 'http://fs.ycs.com/admin/serviceicon/201601/7/15511477a2.png', title: '大众创业BB', isOne: true, giveCoupon: false}, {image: 'http://fs.ycs.com/admin/serviceicon/201601/7/15511477a2.png', title: '大众创业BB', isOne: true, giveCoupon: false}, {image: 'http://fs.ycs.com/admin/serviceicon/201601/7/15511477a2.png', title: '大众创业BB', isOne: true, giveCoupon: false}]},
					{title: '税务服务', serviceGroup: [{image: 'http://fs.ycs.com/admin/serviceicon/201601/7/15511477a2.png', title: '大众创业C', isOne: false, giveCoupon: false},{image: 'http://fs.ycs.com/admin/serviceicon/201601/7/15511477a2.png', title: '大众创业C', isOne: false, giveCoupon: false},{image: 'http://fs.ycs.com/admin/serviceicon/201601/7/15511477a2.png', title: '大众创业C', isOne: false, giveCoupon: false},{image: 'http://fs.ycs.com/admin/serviceicon/201601/7/15511477a2.png', title: '大众创业C', isOne: false, giveCoupon: false},{image: 'http://fs.ycs.com/admin/serviceicon/201601/7/15511477a2.png', title: '大众创业C', isOne: false, giveCoupon: false}]}
				],
				experts: [
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', position:'合伙人&营运总监', years:'12年经验', grade: 2},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', position:'合伙人', years:'12年经验', grade: 1},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', position:'财务总监', years:'13年经验', grade: 0},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', position:'财务总监', years:'13年经验', grade: 0},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', position:'财务总监', years:'13年经验', grade: 0},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', position:'财务总监', years:'13年经验', grade: 0},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', position:'财务总监', years:'13年经验', grade: 0},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', position:'财务总监', years:'13年经验', grade: 0},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', position:'财务总监', years:'13年经验', grade: 0},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', position:'财务总监', years:'13年经验', grade: 0},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', position:'财务总监', years:'13年经验', grade: 0},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', position:'财务总监', years:'13年经验', grade: 0},
					{image: 'http://fs.ycs.com/propepo/201601/39/164d333437.png', name:'刘思宏', position:'财务总监', years:'13年经验', grade: 0}	
				],
				info: {
					image: 'http://fs.1caishui.com/admin/serlogo/201509/77/1808164173.jpg',
					name: '潮道税务',
					score: '4.95',
					jd: '143',
					wc: '128',
					sd: '4.91',
					td: '4.95',
					cd: '4.92',
					specials: [
						{'name': '新', text:'新店入驻，欢迎光临'},
						{'name': '赞', text:'壹财税客户好评服务商'},
						{'name': '营', text:'通过相关营业资质认证'},
						{'name': '实', text:'通过经营场所实地认证'},
						{'name': '专', text:'通过人员从业资格专业认证'}
					],
					nl: '工商,财会,审计,工商财会,财会审计,审计工商,工商财会审计,财会工商审计,审计工商财会',
					nlArray: [],
					intro: '潮道财税是经广州市政府相关部门批准成立、具有专业的才睡能力服务企业。潮道财税驻点广州白云区地潮道财税是经广州市政府相关部门批准成立、具有专业的才睡能力服务企业。潮道财税驻点广州白云区地',
					yw: '工商注册，税务代理，商标代理，许可证代理等',
					yx: '通过对流程精通细化管理、对客户需求的景区把握，兑现“快速服务、高质服务、贴心服务”的三大承诺通过对流程精通细化管理、对客户需求的景区把握，兑现“快速服务、高质服务、贴心服务”的三大承诺',
					address: '广州市白云区云城西路888号1221',
					tel: 87654321,
					isLike: 0
				}
			};
		},
		methods: {
			changeTab: function (currentTab, tabs){
				tabs.forEach(function(tab){
					tab.isActive = false;
				});

				currentTab.isActive = true;
				this.currentTab = currentTab.text;
			},
			divideTag: function(){
				var tempArray = [];
				tempArray = this.info.nl.split(',');
				var target = this.info.nlArray;
				tempArray.forEach(function(tag){
					target.push({
							text: tag
					});
				});
			},
			initScrollSpy: function(){
				var scrollSpy = new iscroll('#wrapper', {
					mouseWheel: true,
					momentum: false,
					spy: '#nav'
				});
			},
			likeOrDislike: function(like){
				if(like === 0){
					this.info.isLike = 1;
				} else{
					this.info.isLike = 0;
				}
			},
			init: function () {
	      YM.init(this.theMap);
	    },
			showDialBox: function (mobile) {
				this.dial = true;
				this.$broadcast('send-mobile', mobile);
			}
		}
	});

});

}(window.requirejs, window.BMap, window.YCS));