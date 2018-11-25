// pages/poster/index.js

var wxDraw = require("../../utils/wxdraw.min.js").wxDraw;
var Shape = require("../../utils/wxdraw.min.js").Shape;
import {
  apiRoot
} from "../../config/api.js";
Page({

  data: {

  },
  prePareShare(option) {
    this.setData({
      drawing: [{
          type: 'image',
          url: 'https://used-america.oss-us-west-1.aliyuncs.com/cbb/2018-11-04%2016:19:42/154131958213811.png',
          left: 0,
          top: 0,
          width: 645,
          height: 855,
        },
        {
          type: 'image',
          url: wx.getStorageSync("userInfo").avatarUrl,
          // url: "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eryLJEEaUiaChys4Vegu5FduefB349CNeIBzffGiaXHeYutOexIQWI1OLnGnk5Yg2cDIO3SD2JjXdJw/132",
          left: 142,
          top: 233,
          width: 108,
          height: 108,
        },
        {
          type: 'text',
          content: wx.getStorageSync("userInfo").nickName,
          // content:"必须性感",
          fontSize: 26,
          color: 'black',
          textAlign: 'left',
          left: 270,
          top: 270,
          width: 650,
        },

        {
          type: 'text',
          content: "还剩11:59:59",
          fontSize: 26,
          color: 'black',
          textAlign: 'left',
          left: 270,
          top: 308,
          width: 650,
        },
        {
          type: 'text',
          content: this.data.startPrice+"",
          fontSize: 26,
          color: 'black',
          textAlign: 'left',
          left: 165,
          top: 665,
          width: 650,
        },
        {
          type: 'image',
          url: option,
          // url:"https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eryLJEEaUiaChys4Vegu5FduefB349CNeIBzffGiaXHeYutOexIQWI1OLnGnk5Yg2cDIO3SD2JjXdJw/132",
          left: 388,
          top: 540,
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
      showShare: false
    })
    setTimeout(function() {
      that.setData({
        showShare: true,
        qrcode:"qrcode"
      })
    }, 100)
  },

  edit(){
    wx.redirectTo({
      url: '/pages/editAuction/index?auctionId=' + this.data.auctionId,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
   
  },
  goDetail(){
    wx.navigateTo({
      url: '/pages/auction/index?auctionId=' + this.data.auctionId,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    //预览图片
    wx.previewImage({
      current: current,
      urls: [current],
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.setData({
      posterUrl: apiRoot+options.qrcodeUrl,
      auctionId: options.auctionId
    })
   
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
  saveImg(){
    let that = this;


    wx.getImageInfo({
      src: this.data.posterUrl,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success: (res) => {
           that.setData({
             showTips:true,
             tips:"海报已成功保存至相册；快去分享吧！"
           })
           setTimeout(()=>{
             that.setData({
               showTips: false
             })
   
           },1500)
          },
          fail: (err) => {
            that.setData({
              showTips: true,
              tips: "海报已成功保存失败！"
            })
            setTimeout(() => {
              that.setData({
                showTips: false
              })

            }, 1500)
          }
        })

      }})
  
  }
})