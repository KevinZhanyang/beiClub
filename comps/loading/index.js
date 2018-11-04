'use strict';

Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer: function (newVal) {
        if (newVal) {
          wx.showLoading({
            title: '加载中...',
            mask: true
          });
        } else {
          this.setData({
            isShow: false
          });
          wx.hideLoading();
        }
      }
    }
  },
  data: {
    isShow: true
  },
  methods: {

  }

});