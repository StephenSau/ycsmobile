(function (requirejs, BMap, YCS) {
'use strict'; 

var YM = YCS.BMAP;
var U = YCS.USER;
var Data = YCS.UTIL.Data;

requirejs(['vue', 'topBar', 'ajax', 'backToTop', 'cityList', 'vueTouch', 'footerLogin'], function (vm, topBar, Ajax, backToTop, cityList, vueTouch, footerLogin) {
	vm.use(vueTouch);

	// Init Global Topbar
	var globalTopBar = new vm({
		el: '#globalTopBar',
		data: function (){
			return {	
				showList: false,
				selectedCityName: '定位中…',
				selectedCity: {},
				ipCity: {}
			};
		},
		events: {
			'selected-city': function (data) {
			}
		},
		watch: {
			'selectedCity': {
				deep: true,
				handler: function (newVal, oldVal) {
					if (newVal && newVal.c && newVal.n) {
						this.renderSelectedCity(newVal);
					}
				}
			}
		},

		methods: {
			checkExistingData: function () {
				var existingSelectedCity = YM.checkExisting('selectedCity', 'local');
				if (existingSelectedCity && existingSelectedCity.n) {
					this.selectedCity = existingSelectedCity;
					this.selectedCityName = existingSelectedCity.n;
				}
				var existingIpCity = YM.checkExisting('ipCity', 'local');
				if (existingIpCity && existingIpCity.bc > 0) {
					this.ipCity = existingIpCity;
				}
			},
			showCityList: function (e) {
				e.preventDefault();
				this.showList = true;
			},
			renderSelectedCity: function (newItem) {
				this.selectedCityName = newItem.n;
				
			},
			getUserGeoCity: function (data) {
				if (!data || !data.address) { return; }

				if (!this.selectedCityName || !this.selectedCityName.length) {
					this.selectedCityName = data.address.city;
				}

				if (!this.selectedCity || !this.selectedCity.n || !this.selectedCity.bc) {
					// Polyfill for Baidu CityCode
					// coz' the returned `city_code` from the previous step is always `0` 
					YM.getUserCityCode(this.renderCityCode);
				}

			},
			renderCityCode: function (data) {
				if (data && data.bc) {
					this.selectedCity = data;
					this.ipCity = data;
					Data.store('ipCity', data, 'local');
				}
			}
		},

		ready: function () {
			this.checkExistingData();
		},

		attached: function () {
			YM.init();
			var self = this;
			window.setTimeout(function () {
				YM.getUserPos(true, self.getUserGeoCity, true);
			}, 2000);
		}
	});

	var articleDetail = new vm({
		el: '#articleDetail',
		ready: function () {
  		this.fillData();
		},
		data: {
			title: '三证合一究竟是哪三证，合一后应该怎么办？',
			author: '佚名',
			released: '2016-03-30 14:47:23',
			region: '网络',
			content:'<p><img src="http://fs.ycs.com/commonturn/201601/7/202b349606.png"></p><p><img src="http://fs.ycs.com/commonturn/201601/7/202b349606.png"></p><p><span style="line-height: 1.5em;">　　昨日，广州中院发布了《广州中院劳动争议案件审判工作情况(2013~2015)》和“劳动争议十大典型案例”。</span><span style="line-height: 1.5em;">报告显示，因诚信缺失所引发的恶意诉讼在劳动争议中所占的比重一直较大，且近年来呈愈演愈烈的趋势。用人单位恶意诉讼主要表现为：虚假陈述，隐匿或伪造证据;建立关联公司，混淆实际用工主体;拖延诉讼，增加劳动者维权成本。广州中院审理的二审劳动争议案件，用人单位上诉的有一部分是基于拖延诉讼的目的，刁难离职员工。相较之下，劳动者恶意诉讼近年虽然还很常见，但呈减少趋势。</span></p><p><strong>　　案例 员工未按规定报销被辞退公司不违法</strong></p><p>　　2008年5月29日梁某与×洁营销公司签订无固定期限劳动合同，隶属客户业务发展部。根据营销公司的文件规定，梁某作为主要的业务负责人，工作职责之一为促销费用报销、提供费用报销的支持性文件、确保所有用于报销的文件准确真实、确保报销流程遵循费用报销标准化工作流程。</p><p>　　但梁某用自以为准确的方式来提交报销材料，没有按公司标准操作流程规定将报销材料中的海报保留两年，没有做好客户经理助理所提交报销材料真实性的核查工作等。</p><p>　　2015年3月16日，营销公司告知工会解除梁某的决定。2015年3月19日营销公司向梁某发出《关于解除劳动合同的通知书》，以梁某违反公司账目、数据、记录真实性和准确性的要求，伪造数据材料且违反公司的标准操作程序为由，解除其劳动合同。</p><p>　　梁某以营销公司违法解除劳动合同为由申请仲裁及提起诉讼，要求营销公司支付违法解除合同赔偿金46万元。</p><p>　　一审法院作出驳回梁某解除劳动合同经济补偿金的请求。梁某不服提起上诉，二审法院最终维持原判。</p><p><strong>　　法官点评</strong></p><p>　　根据有关司法解释，营销公司可根据依法制定并公示的《×洁全球商业行为手册》和《营销公司员工守则》对员工进行管理。梁某没有按上述规定的公司标准操作流程做好客户经理助理所提交报销材料真实性的核查工作、没有具体检查就发给公司进行报销，可认定梁某存在违反上述规定的行为。</p><p>　　法院对梁某请求营销公司支付违法解除劳动合同赔偿金的请求不予支持。法官提醒，劳动者应自觉遵守用人单位的规章制度。</p><p><strong>　　案例</strong></p><p><strong>　　公司代扣“慈善福利基金”违法</strong></p><p>　　郑某入职某线缆公司，该公司设有“慈善福利基金”，用途为帮助困难员工,以及丰富员工的文娱生活，员工每月工资总额的1%需纳入集团慈善福利基金和工会组织经费，从工资总额中扣取。</p><p>　　后来，双方因公司能否扣除上述费用产生纠纷。郑某申请仲裁，并提起一审诉讼。法院一审后，判决线缆公司向郑某返还从每月工资中克扣的水电费、电话费等共计1208.60元。二审法院经审理后判决线缆公司向郑某返还从每月工资中克扣的水电费、电话费、伙食费、福利基金缴费等共计2653元。</p><p><strong>　　法官点评:</strong></p><p>　　《劳动合同法》规定，用人单位招用劳动者，不得要求劳动者提供担保或者以其他名义向劳动者收取财物。</p>'
		}, 
		methods: {
			fillData: function(){
				document.getElementById('content-wrapper').innerHTML = this.content;
			}
		},
	});

	var globalFooterLogin = new vm({
		el: '#footerLogin'
	});

});

}(window.requirejs, window.BMap, window.YCS));