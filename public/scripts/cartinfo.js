(function (requirejs) {
'use strict'; 

requirejs(['vue', 'topBar','backToTop','modal'], function (vm, topBar,backToTop,modal) {

	var globalTopBar = new vm({el : '#globalTopBar'});

	var fuwuItem = new vm({
		el: '#cartinfo',
		data: {
			radioTitle : '有限责任公司注册',
			radioTimes : '1次',
			radioShow : false,
			radios : [
				{title:'有限责任公司注册',times :'1次',isActive:true},
				{title:'个人独资注册',times :'1次',isActive:false},
				{title:'合伙企业注册',times :'1次',isActive:false},
				{title:'股份有限公司注册',times :'1次',isActive:false}
			],
			sizeShow : false,
			sizes : [
				{title:'小规模纳税人查账征收代理记账',times :'3月',isActive:true,options:[
						{
							name : '包含内容',
							items : [
								{
									radioItem : '一次付清',
									checked : true

								},
								{
									radioItem : '季付',
									checked : false

								},
								{
									radioItem : '月付',
									checked : false

								}
							]
						},
						{
							name : '代理记账月凭证数量',
							items : [
								{
									radioItem : '月50张以内',
									checked : true

								},
								{
									radioItem : '月51-100张',
									checked : false

								},
								{
									radioItem : '月101-200张',
									checked : false

								}

							]
						}
					]
				},
				{title:'个人独资注册',times :'1次',isActive:false,options:[
						{
							name : '包含内容',
							items : [
								{
									radioItem : '一次付清',
									checked : false

								},
								{
									radioItem : '季付',
									checked : true

								},
								{
									radioItem : '月付',
									checked : false

								}
							]
						},
						{
							name : '代理记账月凭证数量',
							items : [
								{
									radioItem : '月50张以内',
									checked : true

								},
								{
									radioItem : '月51-100张',
									checked : false

								},
								{
									radioItem : '月101-200张',
									checked : false

								}

							]
						}
					]
				},
				{title:'合伙企业注册',times :'1次',isActive:false,options:[
						{
							name : '包含内容',
							items : [
								{
									radioItem : '一次付清',
									checked : true

								},
								{
									radioItem : '季付',
									checked : false

								},
								{
									radioItem : '月付',
									checked : false

								}
							]
						},
						{
							name : '代理记账月凭证数量',
							items : [
								{
									radioItem : '月50张以内',
									checked : true

								},
								{
									radioItem : '月51-100张',
									checked : false

								},
								{
									radioItem : '月101-200张',
									checked : false

								}

							]
						}
					]
				},
				{title:'股份有限公司注册',times :'1次',isActive:false,options:[
						{
							name : '包含内容',
							items : [
								{
									radioItem : '一次付清',
									checked : true

								},
								{
									radioItem : '季付',
									checked : false

								},
								{
									radioItem : '月付',
									checked : false

								}
							]
						},
						{
							name : '代理记账月凭证数量',
							items : [
								{
									radioItem : '月50张以内',
									checked : true

								},
								{
									radioItem : '月51-100张',
									checked : false

								},
								{
									radioItem : '月101-200张',
									checked : false

								}

							]
						}
					]
				}
			],
			sizeTitle : '小规模纳税人查账征收代理记账',
			sizeTimes :'3月',
			payType : '有限责任公司注册',
			specialType : '3月',

			checkboxInfo : [
				{title : '银行开户' ,times : '1次'}
			],
			checkboxShow : false,
			checkboxs : [
				{title:'银行开户',times :'1次',isActive:true},
				{title:'社会保险登记证新办',times :'1次',isActive:false},
				{title:'住房公积金登记证新办',times :'1次',isActive:false}
			]
		},
		methods : {

			checkRadio : function(){
				this.radioShow = true;
			},

			checkRadioItem : function(index){
				this.radios.forEach(function(val){
					val['isActive']= false;
				});

				this.radios[index]['isActive'] = true;
				this.radioTitle = this.radios[index]['title'];
				this.radioTimes = this.radios[index]['times'];

				this.radioShow =false;

			},
			checkSize  :function(){
				this.sizeShow = true;
				this.resetSize();
			},
			resetSize : function(){
				this.sizes.forEach(function(v0,k0){

					if(k0 ===0){

						v0['isActive'] = true;
					}else{
						v0['isActive'] = false;
					}

					v0['options'].forEach(function(v1,k1){
						v1['items'].forEach(function(v2,k2){
							if(k2 === 0){
								v2['checked'] = true;

							}else{
								
								v2['checked'] = false;
							}
						})
					})

				})
			},
			checkSizeItem : function(index){
				this.sizes.forEach(function(val){
					val['isActive']= false;
				});

				this.sizes[index]['isActive'] = true;
				
			},
			confirmSize : function(index){
				var self = this;
				this.sizeTitle = this.sizes[index]['title'];
				this.sizeTimes = this.sizes[index]['times'];

				 this.sizes[index]['options'][0]['items'].forEach(function(val){
					if(val['checked'] === true){
						self.payType = val['radioItem'];
						return;
					}
				});

			  	this.sizes[index]['options'][1]['items'].forEach(function(val){
					if(val['checked'] === true){
						self.specialType = val['radioItem'];
						return;
					}
				});

			  	this.sizeShow= false;

			},
			changeSize : function(k0,k1,k2){
				this.sizes[k0]['options'][k1]['items'].forEach(function(val){
					val['checked'] = false;
				});

				this.sizes[k0]['options'][k1]['items'][k2]['checked'] = true;
			},
			checkCheckbox: function(){
				this.checkboxShow = true;
			},
			checkboxItem : function(index){
				var self = this,
					checkedFlag = false;


				 this.checkboxs.forEach(function(val,k){
				 	if(k !== index && val['isActive'] === true){
					 	checkedFlag = true;
				 	}
				 });


				 if(checkedFlag === true){
				 	this.checkboxs[index]['isActive'] = !this.checkboxs[index]['isActive'];
				 }

			},
			confirmCheckbox : function(){
				var self = this;
				this.checkboxInfo = [];

				this.checkboxShow = false;
				
				this.checkboxs.forEach(function(val){
					if(val['isActive'] === true){
						self.checkboxInfo.push(val);
					}
				});

			}
		}
	});

});

}(window.requirejs));