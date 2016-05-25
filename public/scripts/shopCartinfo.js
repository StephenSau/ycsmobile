
(function (requirejs,BMAP,Y) {
'use strict'; 

var YM = Y.BMAP,
    U = Y.USER;

requirejs(['vue', 'topBar','backToTop','modal','getDistance','bmapLink','vueTouch'], function (vm, topBar,backToTop,modal,getDistance,bmapLink,vueTouch) {

    vm.use(vueTouch)
	
	var globalTopBar = new vm({el :'#globalTopBar'});

	var shopCartinfo = new vm({
		el: '#shopCartinfo',
		data: {
			checked : false,
			activated : true,
            datalist : [
                {title : '广州市潮道财税咨询有限公司1',address:'广州市白云区云城西路888号1221房',score : '4.5',quantity : '150',task:'128',response:'4.91',service:'4.95',professional :'4.92',amount : '2000',distance : '500',status:false,coupon:true},
                {title : '广州市潮道财税咨询有限公司2',address:'广州市白云区三元里松柏东街13号A401房',score : '4.5',quantity : '150',task:'128',response:'4.91',service:'4.95',professional :'4.92',amount : '2000',distance : '500',status:false,coupon:false},
                {title : '广州市潮道财税咨询有限公司3',address:'广州市南沙区进港大道12号1402房',score : '4.5',quantity : '150',task:'128',response:'4.91',service:'4.95',professional :'4.92',amount : '2000',distance : '500',status:false,coupon:false},
                {title : '广州市潮道财税咨询有限公司4',address:'广州市黄埔区大沙地东256号602之自编608A房',score : '4.5',quantity : '150',task:'128',response:'4.91',service:'4.95',professional :'4.92',amount : '2000',distance : '500',status:false,coupon:true}

            ],
            couponTips : false,
            checkedName : '广州市潮道财税咨询有限公司1',
            checkedAmount : '2000',
          	checkedIndex : null,
            show : false,
            description : {
                title : '',
                address :'' ,
                score : '',
                quantity:'',
                task:'',
                response : '',
                service:'',
                professional:'',
                checkedText : '选择TA为我服务',
                index : 0

            },
            userCoord: undefined,
            destAddrList: undefined,

		},
        ready : function(){
            this.showAddressList();
            
        },
		methods : {


            showAddressList: function () {
                console.log(1)
                if (!U.geoCoord) {
                    // this.loading.distances = true;
                    YM.getUserPos(false, this.showAddressList);
                    return;
                } else if (!this.userCoord) {
                    this.userCoord = U.geoCoord;
                }

                // this.loading.distances = false;
                this.destAddrList = this.datalist;
            },
            //check the services of list here.marking
			checkServicer : function(currentIndex){

                this.checkedCommon(currentIndex);

           	},
            cancelServicerChecked  :function(){
                this.checked =false;
                this.datalist[this.checkedIndex]['status'] =false;
                this.checkedIndex = null;

            },
            showDescription : function(index){
                var des = this.description,
                    value = this.datalist[index];

                    des['title'] = value['title'];
                    des['address'] = value['address'];
                    des['score'] = value['score'];
                    des['quantity'] = value['quantity'];
                    des['task'] = value['task'];
                    des['response'] = value['response'];
                    des['service'] = value['service'];
                    des['professional'] = value['professional'];

                    des['index'] = index;

                    this.resetChecked();

                    this.show = true;
            },

            checkedDescription : function(){
                var des = this.description ;
                this.checkedCommon(des.index);
                this.show =false;

            },

            checkedCommon : function(currentIndex){
                var self = this,
                    currrentData = this.datalist[currentIndex];

                    this.datalist.forEach(function(value,index){
                        if(index !== currentIndex){
                            value['status'] = false;
                        }
                    });

                    if(currrentData['status'] === true){
                        currrentData['status'] = false;
                        self.checked = false;
                        self.checkedIndex = null;
                        self.description['checkedText'] ='选择TA为我服务';
                    }else{
                        self.checked = true;
                        currrentData['status'] = true;
                        self.checkedIndex = currentIndex;
                        self.checkedName = currrentData['title'];
                        self.checkedAmount = currrentData['amount'];
                        self.couponTips = currrentData['coupon'];
                        self.description['checkedText'] ='取消选择';
                    }
            },
            resetChecked  :function(){
                var des = this.description ;



                if(des.index !==this.checkedIndex){
                    this.description['checkedText'] ='选择TA为我服务';
                }else{
                    this.description['checkedText'] ='取消选择';
                }
            }


		}
	});
	

});

}(window.requirejs,window.BMAP,window.YCS));