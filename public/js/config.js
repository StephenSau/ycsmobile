(function (require) {
    'use strict';
    require.config({
        baseUrl: "http://mob.ycs.com/public/js",
        shim: {
            vue: {
                exports: "vm"
            },
            vueAsync: {
                deps: ['vue']
            },
            vueResc: {
                deps: ['vue']
            },
            vueTouch: {
                deps: ['vue', 'hammerjs']
            },
            ajax: {
                deps: ['vue']
            },
            vueValid: {
                deps: ['vue']
            },
            topBar: {
                deps: ['vue']
            },
            backToTop: {
                deps: ['vue']
            },
            getDistance: {
                deps: ['vue']
            },
            bmapModal: {
                deps: ['vue']
            },
            bmapLink: {
                deps: ['vue', 'bmapModal']
            },
            modal: {
                deps: ['vue']
            },
            codeBox: {
                deps: ['vue', 'modal']
            },
            dialBox: {
                deps: ['vue', 'modal']
            },
            hint: {
                deps: ['vue']
            },
            lazyLoad: {
                deps: ['vue', 'lazyld']
            },
            search: {
                deps: ['vue']
            },
            carousel: {
                deps: ['vue', 'iscroll']
            },
            foot: {
                deps: ['vue']
            },
            footerLogin: {
                deps: ['vue', 'ajax']
            },
            cityList: {
                deps: ['vue', 'iscroll']
            }
        },
        paths: {
            "vue": "vendor/vue.min",
            "vueAsync": "vendor/vue-async-data",
            "vueResc": "vendor/vue-resource.min",
            "vueTouch": "vendor/vue-touch.min",
            'hammerjs': "vendor/hammer.min",
            "lazyld": "vendor/lazyload.min",
            'ajax': "module/ajaxFactory",
            "vueValid": "vendor/vue-validator",
            "topBar": "module/topBar",
            "backToTop": "module/backToTop",
            "iscroll": "module/iscroll-spy",
            "getDistance": "module/getDistance",
            "bmapLink": "module/bmapLink",
            "bmapModal": "module/bmapModal",
            "modal": "module/modal",
            "codeBox": "module/codeBox",
            "hint": "module/hint",
            "lazyLoad": "module/lazyLoad",
            "search": 'module/search',
            "carousel": "module/carousel",
            "foot": "module/foot",
            "footerLogin": "module/footerLogin",
            "cityList": "module/cityList",
            'dialBox': "module/dialBox"
        }
    });
}(window.require));