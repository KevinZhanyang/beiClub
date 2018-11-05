//index.js
//获取应用实例
const app = getApp();
var uploadImage = require("../../utils/uploadFile.js");
var util = require("../../utils/util.js");
import { GET_TAG_LIST, AUCTION ,BIDDER,BIDDER_LIST} from "../../config/api.js";

Page({
    data: {
        show: false,
        value: 9.09 //出价

    },
  onLoad(options) {
      if (options.auctionId) {
          this.getDetail(options.auctionId);
      } else if (options.scene) {
          var sceneId = decodeURIComponent(options.scene)
          this.getDetail(3);
      }
    this.getDetail(3);
  }
 ,
  getDetail(AUCTION_ID) {
    util.request(AUCTION + "/" + AUCTION_ID).then(res => {
      if (res.code == 200) {
        this.setData({
          auction: res.body,
          bidders: res.body.bidderResults ? res.body.bidderResults:[]
          
        });
      }
    });
  },
  goCreate(){
 
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

  showPopup() {
    this.setData({ show: true });
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
    var data = {

      auctionId: this.data.auction.id,
      bid: this.data.value
    }

    util.request(BIDDER, data, "POST").then(res => {
      if (res.code == 200) {
       that.setData({
         showModal:true
       })
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
