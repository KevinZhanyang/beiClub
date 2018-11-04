//index.js
//获取应用实例
const app = getApp();
var uploadImage = require("../../utils/uploadFile.js");
var util = require("../../utils/util.js");
import { GET_TAG_LIST } from "../../config/api.js";

Page({
  data: {
    show: false,
    value: 9.09 //出价
  },
  onLoad() {
    this.getList();
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
  hidePopup() {},
  showPopup() {
    this.setData({ show: true });
  },
  hidePopup() {
    //关闭蒙层
    this.setData({ show: false });
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
