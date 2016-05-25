(function (requirejs) {
'use strict'; 

requirejs(['vue', 'topBar','backToTop','modal','ajax','dialBox','vueTouch','footerLogin','cityList'], function (vm, topBar,backToTop,modal,Ajax,dialBox,vueTouch,footerLogin,cityList) {

	vm.use(vueTouch);

	var globalTopBar = new vm({el : '#globalTopBar'});

	var fuwuItem = new vm({
		el: '#fuwuItem',
		data: {
			items : [

			],
			folded : true,
			list : [1,2,3],
			count:0,
			servicer:false,
			disabled:false,
			dial : false
		},
		methods : {

			toggleExpand : function(unfold){
				if(unfold !== undefined){
					this.folded = !unfold;
				}
			},
			switchItem:function(){
				this.count +=1;

				this.disabled =false;
				document.getElementById("buyAction").innerHTML = '立即购买';

				if(this.count === this.list.length){
					this.count = 0;
				}

			},
			buyAction:function(ev){
				if(this.servicer === false){
					this.disabled = true;
					ev.target.innerHTML ='本区域暂无服务商报价';
				}
			},
			consult : function(){
				this.modal.show = true;
				this.resetConnect();
			},
			showDialBox : function(mobile){
				this.dial = true;
				this.$broadcast('send-mobile', mobile);
			}
			
		}
	});

});

}(window.requirejs));