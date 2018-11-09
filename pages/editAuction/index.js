//index.js
//获取应用实例
const app = getApp();
var uploadImage = require("../../utils/uploadFile.js");
var util = require("../../utils/util.js");
import {
  GET_TAG_LIST,
  CREATE_AUCTION,
  CREATE_TAG
} from "../../config/api.js";

Page({
  data: {
    tagList: [],
    selectTag: [],
    startPrice:0.00,
    bidIncreatment:0.00,
    showSharePoster: false
  },
  onLoad(option) {
     
    var oldAuction = wx.getStorageSync(option.auctionId)
    this.setData({
      auctionId:option.auctionId,
      selectTag: oldAuction.tags,
      startPrice: oldAuction.startPrice/100,
      bidIncreatment: oldAuction.bidIncreatment/100
    })
    this.getOldList(oldAuction.tags, option.auctionId);
  },
  getList(selectTags) {
    util.request(GET_TAG_LIST+"/getBiz", {
      "perPageNum": 10, tags: selectTags
    }, "PUT").then(res => {
      if (res.code == 200) {
        var tagList = res.body.tagList.map((item,index)=>{
          selectTags.map((selectTagId)=>{

            if (selectTagId==item.id){
              item.state=1;
             }
            return selectTagId;
          })
          return item
        })
        this.setData({
          tagList: res.body.tagList
        });
      }
    });
  },
   //获取原来的便签并绑定
  getOldList(selectTags,auctionId) {
    var tagList = wx.getStorageSync("selectTags_" + auctionId);
    tagList = tagList.map((item, index) => {
      selectTags.map((selectTagId) => {

        if (selectTagId == item.id) {
          item.state = 1;
        }
        return selectTagId;
      })
      return item
    })
    this.setData({
      tagList: tagList
    });
  },
  startPrice(event) {
    let amount = event.detail.value
    var regu = /^(([1-9]\d*(\.\d*)?)|(0\.\d[1-9]))$/;
    var re = new RegExp(regu);
    if (!re.test(amount * 100)) {
      wx.showLoading({
        title: '调皮了！',
        duration: 1500,
      })
      setTimeout(function () {
        wx.hideLoading();
      }, 1500)

    } else {
      this.setData({
        startPrice: amount
      })
    }
  }

  ,
  bidIncreatment(event) {
    let amount = event.detail.value
    var regu = /^(([1-9]\d*(\.\d*)?)|(0\.\d[1-9]))$/;
    var re = new RegExp(regu);
    if (!re.test(amount * 100)) {
      this.setData({
        bidIncreatment: amount
      })
    } else {
      this.setData({
        bidIncreatment: amount
      })
    }

  },
  startTip() {
    this.setData({
      showTips: true,
      tips: "指基础价格，且平台收取2%服手续费"
    })

  },
  hideTip() {
    this.setData({
      showTips: false,
      tips: ""
    })
  },

  bidIncreatmentTip() {

    this.setData({
      showTips: true,
      tips: "指竞拍者每次出价最少加价额"
    })


  },

  createTag(event) {
    let that = this;
    if (this.data.createTag && this.data.createTag == 1) {
      return false;
    }
    if (!that.data.selfTag) {
      wx.showLoading({
        title: '请输入标签',
        duration: 1000
      })
      return false;
    }
    this.setData({
      createTag: 1
    })
    var data = {
      name: that.data.selfTag
    }
    util.request(CREATE_TAG, data, "POST").then(res => {
      if (res.code == 200) {
        let tag = {
          id: res.body,
          name: that.data.selfTag
        }
        var tagList = this.data.tagList;
        tagList.push(tag);
        that.setData({
          tagList: tagList,
          showCreateTag: false

        })
        this.setData({
          createTag: 0
        })
      } else {

        this.setData({
          createTag: 0
        })
      }
    });
  },

  showCreateTagModel() {
    this.setData({
      showCreateTag: true
    })
  },
  hideShowCreateTag() {
    this.setData({
      showCreateTag: false
    })

  },
  inputTag(event) {
    var tag = event.detail.value;
    this.setData({
      selfTag: tag
    })
  },

  create(event) {
    let that = this;
    if (this.data.create && this.data.create == 1) {
      return false;
    }
    that.setData({
      create: 1
    })
    console.log(1)
    var tag = this.data.selectTag;
    if (!tag || tag.length < 2) {
      wx.showModal({
        title: '温馨提示',
        content: '至少选择2个标签',
        showCancel: false
      })
      that.setData({
        create: 0
      })
      return false;
    }
    console.log(2)
    var startPrice = 0.00;
    if (!this.data.startPrice) {
      startPrice = startPrice*100
    } else {
      startPrice = this.data.startPrice*100
    }
    var bidIncreatment = 0.00;
    if (!this.data.bidIncreatment) {
      console.log(3)
      wx.showModal({
        title: '温馨提示',
        content: '请设置加价幅度！',
        showCancel: false,

      })
      that.setData({
        create: 0
      })
      return false;
      bidIncreatment = bidIncreatment * 100;
    } else {
      bidIncreatment = this.data.bidIncreatment * 100;
    }
    console.log(4)
    that.setData({
      showSharePoster: true
    })

    var data = {
      startPrice: startPrice,
      bidIncreatment: bidIncreatment ,
      desc: "",
      tags: this.data.selectTag,
      avatarUrl: wx.getStorageSync("userInfo").avatarUrl
    }
    util.request(CREATE_AUCTION+"/"+this.data.auctionId, data, "PUT").then(res => {
      if (res.code == 200) {
        wx.hideLoading();
        that.setData({
          create: 0
        })
        wx.setStorageSync("" + this.data.auctionId, data)
        wx.setStorageSync("selectTags_" + this.data.auctionId, that.data.tagList)
        //生成海报；
        wx.redirectTo({
          url: '/pages/poster/index?auctionId=' + this.data.auctionId + "&startPrice=" + startPrice + "&qrcodeUrl=" + res.body,
        })
        that.setData({
          showSharePoster: false
        })
      } else {
        wx.setStorageSync("" + res.body.id, data)
        wx.setStorageSync("selectTags_" + res.body.id, that.data.tagList)
        wx.hideLoading();
        that.setData({
          create: 0
        })
        that.setData({
          showSharePoster: false
        })
        wx.showLoading({
          title: '服务器开小差啦！',
        })
      }
      
    });
    that.setData({
      create: 0
    })
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

});