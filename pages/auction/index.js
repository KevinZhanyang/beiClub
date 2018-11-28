//index.js
//获取应用实例
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
  data: {
    clock: "",
    show: false,
    value: null,
    auctionId: null,
    isSelf: false,
    successModal: false,
    countDownList: [],
    actEndTimeList: []
  },
  onLoad(options) {
    console.log(options)
    var auctionId;
    if (options.auctionId) {
      auctionId = options.auctionId;
      this.setData({
        auctionId: options.auctionId
      });
    } else if (options.scene) {
      var sceneId = decodeURIComponent(options.scene);
      auctionId = sceneId;
      this.setData({
        auctionId: sceneId
      });
    }
    else if (options.senceId) {
      var sceneId = options.senceId;
      auctionId = sceneId;
      this.setData({
        auctionId: sceneId
      });
    }

    if (!wx.getStorageSync("user")) {
      wx.showLoading({
        title: "请先登陆！",
        duration: 1500
      });
      setTimeout(() => {
        wx.navigateTo({
          url:
            "/pages/auth/index?senceType=back&sence=" +
            auctionId +
            "&path=" +
            "/pages/auction/index"
        });
      }, 2000);
      return false;
    }

    this.setData({
      shareUrl: "/pages/auction/index?auctionId=" + auctionId
    });
  },
  goCreate(){
    wx.navigateTo({
      url:
        "/pages/creat/index" 
    });


  },
  onUnload(){

    clearInterval(this.data.setInter)
  },
  onHide(){
    clearInterval(this.data.setInter)

  },
  onShow(option) {
    var that = this;
    //获取拍卖详情
    this.getDetailOnLoad(this.data.auctionId);
    // that.data.setInter = setInterval(
    //   function () {
    //     that.getDetail(that.data.auctionId);
    //   }
    //   , 6000);
  },
  calTime(that, now, endTime) {
     console.log(endTime)
    //  endTime='2018-11-27 13:40:11'
    if (!endTime){
       that.setData({
         clock: { end: "已经截止" }
       });
     }
    var endTime = Date.parse(new Date(endTime.replace(/-/g, "/")));
    var nd = Date.parse(new Date(now.replace(/-/g, "/")));
    // console.log('结束时间是：' + endTime);
    // var nd = this.getLocalTime(-8);
    // console.log('指定时区时间是：' + nd);
    var now_result = nd - endTime;
     console.log('当前时间' + nd);
    console.log(now);
    console.log(endTime);
     console.log('结束时间' + endTime);
    console.log('时间差' + now_result);
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
  getLocalTime(i){
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
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
    let endTimeList = this.data.actEndTimeList;
    let countDownArr = [];

    // 对结束时间进行处理渲染到页面
    endTimeList.forEach(o => {
      let endTime = new Date(o).getTime();
      let obj = null;
      // 如果活动未结束，对时间进行处理
      if (endTime - newTime > 0) {
        let time = (endTime - newTime) / 1000;
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
  getDetailOnLoad(AUCTION_ID) {
    let that = this;
    util.request(AUCTION + "/" + AUCTION_ID).then(res => {
      if (res.code == 200) {
        console.log(res.body.endTime)
        console.log("----------------------")
        that.calTime(that, res.body.now, res.body.endTime);
        that.setData({
          value: res.body.startPrice + res.body.bidIncreatment,
          wordCloud: "https://used.beimei2.com" + res.body.tagWordCloudUrl
        });
        if (res.body.createId + "" == wx.getStorageSync("user").recId) {
          that.setData({
            isSelf: true
          });
        }
        var bidderResults = [];
        if (res.body.bidderResults) {
          bidderResults = res.body.bidderResults.map((item, index) => {
            if (0 == index) {
              item.isFirst = true;
              that.setData({
                firstBidder: item
              });
            }
            return item;
          });
        }
        if (!res.body.bidderResults || res.body.bidderResults.length == 0) {
          this.setData({
            noBidder: true
          });
        } else {
          this.setData({
            noBidder: false
          });
        }
        this.setData({
          auction: res.body,
          bidders: bidderResults
        });

        if (res.body.bidderResults && res.body.bidderResults.length < 3) {
          this.setData({
            height: 450
          });
        }
      } else if (res.body.bidderResults && res.body.bidderResults.length >= 3) {
        this.setData({
          height: res.body.bidderResults.length
        });
      }

      // if (res.body.bidderResults && res.body.bidderResults.length > 0) {
      //   res.body.bidderResults.map((item, index) => {
      //     if (index == 0 && item.bidderId == wx.getStorageSync("user").recId) {
      //       wx.showModal({
      //         title: "温馨提示",
      //         content: "您出价最高暂时",
      //         showCancel: false
      //       });
      //     }
      //     return item;
      //   });
      // }
    });
  },

  getDetail(AUCTION_ID) {

    let that = this;
    that.setData({
      isHigh:0
    })
    util.request(AUCTION + "/" + AUCTION_ID).then(res => {
      if (res.code == 200) {
        that.calTime(that, res.body.now,res.body.endTime);

        if (res.body.createId + "" == wx.getStorageSync("user").recId) {
          this.setData({
            isSelf: true
          });
        }

        var bidderResults = [];
        if (res.body.bidderResults) {
          bidderResults = res.body.bidderResults.map((item, index) => {
            if (0 == index) {
              item.isFirst = true;
              that.setData({
                firstBidder: item
              });
            }
            return item;
          });
        }
        if (!res.body.bidderResults || res.body.bidderResults.length == 0) {
          this.setData({
            noBidder: true
          });
        } else {
          this.setData({
            noBidder: false
          });
        }
        this.setData({
          auction: res.body,
          bidders: bidderResults
        });

        if (res.body.bidderResults && res.body.bidderResults.length < 3) {
          this.setData({
            height: 450
          });
        }
      } else if (res.body.bidderResults && res.body.bidderResults.length >= 3) {
        this.setData({
          height: res.body.bidderResults.length
        });
      }

      if (res.body.bidderResults && res.body.bidderResults.length > 0) {
        res.body.bidderResults.map((item, index) => {
          if (index ==0 && item.bidderId == wx.getStorageSync("user").recId) {
            console.log("------------->>>>>>>>>>");
            console.log(item);
            // wx.showModal({
            //   title: "温馨提示",
            //   content: "目前您出价最高，拍卖结束后再支付尾款",
            //   showCancel: false
            // });
            that.setData({
              isHigh: 1
            })
          }
          return item;
        });
      }
    });
  },
  goIndex() {
    wx.navigateTo({
      url: "/pages/index/index"
    });
  },

  getList() {
    util.request(GET_TAG_LIST).then(res => {
      if (res.code == 200) {
        this.setData({
          tagList: res.body.tagList
        });
      }
    });
  },
  onChange(event) {
    //关闭蒙层，返回出价的价格
    console.log(event);
  
    this.setData({
      value: event.detail
    });
   
  },

  showPopup(event) {
    //创建用户formId数据

    formIdService.createUserFormId(event.detail.formId);
    console.log(event);
    if (this.data.isCreated == 1) {
      return;
    }
    this.setData({ show: true });
  },
  startTip() {
    this.setData({
      tipTitle: "起拍价",
      showTips: true,
      tips:
        "<p><strong style=\"color: rgb(163, 21, 21);\">1</strong><span style=\"color: rgb(163, 21, 21);\">.拍卖规则,拍卖时间为2小时，活动结束后最后出价最高者拍的该服务；</span></p><p><strong style=\"color: rgb(163, 21, 21);\">2</strong><span style=\"color: rgb(163, 21, 21);\">.拍卖成功，拍卖成功后即可进入小程序提现，24小时内提现到您的微信钱包\"；</span></p><p><strong style=\"color: rgb(163, 21, 21);\">3</strong><span style=\"color: rgb(163, 21, 21);\">.拍卖失败，若未拍的该服务即可进入小程序申请退款，工作人员将在24小时内退还到您的微信钱包!</span></p>"
    });
  },
  closeModal() {
    this.setData({
      showTips: false
    });
  },

  // preventTouchMove: function(e) {
  //   this.setData({
  //     showModal: false
  //   });
  // },
  hideModal() {
    this.setData({
      showModal: false
    });
  },
  hidePopup(event) {
    let that = this;

    if (that.data.isCreated && that.data.isCreated == 1) {
      return false;
    }
    //关闭蒙层
    this.setData({ show: false });
    console.log(event);
    if (that.data.auction.startPrice > this.data.value) {
      wx.showModal({
        title: "温馨提示",
        content: "您的出价小于起拍价"
      });

      return false;
    }

    if (that.data.firstBidder && that.data.firstBidder.bid >= this.data.value) {
      wx.showModal({
        title: "温馨提示",
        content: "您的出价必须高于当前最高者",
        showCancel:false
      });
      return false;
    }

    if (that.data.clock.end) {
      wx.showModal({
        title: "温馨提示",
        content: "拍卖已截止"
      });

      return false;
    } else {
      this.setData({ isCreated: 1 });
    }
    var data = {
      auctionId: this.data.auction.id,
      bid: this.data.value
    };

    let url = PAY_INFO;
    util
      .request(
        url,
        {
          openId: wx.getStorageSync("user").openId,
          auctionId: data.auctionId,
          amt: 1 * 100
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
              data.orderId = payParam.orderId;
              util.request(BIDDER, data, "POST").then(res => {
                if (res.code == 200) {
                  console.log(event);
                  that.setData({
                    showModal: true
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
              that.getDetail(that.data.auction.id);
            },
            complete: function(res) {
              that.setData({ isCreated: 0 });
            }
          });
        }
      })
      .catch(err => {
        console.log(err);
        that.setData({ isCreated: 0 });
      })
      .catch(err => {
        //1
        that.setData({ isCreated: 0 });
      });
  },
  onClose() {
    this.setData({ show: false });
  },
  selectTag(event) {
    let id = event.currentTarget.dataset["id"];
    let selectTag = this.data.selectTag;
    let tagList = this.data.tagList;
    if (selectTag.indexOf(id) > -1) {
      selectTag.splice(selectTag.indexOf(id), 1);
    } else {
      if (selectTag.length > 7) return;
      selectTag.push(id);
    }
    for (let item of tagList) {
      if (selectTag.indexOf(item.id) > -1) {
        item.state = 1;
      } else {
        item.state = 0;
      }
    }
    this.setData({
      tagList
    });
  },
  summitForm(event){
    formIdService.createUserFormId(event.detail.formId);
  },
  goheart(event){
    formIdService.createUserFormId(event.detail.formId);

    wx.navigateTo({
      url: '/pages/auctionResult/index?auctionId='+this.data.auction.id,
    })

  }
});
