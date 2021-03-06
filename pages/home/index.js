// pages/home/index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');
var user = require('../../services/user.js');
import { CURRENTUSER } from "../../config/api.js"; 
import { MYJOINAUCTION } from "../../config/api.js";
import { MYACCOUNT } from "../../config/api.js"; 
var formIdService = require("../../services/formId.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  summitForm(event){
    formIdService.createUserFormId(event.detail.formId);
    wx.navigateTo({
      url: '/pages/withDraw/index',
    })

  },

  summitFormId(event){
    formIdService.createUserFormId(event.detail.formId);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getCurrentUser();
  },

  getActionList(){
    let that = this
    util.request(MYJOINAUCTION).then(res => {
      if (res.code == 200) {
        var result = []
        var end = []
        var ing = []
        res.body.map((item, index) => {


          item.statusTxt = (item.createId == that.data.currentUser.id) || (item.bidderResults && item.bidderResults.length > 0 && item.bidderResults[0].bidderId == that.data.currentUser.id) ? (item.status == 1 ? '进行中' : (item.status == 2 ? '待付款' : (item.status == 3 ? '失败' : (item.status == 4 ? '失败' : "成功")))) : (item.status == 1 ? '失败' : (item.status == 2 ? '失败' : (item.status == 3 ? '失败' : (item.status == 4 ? '失败' : "失败")))) 



          if (item.status == 4) {
            end.push(item);
          } else {
            result.push(item);
          }
        })
        if (ing.length > 0) {
          ing.map((item, index) => {
            result.push(item);
          })
        }
        if (end.length > 0) {
          end.map((item, index) => {
            result.push(item);
          })
        }

        this.setData({
          auctionList: result, end: end
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
  getCurrentUser(){
    let that = this;
    util.request(CURRENTUSER).then(res => {
      if (res.code == 200) {
        wx.setStorageSync("user", res.body);
        this.setData({
          currentUser: res.body.user
        })

        that.getActionList();


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

  goAuction(event){
   console.log(event);
    var auctionId = event.currentTarget.dataset.auctionId;
    wx.navigateTo({
      url: '/pages/auction/index?auctionId=' + auctionId,
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCurrentUser();
   





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