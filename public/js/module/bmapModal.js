define(['vue'], function (vm) {
'use strict'; 

	var bMapModal = vm.extend({
	  name: 'map-modal',
	  props: {
	    show: {
	      type: Boolean,
	      twoWay: true,
	      default: false
	    },
	    hasError: {
	      type: Boolean,
	      default: true
	    },
	    corpname: {
	      type: String,
	      default: '壹财税特约服务商'
	    },
	    link: {
	      type: String,
	      default: '#'
	    }
	  },
	  watch: {
	    'show': function (value) {
	      if (value) {
	        document.body.className += ' bmap-modal-open';
	      } else {
	        document.body.className = document.body.className.replace(' bmap-modal-open', '');
	      }
	    }
	  },

	  methods: {
	    close: function () {
	      this.show = false;
	    }
	  },

	  template:
	  '<div class="map-modal-overlay" v-show="show">' +
	    '<div class="mask">' +
	      '<div class="popout-body">' +
	        '<h4 class="title text-center">' +
	          '<span v-if="!hasError">您确定要查询 “{{ corpname }}” 的具体定位吗？</span>' +
	          '<span v-if="hasError">哎呀！服务商 “{{ corpname }}” 提供的地址可能有误，无法进行准确定位<br/>T~T</span>' +
	        '</h4>' +
	        '<div class="text-center">' +
	          '<a v-if="!hasError" @click="close" href="{{ link }}" target="_blank" class="open-bd-link btn btn-green btn-block">' +
	            '确定，打开百度地图' +
	            '<i class="fa fa-fw fa-external-link"></i>' +
	          '</a>' +
	          '<button type="button" @click="close" class="btn btn-default btn-block">' + 
	            '<span v-if="!hasError">取消</span>' + 
	            '<span v-if="hasError">我知道了</span>' + 
	          '</button>' +
	        '</div>' +
	      '</div>' +
	    '</div>' +
	  '</div>'
	});

	vm.component('map-modal', bMapModal);

});