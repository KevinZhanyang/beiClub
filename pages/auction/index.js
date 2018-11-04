//index.js
//获取应用实例
const app = getApp();
var uploadImage = require("../../utils/uploadFile.js");
var util = require("../../utils/util.js");
import { GET_TAG_LIST, AUCTION } from "../../config/api.js";

Page({
  data: {},
  onLoad(options) {
    if(options.auctionId){
      this.getDetail(options.auctionId);
    }else if (options.scene) {
      var sceneId = decodeURIComponent(options.scene)
      this.getDetail(3);
      }
  },
  getDetail(AUCTION_ID) {
    util.request(AUCTION + "/" + AUCTION_ID).then(res => {
      if (res.code == 200) {
        this.setData({
          auction: res.body.auction,
          biders: []
          
        });
      }
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