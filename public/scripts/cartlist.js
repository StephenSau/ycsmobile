(function (requirejs) {
'use strict'; 

requirejs(['vue', 'topBar','backToTop','modal', 'ajax', 'vueValid', 'codeBox','hint','vueTouch'], function (vm, topBar,backToTop,modal,Ajax,vueValid,codeBox,hint,vueTouch) {

	vm.use(vueValid);
	vm.use(vueTouch);

	var globalTopBar = new vm({el : '#globalTopBar'});


	var cartlist = new vm({
		el: '#cartlist',
		validators : {
			mobile : {
				message : '请输入正确的手机号码',
				check : function(val){
					return /^1(3[0-9]|4[0-9]|5[0-35-9]|7[0-9]|8[0-9])\d{8}$/.test(val);

				}
			},
			numeric : {
				message : '请输入正确的数字',
				check : function(val){
					return /^[0-9]+$/.test(val);
				}
			}
		},
		data: {
			modals : {
				imgCode: false
			},
			forms : {
				mobileForm :{
					fields :{
						mobile : 
						{

							id : 'mobile',
							name : 'mobile',
							type : 'telphone',
							label : '手机号码',
							count : 60,
							onCount : false,
							onCountFalg : null,
							maxlength : 11,
							value : '',
							hasButton : true,
							placeholder : '请输入手机',
							autocomplete : 'on',
							validate: {
								required: {
									rule: true,
									message: '请输入手机号码'
								},
								mobile: ''
							}
						},
						code :
						{
							id: 'code',
							name: 'code',
							label: '验证码',
							type: 'telphone',
							maxlength: 6,
							value: '',
							placeholder: '请输入手机短信中的验证码',
							autocomplete : 'off',
							validate: {
								required: {
									rule: true,
									message: '请输入手机短信中的验证码'
								},
								minlength: 6
							}
						}
					}
				}

			},
			totalPrice : 1800,
			modalShow : false,
			phoneTipShow : false,
			radioPickedIndex : 0,
			radioPicked : '大众创业优选A餐一口价',
			reducePrice : 512,
			radios : [
				{title : '大众创业优选A餐一口价',amount : '512',isActive : true},
				{title : '公司注册直减512',amount : '1012',isActive : false},
				{title : '代理记账5折',amount : '512',isActive : false},
			],
			hint : '',
			hintShow : false,
			warnHtml : '',
			isLogin : false,
			username : undefined,
			flag  : false


		},
		ready : function(){
			this._getUserInfo();
		},
		events: {
			'got-code': function (msg) {
				if (msg === true) {
					this.hint = '验证码已发送，请注意查收';
					this.hintShow = true;
				}
			}
		},
		methods : {
			_getUserInfo : function(){
				var self = this;
				new Ajax(this,'/user/qryUserInfos.htm')
					.then(function(response){
						var data = response.data;
						// console.log(data);

						if(data.status ==='200'){
							if(data.re.isLogin === '1'){

								self.isLogin = true;
								self.username = data.re.username;
							}else{

								self.isLogin = false;
								self.username = undefined;
							}
						}else{

						}

					});
			},
			_logout : function(){
				var self = this;

				new Ajax(this,'/user/loginout.htm')
					.then(function(response){
						var data =response.data;
						if(data.status === '200'){
							self.isLogin = false;
							self.username = undefined;
						}else{

						}
					})
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
			showCodeBox: function (field) {
				if (/^1(3[0-9]|4[0-9]|5[0-35-9]|7[0-9]|8[0-9])\d{8}$/.test(field.value)) {
					this.$broadcast('send-mobile', field.value);
					this.modals.imgCode = true;
					this._countDown(field);
				}else{
					this.warnTips('请输入正确的11位手机号码');
				}
			},
			warnTips : function(text){
				this.modalShow = true;
				this.warnHtml = text,
				this.phoneTipShow = true;
			},
			couponShow : function(){
				this.modalShow = true;
				this.phoneTipShow = false;
			},
			checkRadioItem : function(index){
				this.radios.forEach(function(val){
					val['isActive'] =false;
				});
				this.radioPickedIndex = index;
				this.radios[index]['isActive']= true;

			},
			confirmRadio : function(){
				this.modalShow = false;
				this.radioPicked = this.radios[this.radioPickedIndex]['title'];
				this.reducePrice = this.radios[this.radioPickedIndex]['amount'];
			},	
			confirmClose : function(){
				this.modalShow = false;
			},
			loginByMobile: function () {

				var form = this.forms.mobileForm,
					self = this,
					fields = form.fields,
					params = {
						phoneNo: fields['mobile'].value,
	                    authCode: fields['code'].value
					},
					request = new Ajax(this, '/user/loginByPhone.htm', params);
				request.then(function (response) {

					var data = response.data;
					if (data.status === '200') {
						window.location.href = '/';
					} else {
						// form.warnHtml = data.errormsg;
						// form.warn = true;
						if(data.errorcode === '2048'){

							self.warnTips('手机验证码错误，请重新输入');
						}else if(data.errorcode==='3048'){
							self.warnTips('手机验证码已过期，请重新获取');
						}
					}
				});
			}
		},

		computed : {
			getAmount : function(){
				return this.totalPrice - this.reducePrice;
			}
		}
	});


});

}(window.requirejs));