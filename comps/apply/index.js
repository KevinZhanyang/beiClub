var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var user = require('../../services/user.js');

'use strict';
Component({
  config: {

  },
  properties: {
    applyData: {
      type: Object,
      value: {}
    },
    modalHide: {
      type: Boolean,
      value: true
    }
  },
  data: {
    applyData: {
      name: '',
      password: '',
      cellphone: '',
      organization: '',
      department: '',
      hasCar: 0,
      isBoarder: 0,
      unionId: ''
    }
  },
  attached: function() {
    this.personal();
  },
  methods: {
    personal: function() {
      let _this = this;
      util.request(api.Personal).then(res => {
        if (res) {
          let user = wx.getStorageSync("user");
          let data = {
            name: res.name,
            cellphone: res.mobile,
            organization: res.organizationTxt,
            department: res.addr,
            hasCar: 0,
            isBoarder: 0,
            unionId: user.unionId
          };
          _this.triggerEvent('sync', data);
          _this.setData({
            applyData: data
          })
        } else {
          wx.showToast({
            title: '获取用户信息失败!',
            image: '/static/icon/error.png'
          });
        }
      }).catch((err) => {
        wx.showToast({
          title: err,
          image: '/static/icon/error.png'
        });
      });
    },
    confirm() {
      this.triggerEvent('confirm');
    },
    cancel() {
      this.setData({
        modalHide: true
      });
      // 清除密码
      let data = this.data.applyData;
      data.password = '';
      this.setData({
        applyData: data
      });
      this.triggerEvent('sync', this.data.applyData);
    },
    nameInput: function(event) {
      let data = this.data.applyData;
      data.name = event.detail.value;
      this.setData({
        applyData: data
      });
      console.log(this.data.applyData);
      this.triggerEvent('sync', this.data.applyData);
    },
    mobileInput: function(event) {
      let data = this.data.applyData;
      data.cellphone = event.detail.value;
      this.setData({
        applyData: data
      });
      this.triggerEvent('sync', this.data.applyData);
    },
    organizationInput: function(event) {
      let data = this.data.applyData;
      data.organization = event.detail.value;
      this.setData({
        applyData: data
      });
      this.triggerEvent('sync', this.data.applyData);
    },
    addrInput: function(event) {
      let data = this.data.applyData;
      data.department = event.detail.value;
      this.setData({
        applyData: data
      });
      this.triggerEvent('sync', this.data.applyData);
    },
    passwordInput: function (event) {
      let data = this.data.applyData;
      data.password = event.detail.value;
      this.setData({
        applyData: data
      });
      this.triggerEvent('sync', this.data.applyData);
    },
    switchCar: function(event) {
      let data = this.data.applyData;
      data.hasCar = data.hasCar == 0 ? 1 : 0;
      this.setData({
        applyData: data
      });
      this.triggerEvent('sync', this.data.applyData);
    },
    switchAcc: function() {
      let data = this.data.applyData;
      data.isBoarder = data.isBoarder == 0 ? 1 : 0;
      this.setData({
        applyData: data
      });
      this.triggerEvent('sync', this.data.applyData);
    },
  },
});