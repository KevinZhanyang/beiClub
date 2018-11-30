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
    clock: "",
    countDownList: [],
    actEndTimeList: []
  },
  calTime(that, now, endTime) {
    console.log(endTime)
    if (!endTime) {
      that.setData({
        clock: { end: "已经截止" }
      });
    }
    console.log("---------->>>>>>>>>");
    console.log(endTime);

    var endTime = Date.parse(new Date(endTime.replace(/-/g, "/")))+600000;

    var d = new Date(endTime);
    console.log(that.formatDate(d));
    console.log("---------->>>>>>>>>");


    var d = new Date();
    var localTime = d.getTime(); //通过调用Data()对象的getTime()方法，即可显示1970年1月1日后到此时时间之间的毫秒数。
    var localOffset = d.getTimezoneOffset() * 18000;
    var utc = localTime + localOffset; //得到国际标准时间
    var offset = 8;
    var calctime = utc + (3600000 * offset);
    var nd = Date.parse(new Date(calctime));
    var now_result = nd - (endTime);
   
    var result = now_result >= 0;

    if (result) {
      that.setData({
        clock: { end: "已经截止" }
      });
    } else {
      let endTimeList = [];
      // 将活动的结束时间参数提成一个单独的数组，方便操作
      endTimeList.push(endTime)
      this.setData({ actEndTimeList: endTimeList });
      // 执行倒计时函数
      this.countDown();
    }
  },
  pushFormSubmit(event) {
    formIdService.createUserFormId(event.detail.formId);

  },

 formatDate(now) {
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
  } ,
  getLocalTime(i) {
    if (typeof i !== 'number') return;
    var d = new Date();
    //得到1970年一月一日到现在的秒数
    var len = d.getTime();
    //本地时间与GMT时间的时间偏移差
    var offset = d.getTimezoneOffset() * 60000;
    //得到现在的格林尼治时间
    var utcTime = len + offset;
    return Date.parse(new Date(utcTime + 3600000 * i))
  }
  ,
  timeFormat(param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  countDown() {//倒计时函数
    var d = new Date();
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = d.getTime();

    var localOffset = d.getTimezoneOffset() * 60000;

    var utc = newTime + localOffset; //得到国际标准时间
    console.log(utc);
    var offset = 8;
    var calctime = utc + (3600000 * offset);
    var newTimes = Date.parse(new Date(calctime));

    let endTimeList = this.data.actEndTimeList;
    let countDownArr = [];

    // 对结束时间进行处理渲染到页面
    endTimeList.forEach(o => {
      let endTime = new Date(o).getTime();
      let obj = null;
      // 如果活动未结束，对时间进行处理
      if (endTime - newTimes > 0) {
        let time = (endTime - newTimes) / 1000;
        // 获取天、时、分、秒
        let day = parseInt(time / (60 * 60 * 24));
        let hou = parseInt(time % (60 * 60 * 24) / 3600);
        let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
        let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
        obj = {
          day: this.timeFormat(day),
          hou: this.timeFormat(hou),
          min: this.timeFormat(min),
          sec: this.timeFormat(sec)
        }
      } else {//活动已结束，全部设置为'00'
        obj = {
          day: '00',
          hou: '00',
          min: '00',
          sec: '00'
        }
      }
      countDownArr.push(obj);
    })
    // 渲染，然后每隔一秒执行一次倒计时函数
    this.setData({ countDownList: countDownArr })
    setTimeout(this.countDown, 1000);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // options.auctionId = 469
    console.log(options)
    let that = this;
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
            url: "/pages/auth/index?senceType=backResult&sence=" +
              options.auctionId + "&senceType=bidder" +
              "&path=" +
              "/pages/auction/index"
          });
        }, 2000);
        return false;
      } else {
       
      }
    } else {
      if (options.senceId) {
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
            url: "/pages/auth/index?senceType=backResult&sence=" +
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
    that.setData({
      currentUser: wx.getStorageSync("user")
    })

    this.getDetail(options.auctionId);
    
    this.setData({
      shareUrl: "/pages/auction/index?auctionId=" + options.auctionId
    })
  },

  getDetail(AUCTION_ID) {
    let that = this;
    util.request(AUCTION + "/" + AUCTION_ID).then(res => {
      if (res.code == 200) {
        console.log(res.body.endTime)

        that.calTime(that, res.body.now, res.body.endTime);




        if (res.body.bidderResults[0]){
          this.setData({
            auction: res.body,
            bidder: res.body.bidderResults[0]
          });
          if (res.body.status == 5) {
            that.setData({
              miss: true
            })
          }

          if (wx.getStorageSync("user").recId == res.body.createId) {
            that.setData({
              isSeller: true
            })
          } else if (wx.getStorageSync("user").recId == res.body.bidderResults[0].bidderId) {
            that.setData({
              isBidderUser: true
            })
          } else {
            that.setData({
              isCustom: true
            })
          }

          if (!res.body.successShareUrl && res.body.status == 5) {
            that.generateShareUrl(res.body);
          } else {
            that.setData({
              qrcodeUrl: res.body.successShareUrl
            })

          }
        }else{
          this.setData({
            auction: res.body,
           
          });
        

          if (wx.getStorageSync("user").recId == res.body.createId) {
            that.setData({
              isSeller: true
            })
          } else {
            that.setData({
              isCustom: true
            })
          }

          if (!res.body.successShareUrl && res.body.status == 5) {
            that.generateShareUrl(res.body);
          } else {
            that.setData({
              qrcodeUrl: res.body.successShareUrl
            })

          }
        }
      }
    });
  },
  generateShareUrl(data){
    var putData = {};

    putData.auctionUserName = data.nickname;
    putData.auctionAvatarUrl = data.avatar;
    if (data.bidderResults[0]){
      putData.bidderName = data.bidderResults[0].nickname;
      putData.bidderAvatarUrl = data.bidderResults[0].avatar;
    }else{
      putData.bidderName ="无人出价";
      putData.bidderAvatarUrl = "https://used-america.oss-us-west-1.aliyuncs.com/cbb/2018-11-27 20:50:51/154332305129948.png";
    }
    

    putData.posterUrl = data.posterUrl;
    putData.id = data.id  
    let that = this;
    util.request(AUCTION + "/" + data.id + '/successUrl', putData,"PUT").then(res => {

      if(res.code==200){
          this.setData({
            qrcodeUrl: res.body
          })
      }
             
    });





  }
  ,
  withDraw() {

    wx.navigateTo({
      url: '/pages/withDraw/index?auction=' + this.data.auction.id + "&bidder=" + this.data.bidder.id + "&amt=" + this.data.bidder.bid,
    })


  },
  goIndex(){
    wx.navigateTo({
      url: '/pages/index/index',
    })

  }
,
  goShare(){
       //拿到qrcodeUrl
       wx.navigateTo({
         url: '/pages/heartShare/index?qrcodeUrl=' + this.data.qrcodeUrl + "&auctionId=" + this.data.auction.id,
       })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  waitPay() {
    let that = this;
    let url = PAY_INFO;
    util
      .request(
        url, {
          openId: wx.getStorageSync("user").openId,
          auctionId: this.data.auction.id,
          amt: (this.data.bidder.bid) * 100
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
            success: function(res) {
              that.setData({
                miss: true
              })
              util.request(BIDDER + '/' + that.data.bidder.id, {
                orderId: payParam.orderId,
                status: 2,
                auctionId: that.data.auction.id,
                bid: that.data.bidder.bid
              }, "PUT").then(res => {
                if (res.code == 200) {
                  wx.showLoading({
                    title: "交易完成!",
                    duration: 1500
                  });
                  that.getDetail(that.data.auction.id);

                }
              });
            },
            fail: function(res) {
              wx.showLoading({
                title: "您取消了支付",
                duration: 1500
              });

            },
            complete: function(res) {
              that.setData({
                isCreated: 0
              });
            }
          });
        }
      })
      .catch(err => {
        console.log(err);
        that.setData({
          isCreated: 0
        });
      })








  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})