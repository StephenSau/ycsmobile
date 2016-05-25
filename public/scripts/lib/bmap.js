(function(window, BMap, YCS){

'use strict';

var U = YCS.USER;

var BMAP = {

  CONFIG: {
    // in MS. Shall mark info as `expired` afterwards
    expires: 3600000  // 1hr
  },
  
  // Note PW @ 160426 | Unresolved BUG:
  // When using YCS.MAP.init(target, true) or YCS.MAP.init(target, true, true)
  // and put browser in the background,
  // There're chances to get a `b.apply is not a function` error from the Baidu JS

  init: function initYcsBMap (target, needUserPos, needDecodedAddress, cb) {
    if (!BMap) {
      window.setTimeout(function(){
        YCS.BMAP.init(target, needUserPos, needDecodedAddress);
      }, 500);
      return;
    }

    // Map already rendered
    if (YCS.BMAP.theMap && YCS.BMAP.theMap instanceof Object) {
      if (target) {
        target = YCS.BMAP.theMap;
      }
      return;
    }

    var mapElm = document.getElementById('ycsMap');
    if (!mapElm || !(mapElm instanceof HTMLElement)) {
      mapElm = document.createElement('script');
      mapElm.setAttribute('id', 'ycsMap');
      mapElm.setAttribute('ycs-map-init', '1');
      var docHead = document.getElementsByTagName('head')[0];
          docHead.appendChild(mapElm);
    }
    
    // Init Map
    YCS.BMAP.theMap = new BMap.Map();
    target = YCS.BMAP.theMap;

    // Init Geocoder
    YCS.BMAP.geoCoder = new BMap.Geocoder();

    // Init GeoLocation
    YCS.BMAP.geoLoc = new BMap.Geolocation();

    // Init LocalCity
    YCS.BMAP.localCity = new BMap.LocalCity();

    // If we need to get user's current Geolocation info right after init
    if (needUserPos || needDecodedAddress) {
      YCS.BMAP.getUserPos(needDecodedAddress, cb);
      return;
    }

    if (cb && typeof cb === 'function') {
      cb();
    }
  },

  // Request for User's current postion
  getUserPos: function getUserCurrentPosition (needDecodedAddress, cb, skipIpCityCode, forceUpdate) {
    var existingGeoPos = this.checkExisting('geoPosition');
    var existingGeoCoord = this.checkExisting('geoCoord');

    // Exists and not forced to update
    if (!forceUpdate && existingGeoPos && existingGeoCoord) {

      YCS.BMAP.store('geoPosition', existingGeoPos, true);
      YCS.BMAP.store('geoCoord', existingGeoCoord, true);

      var existingIpCity = this.checkExisting('ipCity');
      if (!skipIpCityCode && !existingIpCity) {
        YCS.BMAP.getUserCityCode();
      }

      if (needDecodedAddress) {
        YCS.BMAP.coordToAddr(existingGeoCoord, 'geo', cb);
        return;
      }

      if (cb && typeof cb === 'function') {
        cb(existingGeoPos);
      }

    // Nil or forced update
    } else {

      if (!skipIpCityCode) {
        YCS.BMAP.getUserCityCode();
      }

      var geoLocation = YCS.BMAP.geoLoc;
      geoLocation.getCurrentPosition(function(res){
        if(this.getStatus() === window.BMAP_STATUS_SUCCESS){
          var geoCoord = {
            lng: res.point.lng,
            lat: res.point.lat
          };

          YCS.BMAP.store('geoPosition', res);
          YCS.BMAP.store('geoCoord', geoCoord);

          if (needDecodedAddress) {
            YCS.BMAP.coordToAddr(geoCoord, 'geo', cb);
            return;
          }

          if (cb && typeof cb === 'function') {
            cb(res);
          }

        } else {
          YCS.BMAP.throwErr('Baidu Map Failed: ' + this.getStatus());
        }
      },{enableHighAccuracy: true});
    }
  },

  // Polyfill for incorrect `city_code` returned from `geoLocation`
  getUserCityCode: function getUserCurrentCityCode (cb) {
    YCS.BMAP.localCity.get(function(res){
      YCS.BMAP.store('ipCityInfo', res);
      YCS.BMAP.store('ipCityCode', res.code);

      YCS.BMAP.saveSelectedCity(res.code, cb, 'ip');
    });
  },

  // Translate coordinates to address

  coordToAddr: function coordinatesToAddress (coord, saveAs, cb) {
    var point = new BMap.Point(coord.lng, coord.lat);
    var geoCoder = YCS.BMAP.geoCoder;

    geoCoder.getLocation(point, function (res) {
      YCS.BMAP.store('geoLocation', res);

      if (saveAs === 'custom') {
        YCS.BMAP.saveCustomAddr(res.address);
      } else if (saveAs === 'geo') {
        YCS.BMAP.saveGeoAddr(res.address);
      }

      if (cb && typeof cb === 'function') {
        cb(res);
      }
    });
  },

  saveCustomAddr: function saveAsUserCustomAddress (addressInPlainText) {
    YCS.BMAP.store('customAddress', addressInPlainText);
  },

  saveGeoAddr: function saveAsGeoAddress(addressInPlainText) {
    YCS.BMAP.store('geoAddress', addressInPlainText);
  },

  // Translate address to coordinates

  addrToCoord: function addressToCoordinates (address, cb, saveAs) {
    var geoCoder = YCS.BMAP.geoCoder;

    geoCoder.getPoint(address, function(point){
      if (point) {
        var coordObject = {lng: point.lng, lat: point.lat};
        if (saveAs === 'custom') {
          YCS.BMAP.saveCustomCoord(coordObject);
          YCS.BMAP.saveCustomAddr(address);
        } else if (saveAs === 'geo') {
          YCS.BMAP.saveGeoCoord(coordObject);
          YCS.BMAP.saveGeoAddr(address);
        }
        
        if (cb && typeof cb === 'function') {
          cb(coordObject);
        }

      } else {
        YCS.BMAP.throwErr('百度地图无法定位该地址：`' + address + '`');
        
        if (cb && typeof cb === 'function') {
          cb('hasError');
        }
      }
    }, '广州市');
  },

  saveCustomCoord: function saveAsUserCustomCoord (coordObject) {
    YCS.BMAP.store('customCoord', coordObject);
  },

  saveGeoCoord: function saveAsUserCustomCoord (coordObject) {
    YCS.BMAP.store('geoCoord', coordObject);
  },

  saveSelectedCity: function saveSelectedCity (cityCode, cb, saveAs) {
    var selectedCity = {};
    if (cityCode && cityCode > 0) {
      selectedCity = YCS.LIB.bdCityCode[cityCode];

      if (saveAs && saveAs === 'ip') {
        YCS.BMAP.store('ipCity', selectedCity);
        YCS.BMAP.store('ipCityCode', cityCode);

      } else {
        YCS.BMAP.store('selectedCity', selectedCity);
        YCS.BMAP.store('selectedCityCode', cityCode);
      }

    } else {
      YCS.BMAP.throwErr('城市编号（cityCode）可能有误：' + cityCode);
    }

    if (cb && typeof cb === 'function') {
      cb(selectedCity);
    }
  },

  checkExisting: function checkIfHasExistingGeoData (name, needCheckExpiry) {
    var Data = YCS.UTIL.Data;
    //  Exists
    if (Data.checkExists(name, 'local')) {
      // - If need to check whether expired
      if (needCheckExpiry) {
        // -- Has expired
        if (Data.checkExpiry(name, 'local', YCS.BMAP.CONFIG.expires)) {
          return false;
        // -- Still vivid
        } else {
          return Data.get(name, 'local');
        }
      // - Good to go
      } else {
        return Data.get(name, 'local');
      }
    // Not exists
    } else {
      return false;
    }
  },

  store: function storeInLoacalStorage (name, data, domOnly) {
    U[name] = data;
    YCS.BMAP.logTime(name);

    if (domOnly) { return; }

    var Data = YCS.UTIL.Data;
    Data.store(name, Data.objToJSON(data), 'local');
  },

  logTime: function logInfoTimestamp (name) {
    var now = new Date().getTime();
    if (name instanceof Array && typeof name === 'object') {
      name.forEach(function(nm){
        U.TS[nm] = now;
      });
    } else {
      U.TS[name] = now;
    }
  },

  throwErr: function throwError (msg, type) {
    window.console.warn((type ? type + ' ERROR - ' : '') + msg);
  }
};

YCS.BMAP = BMAP;

})(window, window.BMap, window.YCS);