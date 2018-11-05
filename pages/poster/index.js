// pages/poster/index.js

var wxDraw = require("../../utils/wxdraw.min.js").wxDraw;
var Shape = require("../../utils/wxdraw.min.js").Shape;
Page({

  data: {

  },
  prePareShare() {
    this.setData({
      drawing: [{
          type: 'image',
          url: 'https://used-america.oss-us-west-1.aliyuncs.com/cbb/2018-11-04%2016:19:42/154131958213811.png',
          left: 0,
          top: 0,
          width: 645,
          height: 955,
        },
        {
          type: 'image',
          url: wx.getStorageSync("userInfo").avatarUrl,
          left: 142,
          top: 273,
          width: 108,
          height: 108,
        },
        {
          type: 'text',
          content: wx.getStorageSync("userInfo").nickName,
          fontSize: 26,
          color: 'black',
          textAlign: 'left',
          left: 270,
          top: 310,
          width: 650,
        },

        {
          type: 'text',
          content: "48小时后结束！",
          fontSize: 26,
          color: 'black',
          textAlign: 'left',
          left: 270,
          top: 348,
          width: 650,
        },
        {
          type: 'text',
          content: this.data.startPrice+"",
          fontSize: 26,
          color: 'black',
          textAlign: 'left',
          left: 165,
          top: 745,
          width: 650,
        },
        {
          type: 'image',
          url: 'https://i.loli.net/2018/10/30/5bd851175ce40.jpg',
          left: 388,
          top: 620,
          width: 190,
          height: 190,
          circle: true
        }
      ]
    })

  },
  showLoading: function() {
    var that = this;
    this.setData({
      showLoading: true
    })

    setTimeout(function() {
      that.setData({
        showLoading: false
      })
    }, 4000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    options.auctionId = 3
    let that = this;
    that.setData({
      showShare: true,
      startPrice: options.startPrice,
      auctionId: options.auctionId,
      shareUrl: '/pages/auction/index?auctionId=' + options.auctionId
    })
    this.showLoading();
    this.prePareShare();
  },
  onShareAppMessage(res) {
    console.log(res)
    let that = this;
    let title = "快来拍吧！";
    let path = '/pages/auction/index?auctionId=' + this.data.auctionId;
    let imageUrl = this.data.shareImg;
    //
    return {
      title: title,
      path: path,
      imageUrl: imageUrl,
      // complete start 
      complete: function(res) {
        //
        if (res.errMsg == 'shareAppMessage:ok') {
          console.log('share success');
          /*
          //分享为按钮转发
          if (that.data.shareBtn) {
              //判断是否分享到群
              if (res.hasOwnProperty('shareTickets')) {
                  console.log(res.shareTickets[0]);
                  //分享到群
                  that.data.isshare = 1;
              } else {
                  // 分享到个人
                  that.data.isshare = 0;
              }
          }
          */

        } else {
          console.log('share fail');
          wx.showToast({
            title: '分享失败',
          });
        }

      },

    }

  },
})