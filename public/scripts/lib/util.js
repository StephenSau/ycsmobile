(function(window, YCS){

'use strict';

var Util = {};

/*====================
  Data Manager
  ====================*/

var dataManager = {

  // Check HTML5 Storage support
  support: function checkStorageSupport(){
    return (typeof(Storage) !== 'undefined');
  },

  // Set Storage Location, defaults to sessionStorage
  storeLoc: function parseHTML5StorageLocation(type){
    if (type && type === 'local'){
      return localStorage;
    } else {
      return sessionStorage;
    }
  },

  // Perform Storage
  store: function storeHTML5Data(key, data, type){
    var storageLoc = this.storeLoc(type);
    if (this.support){
      storageLoc[key] = JSON.stringify(data);
      storageLoc[key + '-updated'] = (new Date()).getTime();
    }
  },

  // Get Stored Data
  get: function getStoredHTML5Data(key, type){
    var storageLoc = this.storeLoc(type);
    if (storageLoc[key]){
      return JSON.parse(storageLoc[key]);
    } else {
      return;
    }
  },

  // Remove Stored Data
  remove: function deleteStoredHTML5Data(key, type){
    var storageLoc = this.storeLoc(type);
    if (storageLoc[key]){
      storageLoc.removeItem(key);
      if (storageLoc[key + '-updated']){
        storageLoc.removeItem(key + '-updated');
      }
    } else {
      return;
    }
  },

  // Parse object to JSON
  objToJSON: function parseJsObjToJSON(obj){
    var seen = [];
    var result = JSON.stringify(obj, function(key, val) {
      if (val !== null && typeof val === 'object') {
        if (seen.indexOf(val) >= 0)  {
          return;
        }
        seen.push(val);
      }
      return val;
    });
    return JSON.parse(result);
  },

  checkExists: function checkIfDataExists(key, type) {
    var storageLoc = this.storeLoc(type);
    if (storageLoc[key]) {
      return true;
    } else {
      return false;
    }
  },

  checkExpiry: function checkIfStoredDataHasExpired(key, type, timeout) {
    var storageLoc = this.storeLoc(type);
    var lastUpdated = storageLoc[key + 'updated'];
    if (lastUpdated){
      var now = (new Date()).getTime();
      if (Number(lastUpdated) + (timeout || 0) > now) {
        return true;
      } else {
        return false;
      }
    } else {
      return false; // Unknown timestamp, should force update
    }
  }

};

Util = {
	Data: dataManager
};

YCS.UTIL = Util;



})(window, window.YCS);