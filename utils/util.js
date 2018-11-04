var api = require('../config/api.js');

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "GET") {
  return new Promise(function(resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': "application/json",
        'Authorization': wx.getStorageSync('token') == "" || wx.getStorageSync('token') == null ? "" : "bearer " + wx.getStorageSync('token')
      },
      success: function(res) {
        if (res.statusCode == 200) {
          resolve(res.data);
        } else if (res.statusCode == 401) {
         
          wx.showToast({
            title: '登陆已过期',
          })
        }

      },
      fail: function(err) {
        console.log(err)
        reject(err)
      }
    })
  });
}


/**
 * 封封微信的的request
 */
function requestForForm(url, data = {}, method = "GET") {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': "application/x-www-form-urlencoded",
        'Authorization':  "Basic YXBwaWQ6c2VjcmV0" 
      },
      success: function (res) {
        if (res.statusCode == 200) {
          resolve(res.data);
        } else if (res.statusCode == 401) {

          wx.showToast({
            title: '登陆已过期',
          })
        }

      },
      fail: function (err) {
        console.log(err)
        reject(err)
      }
    })
  });
}


/**
 * 检查微信会话是否过期
 */
function checkSession() {
  return new Promise(function(resolve, reject) {
    wx.checkSession({
      success: function() {
        resolve(true);
      },
      fail: function() {
        reject(false);
      }
    })
  });
}
/**
 *检查后台登陆态
 */
function checkToken() {
  return new Promise(function(resolve, reject) {
    resolve(true);
  });
}

/**
 * 调用微信登录
 */
function login() {
  return new Promise(function(resolve, reject) {
    wx.login({
      success: function(res) {
        if (res.code) {
          //登录远程服务器
          console.log(res)
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function(err) {
        reject(err);
      }
    });
  });
}

function getUserInfo() {
  return new Promise(function(resolve, reject) {
    wx.getUserInfo({
      withCredentials: true,
      success: function(res) {
        console.log(res)
        resolve(res);
      },
      fail: function(err) {
        reject(err);
      }
    })
  });
}

function redirect(url) {

  //判断页面是否需要登录
  if (false) {
    wx.redirectTo({
      url: '/pages/auth/login/login'
    });
    return false;
  } else {
    wx.redirectTo({
      url: url
    });
  }
}

function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    image: '/static/images/icon_error.png'
  })
}

module.exports = {
  requestForForm,
  formatTime,
  request,
  redirect,
  showErrorToast,
  checkSession,
  checkToken,
  login,
  getUserInfo,
}