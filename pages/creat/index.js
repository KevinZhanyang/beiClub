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
    startPrice:0.00,
    bidIncreatment:0.00
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
      // wx.showLoading({
      //   title: '调皮了！',
      //   duration: 1500,
      // })
      // setTimeout(function () {
      //   wx.hideLoading();
      // }, 1500)
      
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
      // this.setData({
      //   bidIncreatment: amount
      // })
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

    var data = { startPrice: this.data.startPrice * 100, bidIncreatment: this.data.bidIncreatment * 100, desc: "", tags: this.data.selectTag}
    util.request(CREATE_AUCTION, data, "POST").then(res => {
      if (res.code == 200) {
        //生成海报；
        
        that.prePareShare();
        that.setData({
          showShare:true
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
  prePareShare(){
    this.setData({
      drawing: [
        {
          type: 'image',
          url: 'https://used-america.oss-us-west-1.aliyuncs.com/cbb/2018-11-04%2016:19:42/154131958213811.png',
          left: 0,
          top: 0,
          width: 645,
          height: 955,
        },
        {
          type: 'image',
          url: wx.getStorageSync("userInfo").avatarUrl,
          left: 72,
          top: 53,
          width: 78,
          height: 75,
        },
        {
          type: 'text',
          content: wx.getStorageSync("userInfo").nickName,
          fontSize: 26,
          color: 'white',
          textAlign: 'left',
          left: 170,
          top: 50,
          width: 650,
        },
        {
          type: 'text',
          content: '这里是小程序码',
          fontSize: 30,
          color: 'red',
          textAlign: 'left',
          left: 390,
          top: 720,
          width: 200
        },
        {
          type: 'image',
          url: 'https://i.loli.net/2018/10/30/5bd851175ce40.jpg',
          left: 388,
          top: 620,
          width: 190,
          height: 190,
          circle: true
        }
      ]
    })
    
  }
});
