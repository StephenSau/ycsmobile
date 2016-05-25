define(['vue', 'iscroll'], function (vm, iscroll) {
'use strict'; 

	var carouselTimer;

	var iScrollCarousel;

	var carousel = vm.extend({
		name: 'carousel',
		props: {
			items: {
				type: Array,
				default: [],
				required: true
			},
			heightRatio: {
				type: Number,
				required: true
			},
			widthRatio: {
				type: Number,
				required: true
			},
			interval: {
				type: Number,
				default: 4000
			}
		},

		data: function () {
			return {
				containerStyle: Object,
				innerStyle: Object,
				itemStyle: Object,

				activeItem: 0,
				nextItem: -1,
				direction: 'left'
			};
		},

		methods: {
			renderResize: function () {
				this.calcContainerStyle();
				this.calcInnerStyle();
			},

			preventTouchEnd: function (e) {
				if (!e || !e.target) { return; }
				if (e.target.classList.contains('preventTouchEnd') ) {
					e.preventDefault();
				}
			},

			renderActive: function (currentPage) {
				this.activeItem = currentPage.pageX || 0;
			},

			playNext: function () {
				if (this.activeItem >= this.items.length - 1) {
					iScrollCarousel.goToPage(-1, -1);
				} else {
					iScrollCarousel.next();
				}
			},

			calcContainerStyle: function () {
				var container = this.$parent.$el;
				this.containerStyle = {
					height: (container.offsetWidth / this.widthRatio * this.heightRatio) + 'px'
				};
			},

			calcInnerStyle: function () {
				if (!this.items || !this.items.length) { return; }
				var container = this.$parent.$el;
				this.innerStyle = {
					width: (this.items.length * 100) + '%',
					height: (container.offsetWidth / this.widthRatio * this.heightRatio) + 'px'
				};
			},

			calcItemStyle: function () {
				if (!this.items || !this.items.length) { return; }
				this.itemStyle = {
					width: (100 / this.items.length) + '%'
				};
			}
		},

		ready: function () {
			window.addEventListener('resize', this.renderResize);
			document.addEventListener('touchmove', this.preventTouchEnd, false);
		},

		attached: function () {
			var self = this;

			this.calcContainerStyle();
			this.calcInnerStyle();
			this.calcItemStyle();

			this.$nextTick(function () {
				iScrollCarousel = new iscroll('#carousel', {
					scrollX: true,
					scrollY: false,
					momentum: false,
					snap: true,
					snapSpeed: 500
				});

				self.$dispatch('carousel-ready');

				iScrollCarousel.on('scrollEnd', function() {
					self.renderActive(this.currentPage);
				});

				carouselTimer = window.setInterval(function () {
					self.playNext();
				}, self.interval);
			});

		},

		detached: function () {
			window.removeEventListener('resize', this.renderResize);
			document.removeEventListener('touchmove', this.preventTouchEnd);
			window.clearInterval(carouselTimer);
		},

		template:
		'<div id="carousel" class="carousel preventTouchEnd" v-bind:style="containerStyle">' +
			'<div class="carousel-inner preventTouchEnd" v-bind:style="innerStyle">' +
				'<ul class="carousel-list preventTouchEnd">' +
					'<li class="carousel-item preventTouchEnd" v-for="item in items" track-by="$index" ' + 
					'v-bind:style="itemStyle" v-bind:class="{active: activeItem === $index}">' +
						'<a v-bind:href="item.link" class="preventTouchEnd">' +
							'<img v-bind:src="item.img" class="preventTouchEnd" />' +
						'</a>' +
					'</li>' +
				'</ul>' +
			'</div>' +
		'</div>'
	});

	vm.component('carousel', carousel);

});