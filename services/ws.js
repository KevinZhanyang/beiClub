var api = require('../config/api.js');
var util = require('../utils/util.js');


var heartCheck = {
  timeout: 50000,
  timeoutObj: null,
  serverTimeoutObj: null,
  reset: function() {
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
    return this;
  },
  start: function() {
    this.timeoutObj = setTimeout(() => {
      console.log("发送ping");
      const msg = JSON.stringify({
        code: 'PING',
        val: ''
      });
      wx.sendSocketMessage({
        data: msg
      });
      this.serverTimeoutObj = setTimeout(() => {
        wx.closeSocket();
      }, this.timeout);
    }, this.timeout);
  }
};

const ws = {
  startWebSocket: function() {
    this.WebSocketInit()
  },
  //连接websocket
  WebSocketInit: function() {
    var that = this;
    wx.connectSocket({
      url: api.wsUrl,
      data: {},
      method: 'GET',
      success: function(res) {
        console.log("connectSocket 成功");
        that.initEventHandle();
      },
      fail: function(res) {
        console.log("connectSocket 失败")
      }
    })
    wx.onSocketOpen(function() {
      heartCheck.reset().start();
      that.regist();
    });
  },
  initEventHandle() {
    let that = this;
    this.limit = 0;
    wx.onSocketMessage((res) => {
      //收到消息
      heartCheck.reset().start();
      console.log(res)
      console.log('111111111111111111111111111111111111111111')
      that.messageHandler(res.data);
    })
    wx.onSocketOpen(() => {
      console.log('WebSocket连接打开')
      heartCheck.reset().start()
    })
    wx.onSocketError((res) => {
      console.log('WebSocket连接打开失败')
      that.reconnect()
    })
    wx.onSocketClose((res) => {
      console.log('WebSocket 已关闭！')
      that.reconnect()
    })
  },
  reconnect() {
    if (this.lockReconnect) return;
    this.lockReconnect = true;
    clearTimeout(this.timer)
    if (this.limit < 12) {
      this.timer = setTimeout(() => {
        this.startWebSocket();
        this.lockReconnect = false;
      }, 5000);
      this.limit = this.limit + 1;
    }
  },
  regist() {
    let user = wx.getStorageSync("user");
    // callback
    if (user) {
      const msg = JSON.stringify({
        code: 'ORDER',
        val: user.recId
      });
      wx.sendSocketMessage({
        data: msg,
        success: function(res) {
          console.log(res)
          console.log("sendSocketMessage 成功")
        },
        fail: function(res) {
          console.log("sendSocketMessage 失败")
        }
      });
    } else {
      console.log("未登录");
    }
  },
  messageHandler(resp) {
    var data = JSON.parse(resp);
    console.log("-----------<<<>>>>>><<<<>"+data)
    console.log( data)
    if(data.type =="ORDERCON"){
      return false;
    }
    if (data.type == 'ORDER') {
      // var obj = JSON.parse(data.body);
      var orderMsgNum =wx.getStorageSync("orderMsgNum");
      if(orderMsgNum){
        orderMsgNum = orderMsgNum+1;
        wx.setStorageSync("orderMsgNum", orderMsgNum)
      }else{
        orderMsgNum =1;
        wx.setStorageSync("orderMsgNum", 1)
      }
      wx.setTabBarBadge({ index: 3, text: orderMsgNum+""})
    }
  }
}
module.exports = ws;