// pages/auctionResult/index.js
const app = getApp();
var uploadImage = require("../../utils/uploadFile.js");
var util = require("../../utils/util.js");
var formIdService = require("../../services/formId.js");
import {
  GET_TAG_LIST,
  AUCTION,
  BIDDER,
  BIDDER_LIST,
  PAY_INFO
} from "../../config/api.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options.auctionId=427
    console.log(options)
 
    if (options.senceType = "bidder") {
      //付尾款
      this.setData({
        bidder: true,
        auctionId: options.auctionId,
      })

      if (!wx.getStorageSync("user")) {
        wx.showLoading({
          title: "请先登陆！",
          duration: 1500
        });
        setTimeout(() => {
          wx.navigateTo({
            url:
              "/pages/auth/index?senceType=backResult&sence=" +
              options.auctionId +"&senceType=bidder" +
              "&path=" +
              "/pages/auction/index"
          });
        }, 2000);
        return false;
      }


    } else {
          if(options.senceId) {
    var sceneId = options.senceId;
    this.setData({
      auctionId: sceneId
    });
            options.auctionId = senceId;
     }

      if (!wx.getStorageSync("user")) {
        wx.showLoading({
          title: "请先登陆！",
          duration: 1500
        });
        setTimeout(() => {
          wx.navigateTo({
            url:
              "/pages/auth/index?senceType=backResult&sence=" +
              options.auctionId +
              "&path=" +
              "/pages/auction/index"
          });
        }, 1500);
        return false;
      }
      this.setData({
        bidder: false,
        auctionId: options.auctionId,
      })
    }
    

    this.getDetail(options.auctionId);
    this.setData({
      shareUrl: "/pages/auction/index?auctionId=" + options.auctionId
    })
  },

  getDetail(AUCTION_ID) {
    let that = this;
    util.request(AUCTION + "/" + AUCTION_ID).then(res => {
      if (res.code == 200) {
        this.setData({
          auction: res.body,
          bidder: res.body.bidderResults[0]
        });
      }
    });
  },
  withDraw(){

     wx.navigateTo({
       url: '/pages/withDraw/index?auction=' + this.data.auction.id + "&bidder=" + this.data.bidder.id + "&amt="+this.data.bidder.bid,
     })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  waitPay() {
    let that = this;
    let url = PAY_INFO;
    util
      .request(
        url,
        {
          openId: wx.getStorageSync("user").openId,
          auctionId: this.data.auction.id,
          amt: (this.data.bidder.bid-1) * 100
        },
        "POST"
      )
      .then(res => {
        let code = res.code;
        if (code == 200) {
          let payParam = res.body;
          wx.requestPayment({
            timeStamp: payParam.timeStamp + "",
            nonceStr: payParam.nonceStr,
            package: payParam.package,
            signType: payParam.signType,
            paySign: payParam.sign,
            success: function (res) {
              that.setData({
                miss: true
              })
              util.request(BIDDER + '/' + that.data.bidder.id, { status: 2, auctionId: auctionId, bid: this.data.bidder.bid}, "PUT").then(res => {
                if (res.code == 200) {
                  wx.showLoading({
                    title: "交易完成!",
                    duration: 1500
                  });
                }
              });
            },
            fail: function (res) {
              wx.showLoading({
                title: "您取消了支付",
                duration: 1500
              });

            },
            complete: function (res) {
              that.setData({ isCreated: 0 });
            }
          });
        }
      })
      .catch(err => {
        console.log(err);
        that.setData({ isCreated: 0 });
      })








  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})