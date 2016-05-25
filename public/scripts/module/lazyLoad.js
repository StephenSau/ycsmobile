define(['vue', 'lazyld'], function (vm, lazyld) {
'use strict';

  var lazyLoad = vm.extend({
    name: 'lazy-load',
    props: {
      iSrc: {
        type: String,
        required: true
      }
    },

    template:
    '<img ' +
      'data-src="{{ iSrc }}"' +
      'src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="' +
      'onload="lzld(this)">'
  });

  vm.component('lazy-load', lazyLoad);

});