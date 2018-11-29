//index.js
//获取应用实例
const app = getApp();
var uploadImage = require("../../utils/uploadFile.js");
var util = require("../../utils/util.js");
var formIdService = require("../../services/formId.js");
import {
  GET_TAG_LIST,
  CREATE_AUCTION,
  CREATE_TAG
} from "../../config/api.js";

Page({
  data: {
    tagList: [],
    selectTag: [],
    showSharePoster: false
  },
  onLoad() {

    this.getList();
  },
  getList() {
    let that = this;

    util.request(GET_TAG_LIST, {
      "perPageNum": 20
    }, "GET").then(res => {
      if (res.code == 200) {
        if (that.data.selectTag && that.data.selectTag.length>0){
         let selectTag =  that.data.selectTag;
          res.body.tagList.map((item)=>{
            selectTag.map((selectTagItem)=>{
              if(item.id==selectTagItem){
                item.state = 1;
              }

              return selectTagItem;
            })

            return item;
          })
        }



        this.setData({
          tagList: res.body.tagList
        });
      }
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
      setTimeout(function() {
        wx.hideLoading();
      }, 1500)

    } else {
      this.setData({
        startPrice: amount
      })
    }
  },
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
      tipTitle: "起拍价",
      showTips: true,
      tips: "指基础价格，且平台收取2%手续费"
    })

  },
  hideTip() {
    this.setData({
      showTips: false,
      tips: ""
    })
  },

  deleteModel(event) {
    this.setData({
      showDelet: true,
      currentDeleteId: event.currentTarget.dataset.id
    })

  },
  hideDeleteTag(event) {

    formIdService.createUserFormId(event.detail.formId);


    var id = this.data.currentDeleteId;
    let tagList = this.data.tagList;
    for (let item of tagList) {
      if (item.id == id ) {
        item.showDelete = 0;
      } else {
        item.showDelete = 0;
      }
    }


    this.setData({
      tagList,
      showDelet: false,
      currentDeleteId: ""
    })
  },

  deleteTag(event) {
    let that = this;
    util.request(CREATE_TAG + "/" + that.data.currentDeleteId, {}, "DELETE").then(res => {
      if (res.code == 200) {
        this.setData({
          showDelet: false,
        })
        wx.showLoading({
          title: '删除成功',
          duration: 1500
        })
        that.getList();
      } else {
        showDelet: false,
        wx.showLoading({
          title: '删除失败',
          duration: 1500
        })
      }

    });


  },

  bidIncreatmentTip() {
    this.setData({
      tipTitle: "加价幅度",
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
        that.getList();

        that.setData({
          showCreateTag: false,
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

    formIdService.createUserFormId(event.detail.formId);


    let that = this;
    if (this.data.create && this.data.create == 1) {
      return false;
    }
    that.setData({
      create: 1
    })
    console.log(1)
    var tag = this.data.selectTag;



    if (!tag || tag.length<1) {


      this.setData({
        tipTitle: "温馨提示",
        showTipsModel: true,
        tips: "至少选择1个标签"
      })
      that.setData({
        create: 0
      })
      setTimeout(() => {

        this.setData({
          showTipsModel: false
        })


      }, 1500)

      return false;
    }
    console.log(2)
    var startPrice = 0.00;
    if (!this.data.startPrice) {
      startPrice = startPrice
    } else {
      startPrice = this.data.startPrice
    }
    var bidIncreatment = 0.00;
    if (!this.data.bidIncreatment) {
      console.log(3)
      this.setData({
        tipTitle: "温馨提示",
        showTipsModel: true,
        tips: "请设置加价幅度！"
      })
      setTimeout(() => {
        this.setData({
          showTipsModel: false
        })
      }, 1500)
      that.setData({
        create: 0
      })
      return false;
      bidIncreatment = bidIncreatment;
    } else {
      bidIncreatment = this.data.bidIncreatment;
    }
    console.log(4)
    that.setData({
      showShareLodding: true
    })

    var data = {
      startPrice: startPrice,
      bidIncreatment: bidIncreatment,
      desc: "",
      tags: this.data.selectTag,
      avatarUrl: wx.getStorageSync("userInfo").avatarUrl
    }
    util.request(CREATE_AUCTION, data, "POST").then(res => {
      if (res.code == 200 && res.body.imgUrl) {
        wx.hideLoading();
        that.setData({
          create: 0
        })
        wx.setStorageSync("" + res.body.id, data)
        wx.setStorageSync("selectTags_" + res.body.id, that.data.tagList)
        //生成海报；
        wx.redirectTo({
          url: '/pages/poster/index?auctionId=' + res.body.id + "&startPrice=" + startPrice + "&qrcodeUrl=" + res.body.imgUrl,
        })
        that.setData({

          showShareLodding: false
        })

      } else {
       
        wx.hideLoading();
        that.setData({
          showShareLodding: false
        })
        wx.showLoading({
          title: '生成海报失败',
          mask: true,
          duration: 1500
        })
      }
    });
    that.setData({
      create: 0

    })

  },

  showX(event) {
    let id = event.currentTarget.dataset["id"];
    let tagList = this.data.tagList;
    for (let item of tagList) {
      if (item.id == id && item.userId) {
        item.showDelete = 1;
      } else {
        item.showDelete = 0;
      }
    }
    this.setData({
      tagList
    });
  },

  selectTag(event) {


    let id = event.currentTarget.dataset["id"];
    let selectTag = this.data.selectTag;
    let tagList = this.data.tagList;

    for (let item of tagList) {
        item.showDelete = 0;
    }
    this.setData({
      tagList
    });
    if (selectTag.indexOf(id) > -1) {
      selectTag.splice(selectTag.indexOf(id), 1);
    } else {
      if (selectTag.length > 7) {


        this.setData({
          showTipsModel: true,
          tips: "最多选择8个标签"
        })

        setTimeout(() => {

          this.setData({
            showTipsModel: false
          })


        }, 1500)


        return false;


      };
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