(function (requirejs) {
'use strict'; 

requirejs(['vue', 'topBar','backToTop','ajax','lazyLoad','cityList','vueTouch','footerLogin'], function (vm, topBar,backToTop,Ajax,lazyLoad,cityList,vueTouch,footerLogin) {

	vm.use(vueTouch);

	var globalTopBar = new vm({
		el : '#globalTopBar',
		data : function(){
			return {
				openCityList: false,
				selectedCityName: '',
				selectedCity: {}
			}
		},
		events: {
			'selected-city': function (eventData) {
				window.console.info('`selected-city` event returns:', eventData);
				this.selectedCityName = eventData.n;
				this.selectedCity = eventData;
			}
		},
		methods:{

			showCityList : function(){
				this.openCityList = true;
			}
		}
	});

	var allsorts = new vm({
		el: '#allsorts',
		data: {
			items : [
				{title : '大众创业优先A餐',description:'约有66家服务商可供挑选'},
				{title : '大众创业优先A餐',description:'约有66家服务商可供挑选'},
				{title : '大众创业优先A餐',description:'约有66家服务商可供挑选'},
				{title : '大众创业优先A餐',description:'约有66家服务商可供挑选'},
				{title : '大众创业优先A餐',description:'约有66家服务商可供挑选'},
				{title : '大众创业优先A餐',description:'约有66家服务商可供挑选'},
				{title : '大众创业优先A餐',description:'约有66家服务商可供挑选'},
				{title : '大众创业优先A餐',description:'约有66家服务商可供挑选'},
				{title : '大众创业优先A餐',description:'约有66家服务商可供挑选'}
			],
			isActive : false,
			maskHeight : 0,

			menu : {
				menuTitle : '全部服务分类',
				menuDefault : {
					isActive  :true,
					name : '全部服务分类',
					id : '00'
				},
				menulist : [
					{name : '工商服务',isActive:false,id:'01'},
					{name : '财会服务',isActive:false,id:'02'},
					{name : '税务服务',isActive:false,id:'03'},
					{name : '行政许可',isActive:false,id:'04'},
					{name : '商标专利',isActive:false,id:'05'},
					{name : '人事服务',isActive:false,id:'06'},
					{name : '社保公积金',isActive:false,id:'07'}
				],
			}
		},
		ready : function(){
			this.getServiceHeight();
		},
		methods: {
			toggleExpand: function (toUnfold){
				if (toUnfold !== undefined){
					this.folded = !toUnfold;
				} else {
					this.folded = !this.folded;
				}
			},
			submenu : function(){
				this.isActive = ! this.isActive;
			},
			getServiceHeight : function(){
				var h = document.getElementsByClassName("service-list")[0].offsetHeight;
					this.maskHeight = h;
			},
			checkMenu: function(){
				var element = event.target,
					elementName =element.tagName,
					menu = this.menu,
					index = 0,
					request =null,
					params = {},
					self = this;

				this.toggleMenu();

				if(elementName ==='DT'){
					menu.menuDefault['isActive']= true;
					menu.menuTitle = menu.menuDefault['name'];

					params = {
						id : menu.menuDefault['id']
					}
				}else if (elementName === 'DD'){
					index = element.getAttribute("data-index");

					menu.menuDefault['isActive']= false;

					menu.menulist[index]['isActive'] =true;
					menu.menuTitle = menu.menulist[index]['name'];	
					params = {
						id : menu.menulist[index]['id']
					}
				}

				request = new Ajax(this,'/service/qryAllServiceGoods.htm',params);

				request.then(function(response){
					var data = response.data;

					if(data.status === 200){
						self.menuClose();
					}

				},function(){

				});
			},

			toggleMenu : function(){
				var menu = this.menu;
					menu.menulist.forEach(function(val){
						val['isActive'] = false;
					});
			},
			menuClose : function(){
				this.isActive = false;
			}
			
		}
	});

});

}(window.requirejs));