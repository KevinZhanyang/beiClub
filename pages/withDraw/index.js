// pages/withDraw/index.js
// pages/auctionResult/index.js
const app = getApp();
var uploadImage = require("../../utils/uploadFile.js");
var util = require("../../utils/util.js");
var formIdService = require("../../services/formId.js");


var user = require('../../services/user.js');
import { CURRENTUSER } from "../../config/api.js";
import { MYACCOUNT } from "../../config/api.js";


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
  goqa(){
    wx.navigateTo({
      url: '/pages/qa/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.request(CURRENTUSER).then(res => {
      if (res.code == 200) {
        wx.setStorageSync("user", res.body);
        this.setData({
          currentUser: res.body.user
        })
      } else {
      }
    });

    util.request(MYACCOUNT).then(res => {
      if (res.code == 200) {
        this.setData({
          myAccount: res.body
        })
      } else {
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  summitFormAllAmt(event){
    formIdService.createUserFormId(event.detail.formId);
    this.setData({
      withDrawAmt: this.data.myAccount.amt ? this.data.myAccount.amt:0
    })
  },
  setWithDrawAmt(event){
    if (event.detail.value > (this.data.myAccount.amt ? this.data.myAccount.amt : 0)){
      wx.showLoading({
        title: '余额不足！',
        duration: 1500
      })
      return this.data.withDrawAmt;
    }
    this.setData({
      withDrawAmt: event.detail.value
    })

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

  summitForm(event){
    if (!this.data.myAccount || this.data.myAccount.amt<=0){
      wx.showLoading({
        title: '余额不足！',
        duration: 1500
      })
      return false;
    }
    let that=this;
    if (!this.data.phone){
        wx.showLoading({
          title: '手机号必填！',
          duration:1500
        })
        return false;
    }
    
    if (!this.data.wx) {
      wx.showLoading({
        title: '微信号必填！', duration: 1500
      })
      return false;
    }

    if (!this.data.withDrawAmt) {
      wx.showLoading({
        title: '提现金额必填！',
        duration: 1500
      })
      return false;
    }
    formIdService.createUserFormId(event.detail.formId);
    util.request(WITHDRAW, { auctionId: this.data.auctionId, amt: this.data.withDrawAmt,phone:this.data.phone,wx:this.data.wx }, "POST").then(res => {
      if (res.code == 200&&res.body==1) {
        wx.showModal({
          title: '温馨提示',
          content: '申请提交成功，待审核！',
          showCancel:false
        })
        util.request(MYACCOUNT).then(res => {
          if (res.code == 200) {
            that.setData({
              myAccount: res.body
            })
          } else {
          }
        });
      } else if (res.code == 200 && res.body == 0){
        wx.showModal({
          title: '温馨提示',
          content: '没有查询到对应账户！',
          showCancel: false
        })
      } else if (res.code == 200 && res.body == 2) {
        wx.showModal({
          title: '温馨提示',
          content: '提现金额超出余额！',
          showCancel: false
        })


      } else if (res.code != 200) {
        wx.showModal({
          title: '开小差啦',
          content: '请稍后尝试或联系客服！',
          showCancel: false
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