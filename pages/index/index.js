//index.js
//获取应用实例
const app = getApp()
var uploadImage = require('../../utils/uploadFile.js');
var util = require('../../utils/util.js');
var user = require('../../services/user.js');
import { PAY_INFO } from "../../config/api.js";
Page({
   data: {
     showLogin:true
   },
  navigator(e){
    //登陆




    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
    })
  },
   //选择照片
   choose:function(){ 
          // 测试支付
          // let url = PAY_INFO;
          // util.request(url, {
          //   openId: wx.getStorageSync("user").openId
          // }, 'POST').then(res => {
          //   let code = res.code;
          //   if (code == 200) {
          //     let payParam = res.body;
          //     wx.requestPayment({
          //       'timeStamp': payParam.timeStamp + '',
          //       'nonceStr': payParam.nonceStr,
          //       'package': payParam.package,
          //       'signType': payParam.signType,
          //       'paySign': payParam.sign,
          //       'success': function(res) {
          //         wx.redirectTo({
          //           url: '/pages/payResult/payResult?status=true&orderId='
          //         })
          //       },
          //       'fail': function(res) {
          //         console.log(res);
          //         wx.redirectTo({
          //           url: '/pages/payResult/payResult?status=false&orderId=',
          //         })
          //       },
          //       'complete': function(res) {
          //         console.log(res)
          //       }
          //     })
          //   }
          // }).catch(err => {
          //   console.log(err)
          // }).catch(err =>{
          //   //1
          //   Console.log(err);
          // })
        
  







      wx.chooseImage({
         count: 9, // 默认最多一次选择9张图
         sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
         sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
         success: function (res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            var tempFilePaths = res.tempFilePaths;
            var nowTime = util.formatTime(new Date());

            //支持多图上传
            for (var i = 0; i < res.tempFilePaths.length; i++) {
               //显示消息提示框
               wx.showLoading({
                  title: '上传中' + (i + 1) + '/' + res.tempFilePaths.length,
                  mask: true
               })

               //上传图片
               //你的域名下的/cbb文件下的/当前年月日文件下的/图片.png
               //图片路径可自行修改
               uploadImage(res.tempFilePaths[i], 'cbb/' +nowTime + '/',
                  function (result) {
                     console.log("======上传成功图片地址为：", result);
                     wx.hideLoading();
                  }, function (result) {
                     console.log("======上传失败======", result);
                     wx.hideLoading()
                  }
               )
            }
         }
      })
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
        duration:1500
      })
      
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
  onLoad(){
    if (!wx.getStorageSync("token")){
         wx.redirectTo({
           url: '/pages/auth/index',
           success: function(res) {},
           fail: function(res) {},
           complete: function(res) {},
         }) 
      }
  }
})
