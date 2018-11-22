// pages/withDraw/index.js
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
  PAY_INFO,
  WITHDRAW
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
     console.log(options)
     this.setData({
       auctionId: options.auction,
       amt: options.amt
     })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  mobileInput(event){
   console.log(event)
   this.setData({
     phone: event.detail.value
   })
  },
  mobileWechat(event) {
    console.log(event)
    this.setData({
      wx: event.detail.value
    })
  },

  withDraw(){
    util.request(WITHDRAW, { auctionId: this.data.auctionId, amt:this.data.amt,phone:this.data.phone,wx:this.data.wx }, "POST").then(res => {
      if (res.code == 200) {

        wx.showModal({
          title: '温馨提示',
          content: '申请提交成功！',
          showCancel:false
        })

      }
    });
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