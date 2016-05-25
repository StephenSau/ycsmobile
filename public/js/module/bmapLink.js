define(['vue'], function (vm) {
'use strict'; 

	var YM = window.YCS.BMAP;

	var bMapLink = vm.extend({
	  name: 'BmapLink',
	  props: {
	    address: {
	      type: String,
	      default: '',
	      required: true
	    },
	    corpname: String
	  },
	  data: function () {
	    return {
	      show: {
	        type: Boolean,
	        default: false,
	      },
	      addrError: {
	        type: Boolean,
	        default: false,
	      },
	      targetLink: String,
	      targetCorpName: String    
	    };
	  },
	  methods: {
	    openModal: function (hasError) {
	      if (hasError) {
	        this.addrError = true;
	      }
	      this.show = true;
	    },

	    genLink: function () {
	      // var addrText = this.address;
	      var address = this.address;
	      var self = this;

	      if (!address) { return; }

	      var geoCoder = YM.geoCoder;
	      geoCoder.getPoint(address, function(point){
	        if (point) {
	          var lng = point.lng;
	          var lat = point.lat;

	          window.console.info('查询位置 ' + address + ' 的定位 : ' + lng + ', ' + lat);

	          var corpname = self.corpname || '';
	          var _corpname = corpname + '\t-\t壹财税特约供应商';

	          var title = encodeURIComponent(_corpname);
	          var content = encodeURIComponent('热线电话：4008-310-866\t网址：www.1caishui.com');
	          var src = encodeURIComponent('壹财税|m.1caishui.com');

	          self.targetCorpName = corpname;

	          self.targetLink = 'http://api.map.baidu.com/marker?output=html' + 
	            '&location=' + lat + ',' + lng + 
	            '&coord_type=bd09ll' +
	            '&title=' + title + 
	            '&content=' + content + 
	            '&src=' + src;

	          self.openModal();

	        } else {
	          self.targetCorpName = self.corpname;

	          window.console.warn('您输入的' + self.targetCorpName + '地址`' + address + '`无法获取具体坐标!');

	          self.openModal(true);
	        }
	      // }, '广州市');
	      }, function () {
	        console.warn('addrToCoord: Shall return the current city name ');
	      });
	    }
	  },
	  template: 
	  '<span>' +
	    '<a @click="genLink" href="javascript:void(0);">' +
	      '<slot></slot>' +
	    '</a>' +
	    '<map-modal ' +
	      'v-bind:show.sync="show" ' +
	      'v-bind:link="targetLink" ' +
	      'v-bind:corpname="targetCorpName" ' +
	      'v-bind:has-error="addrError">' +
	    '</map-modal>' +
	  '<span>'
	});

	vm.component('bmap-link', bMapLink);

});