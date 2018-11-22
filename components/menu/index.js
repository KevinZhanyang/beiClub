Component({
  properties: {
    //
    /*
        innerText: {
          type: String,
          value: 'default value',
        }
        */
    number: Number,
    notify: Number, // 0无通知|1有通知
    paddingBottom: Number,
    marginBottom: Number,
    back: Boolean
    
  },
  data: {
    // 这里是一些组件内部数据
    someData: {},
    modal: false
  },
  methods: {
    // 这里是一个自定义方法
    //
    backToTop() {
      wx.pageScrollTo({ scrollTop: 0 });
    },
    showModal() {
      this.triggerEvent("show");
    }
  },
  attached: function() {
    //
    let that = this;
    wx.getSystemInfo({
      success: res => {
        let screenHeight = res.screenHeight;
        if (screenHeight > 700) {
          that.setData({
            paddingBottom: 157,
            paddingBottom1: 120
          });
        } else {
          that.setData({
            paddingBottom: 97,
            paddingBottom1: 60
          });
        }
      }
    });
    //
  }
});
