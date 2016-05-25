(function(window, YCS){

'use strict';

function Tool() {
	this._init();
}

Tool.prototype = {
	_init: function () {
		this._setBackpage();
	},
	
	_setBackpage: function () {
		function setBackpage () {
		  	var url = window.location.href;
		  	if (!/(\blogin\b|\bregsiter\b|\bfindPassword\b)/.test(url)) {
		  		localStorage.backpage = JSON.stringify(url);
		  	}
		}
		setBackpage();
		window.addEventListener('hashchange', setBackpage, false);
	},

	/* ************************************
	 * 获取url中传过来的参数 或 hash
	 * seg {String | required} 任意参数名称
	 * 或hash,锚点
	 * *************************************/
	getParams: function (seg) {
		if (window.location.search || window.location.hash) {
            var items = window.location.search.substring(1).split('&'),
                params = {},
                i = 0;
            for (i = 0; i < items.length; i += 1) {
                params[items[i].split('=')[0]] = items[i].split('=')[1];
            }
            if (window.location.hash) {
            	params.hash = window.location.hash.substring(1);
            }
            if (params[seg]) {
                return params[seg];
            } else {
                return '';
            }
        } else {
            return '';
        }
	},

	/* ************************************
	 * 添加侦听
	 * target {Object | required} DOM 的元素
	 * eventType {String | required} 事件名称
	 * callback {Function | required} 句柄 或者说回调
	 * *************************************/

	listen: function (target, eventType, callback) {
		if (target.addEventListener) {
			target.addEventListener(eventType, callback, false);
	      	return {
	        	remove: function remove() {
	          		target.removeEventListener(eventType, callback, false);
	        	}
	      	};
		} else if (target.attachEvent) {
		    target.attachEvent('on' + eventType, callback);
		    return {
		        remove: function remove() {
		        	target.detachEvent('on' + eventType, callback);
		        }
		    };
		}
	},

	/* ************************************
	 * 移除侦听
	 * target {Object | required} DOM 的元素
	 * eventType {String | required} 事件名称
	 * callback {Function | required} 句柄 或者说回调
	 * *************************************/

	unListen: function (target, eventType, callback) {
		if (!target || !eventType) { return; }
		target.removeEventListener(eventType, callback, false);
	},

	/* ************************************
	 * 自定义事件
	 * target {Object | required} DOM 的元素
	 * eventType {String | required} 事件名称
	 * eventData {Object} 事件携带的数据
	 * delay {Number} 延迟发送的事件（单位：ms），主要防止点透
	 * *************************************/

	emitEvent: function (target, eventType, eventData, delay) {
		if (!target || !eventType) { return; }
		
		var newEvent = new CustomEvent(
			eventType,
			{
				detail: {
					data: eventData,
					ts: (new Date()).getTime()
				},
				bubbles: true,
				cancelable: true
			}
		);

		if (delay && delay > 0) {
			window.setTimeout(function () {
				target.dispatchEvent(newEvent);
			}, delay);
		} else {
			target.dispatchEvent(newEvent);
		}
	}
};

YCS.TOOL = new Tool();

})(window, window.YCS);