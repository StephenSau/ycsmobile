define(['vue', 'vueTouch'], function (vm, vueTouch) {
'use strict'; 
	vm.use(vueTouch);

	var backToTop = vm.extend({
		props: {
			show: {
				type: Boolean,
				default: false
			},
			top: {
				type: Number,
				coerce: function (val) {
					return /^\d+$/.test(val) && val*1 || 500;
				},
				default: 500
			}
		},

		ready: function () {
			var that = this;
			function toggle() {
				var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
				if (scrollTop > that.top) {
					that.show = true;
				} else {
					that.show = false;
				}
			}
			window.addEventListener('scroll', toggle);
			toggle();
		},

		template:
			'<div v-bind:class="{show: show}" id="backToTop" v-touch:tap="toTop()">' +
				'<i class="fa fa-angle-up"></i>' +
			'</div>',

		methods: {
			toTop: function () {
				var t = 0,
            b = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop,
            c = 0,
            d = 360,
            temp = 0,
            easeInSine = function (x, t, b, c, d) {
              if (c < b) {
                temp = c;
                c = b;
                b = temp;
                return c - (-c * Math.cos(t / d * (Math.PI / 2)) + c + b);
              }
              return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
            },
            animate = function () {
              if (t >= d) {
                window.scrollTo(0, c);
              } else {
                window.scrollTo(0, easeInSine(0, t, b, c, d));
                setTimeout(animate, 30);
              }
              t += 30;
            };
        animate();
			}
		}
	});

	vm.component('back-to-top', backToTop);
});