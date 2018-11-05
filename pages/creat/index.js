//index.js
//获取应用实例
const app = getApp();
var uploadImage = require("../../utils/uploadFile.js");
var util = require("../../utils/util.js");
import { GET_TAG_LIST, CREATE_AUCTION } from "../../config/api.js";

Page({
  data: {
    tagList: [],
    selectTag: [],
    // startPrice:0.00,
    // bidIncreatment:0.00
  },
  onLoad() {
   
    this.getList();
  },
  getList() {
    util.request(GET_TAG_LIST, {"perPageNum":10},"GET").then(res => {
      if (res.code == 200) {
        this.setData({
          tagList: res.body.tagList
        });
      }
    });
  },
  startPrice(event){
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
      
    }else{
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

  create(event){
    let that = this;
    var tag = this.data.selectTag;
    if(!tag||tag.length<=0){
      wx.showModal({
        title: '温馨提示',
        content: '至少选择一个标签',
        showCancel: false
      })
      return false;
    }
    var startPrice=0.00;
    if (!this.data.startPrice){
      startPrice = startPrice*100
    }else{
      startPrice = this.data.startPrice * 100
    }
    var bidIncreatment = 0.00;
    if (!this.data.bidIncreatment){
      bidIncreatment = bidIncreatment*100;
    }else{
      bidIncreatment = this.data.bidIncreatment * 100;
    }

    var data = { startPrice: startPrice, bidIncreatment: bidIncreatment, desc: "", tags: this.data.selectTag}
    util.request(CREATE_AUCTION, data, "POST").then(res => {
      if (res.code == 200) {
        //生成海报；
       wx.redirectTo({
         url: '/pages/poster/index?auctionId=' + res.body + "&startPrice=" + startPrice,
       })
      }
    });
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
