//index.js
//获取应用实例
const app = getApp();
var uploadImage = require("../../utils/uploadFile.js");
var util = require("../../utils/util.js");
import { GET_TAG_LIST, AUCTION, BIDDER, BIDDER_LIST } from "../../config/api.js";
/** 
 * 需要一个目标日期，初始化时，先得出到当前时间还有剩余多少秒
 * 1.将秒数换成格式化输出为XX天XX小时XX分钟XX秒 XX
 * 2.提供一个时钟，每10ms运行一次，渲染时钟，再总ms数自减10
 * 3.剩余的秒次为零时，return，给出tips提示说，已经截止
 */

// 定义一个总毫秒数，以一分钟为例。TODO，传入一个时间点，转换成总毫秒数
var total_micro_second = 10000 * 1000;

/* 毫秒级倒计时 */
function count_down(that) {
  // 渲染倒计时时钟
  that.setData({
    clock: date_format(total_micro_second)
  });

  if (total_micro_second <= 0) {
    that.setData({
      clock: { end: "已经截止" }
    });
    // timeout则跳出递归
    return;
  }
  setTimeout(function () {
    // 放在最后--
    total_micro_second -= 10;
    count_down(that);
  }
    , 14)
}

// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;
  // 毫秒位，保留2位
  var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));

  return { hr: hr, min: min, sec: sec }
}

// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}

Page({
  data: {
    clock: '',
    show: false,
    value: null,
    auctionId: null,
    isSelf: false
  },
  onLoad(options) {




    var auctionId;
    if (options.auctionId) {
      auctionId = options.auctionId
      this.setData({
        auctionId: options.auctionId
      })
    } else if (options.scene) {
      var sceneId = decodeURIComponent(options.scene)
      auctionId = sceneId
      this.setData({
        auctionId: sceneId
      })
    }

    if (!wx.getStorageSync("user")) {
      wx.showLoading({
        title: '请先登陆！',
        duration: 1500
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/auth/index?senceType=back&sence=' + auctionId + "&path=" + "/pages/auction/index",
        })
      }, 2000)
      return false;
    }

    this.setData({
      shareUrl: '/pages/auction/index?auctionId=' + auctionId
    })
  }
  ,
  onShow(option) {
    //获取拍卖详情
    this.getDetail(this.data.auctionId);
  }
  ,
  calTime(that, createTime) {
    var createTime = Date.parse(new Date(createTime.replace(/-/g, "/")));
    var now = Date.parse(new Date());

    var now_result = now - createTime


    var step = 12 * 60 * 60 * 1000;
    var result = now_result >= step

    if (result) {
      that.setData({
        clock: { end: "已经截止" }
      });

    } else {
      total_micro_second = step - now_result
      count_down(that);
    }
  }
  ,
  getDetail(AUCTION_ID) {
    let that = this;
    util.request(AUCTION + "/" + AUCTION_ID).then(res => {
      if (res.code == 200) {

        that.calTime(that, res.body.createTime);

        if (res.body.createId + "" == wx.getStorageSync("user").recId) {
          this.setData({
            isSelf: true
          })
        }

        var bidderResults = []
        if (res.body.bidderResults) {
          bidderResults = res.body.bidderResults.map((item, index) => {
            if (0 == index) {
              item.isFirst = true;
              that.setData({
                firstBidder:item
              })
            }
            return item
          })
        }
        if (!res.body.bidderResults || res.body.bidderResults.length == 0) {
          this.setData({
            noBidder: true,
          })
        } else {
          this.setData({
            noBidder: false,
          })
        }
        this.setData({
          auction: res.body,
          bidders: bidderResults,
          value: res.body.bid
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
          if (index == 1 && item.bidderId == wx.getStorageSync("user").recId) {
            wx.showModal({
              title: '温馨提示',
              content: '恭喜您暂时领先',
              showCancel: false,
            })
          }
          return item;
        })

      }
    });
  },
  goCreate() {
    wx.navigateTo({
      url: '/pages/creat/index',
    })

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
    this.data.value = event.detail;
  },

  showPopup(event) {
    console.log(event);
    this.setData({ show: true });
  },
  startTip(){
    this.setData({
      tipTitle: "起拍价",
      showTips: true,
      tips: "1.拍卖规则,拍卖时间为12小时，活动结束后最后出价最高者拍的该服务。"+
             "2.拍卖成功，拍卖成功后即可进入小程序提现，24小时内提现到您的微信钱包"+
             "3.拍卖失败，若未拍的该服务即可进入小程序申请退款，工作人员将在24小时内退还到您的微信钱包!"
    })
  },
  closeModal(){
    this.setData({
      showTips: false,
    })
  },

  preventTouchMove: function (e) {
    this.setData({
      showModal: false
    })
  },
  hidePopup(event) {
    let that = this;
    //关闭蒙层
    this.setData({ show: false });
    console.log(event)
    if (that.data.clock.end) {
      wx.showModal({
        title: '温馨提示',
        content: '拍卖已截止',
      })
    }

    var data = {

      auctionId: this.data.auction.id,
      bid: this.data.value
    }

    util.request(BIDDER, data, "POST").then(res => {
      if (res.code == 200) {
        that.setData({
          showModal: true
        })
        this.getDetail(that.data.auction.id);
      }
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
  }
});
