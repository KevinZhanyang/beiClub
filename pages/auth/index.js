//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');
var user = require('../../services/user.js');
import { CURRENTUSER } from "../../config/api.js";

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
    if (options.senceType){
       this.setData({
         senceType: options.senceType
       })
    }

    if (options.sence) {
      this.setData({
        sence: options.sence
      })
    }

    if (options.path) {
      this.setData({
        path: options.path
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
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
    
  },
   bindGetUserInfo: function (e) {
    if (!e.detail.userInfo) {
      wx.showModal({
        title: '温馨提示',
        content: '还没授权呢！',
        showCancel: false
      })
      return;
    }
    wx.setStorageSync('userInfo', e.detail.userInfo)
    this.goLogin()
  },

  goLogin() {
    wx.showLoading({
      title: '登陆中',
    })
    let that = this;
    user.loginByWeixin().then(res => {
      console.log("llllll");
      let token = wx.getStorageSync('token');
      app.globalData.token = wx.getStorageSync('token');
      app.globalData.userInfo = wx.getStorageSync('userInfo');
      wx.showLoading({
        title: '登陆成功',
        duration: 1500
      })

      util.request(CURRENTUSER).then(res => {
        if (res.code == 200) {
          wx.setStorageSync("user", res.body)
        } else {
        }
      });
      

      if (that.data.senceType && that.data.senceType=="back"&&!that.data.path ){
          wx.navigateBack({
          })
      } else if (that.data.senceType && that.data.senceType == "back" && that.data.path&&that.data.sence){
        setTimeout(() => {
          wx.redirectTo({
            url: that.data.path + "?auctionId=" + that.data.sence,
          })
        }, 1500);
        

       }else{
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/index/index',
          })
        }, 1500);
       }
     
      
    }).catch((err) => {
      wx.hideLoading();
      wx.showModal({
        title: '温馨提示',
        content: '开小差啦',
        showCancel: false
      })
      console.log(err)
    });
  },
})