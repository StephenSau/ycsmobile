define(['vue'], function (vm) {
  'use strict'; 

  var YM = window.YCS.BMAP;
  var BMap = window.BMap;

  var getDistance = vm.directive('get-distance', {
    params: ['addrText', 'uCoord'],
    paramWatchers: {
      addrText: function (newVal, oldVal) {
        this.updateOutput('--');
        this.addrToCoord(this.params.addrText);
      },
      uCoord: function (newVal, oldVal) {
        this.el.data.uCoord = newVal;
        this.calcDistance(this.el.data.addrCoord, newVal);
      },
    },

    bind: function () {
      YM.init();

      this.el.data = {
        uCoord: this.params.uCoord
      };

      if (this.params.addrText && this.params.addrText.length) {
        this.addrToCoord(this.params.addrText);
      }
    },

    updateOutput: function (result) {
      this.el.innerHTML = result;
    },

    calcDistance: function (toLoc, fromLoc) {
      if (!toLoc) { return; }

      if (!fromLoc) {
        if (!this.el.data.uCoord) {
          return;
        } else {
          fromLoc = this.el.data.uCoord;
        }  
      }

      var fromPoint = new BMap.Point(fromLoc.lng, fromLoc.lat);
      var toPoint = new BMap.Point(toLoc.lng, toLoc.lat);

      var map = YM.theMap;

      var distance = map.getDistance(fromPoint, toPoint);
      var distanceInKm = distance / 1000;

      this.updateOutput(distanceInKm.toFixed(1) + 'km');
    },

    addrToCoord: function (address) {
      var geoCoder = YM.geoCoder;
      var self = this;

      geoCoder.getPoint(address, function(point){
        if (point) {
          self.el.data.addrCoord = {
            lng: point.lng,
            lat: point.lat
          };
          self.calcDistance(self.el.data.addrCoord);
        } else {
          self.el.data.addrCoord = null;
        }
      }, '广州市');
    }
  });

});