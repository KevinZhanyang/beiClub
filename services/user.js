 /**
 * 用户相关服务
 */

const util = require('../utils/util.js');
const api = require('../config/api.js');


/**
 * 调用微信登录
 */
function loginByWeixin() {

  let code = null;

  return new Promise(function (resolve, reject) {
    return util.login().then((res) => {
      code = res.code;
      return util.getUserInfo();
    }).then((userInfo) => {
      console.log(userInfo)
      wx.setStorageSync('userInfo', userInfo.userInfo);
      console.log("--------------------");
      console.log(userInfo);
      //登录远程服务器
      util.requestForForm(api.AUTH_LOGIN, { code: code, providerId: "auction", "nickName": userInfo.userInfo.nickName, "avatarUrl": userInfo.userInfo.avatarUrl, encrypData: userInfo.encryptedData, ivData: userInfo.iv }, 'POST').then(res => {
        console.log
        if (res.code === 200) {
          //存储用户信息
          wx.setStorageSync('token', res.body.access_token);
          wx.setStorageSync('refresh_token', res.body.refresh_token);
          wx.setStorageSync('user', res.body.user);
          // rolesHandler(res.body.user);
          resolve(res);
        } else {
          reject(res);
        }
      }).catch((err) => {
        console.log(err);
        reject(err);
      });
    }).catch((err) => {
      console.log(err);
      reject(err);
    })
  });
}
/**
 * 构建用户角色
 */
function rolesHandler(user){
  var roles ={};
  var roleList = user.bizRoles.market.map((item, index) => {
    var bizroleId = item.bizroleId;
    roles[item.bizroleId]= bizroleId
    return item;
  });
  wx.setStorageSync("roles", roles);
}


/**
 * 构建用户角色
 */
function getCurrentUser() {
  console.log("yuejagd;l");
  util.getUserInfo()
    .then(userInfo => {
      var data = { encrypData: userInfo.encryptedData, ivData: userInfo.iv};
      // encrypData: userInfo.encryptedData, ivData: userInfo.iv
      //登录远程服务器
      util.request(api.CurrentUser + "?encrypData=" + userInfo.encryptedData + "&ivData=" + userInfo.iv, data+"&sessionKey="+wx.getStorageSync("user").sessionKey).then(res => {
        if (res.code === 200) {
          if (res.body && res.body != "") {
            rolesHandler(res.body)
            return res;
          } else {
            //刷新token
            wx.removeStorageSync("token");
            if (wx.getStorageSync("refresh_token")) {
              util.request(api.RefreshToken, { grant_type: "refresh_token", refresh_token: wx.getStorageSync("refresh_token"), scope: 'all' }, "POST").then(res => {
                if (res.code === 200) {
                  console.log(res);
                } else {
                  //刷新token


                }
              }).catch((err) => {
                // reject(err);
              });
            }

          }


        } else {
          //刷新token
          wx.removeStorageSync("token");
          if (wx.getStorageSync("refresh_token")) {
            util.request(api.RefreshToken, { refresh_token: wx.getStorageSync("refresh_token") }, 'POST').then(res => {
              if (res.code === 200) {

              } else {
                //刷新token


              }
            }).catch((err) => {
              reject(err);
            });
          }


          reject(res);
        }
      }).catch((err) => {
        console.log(err)
      });
    }).catch((err) => {
      console.log("44444455567")
      console.log(err);
    });


}


/**
 * 
 */
function getCurrentUserII(){
  return new Promise(function (resolve, reject) {
  util.getUserInfo()
    .then(userInfo => {
      var data = { encrypData: userInfo.encryptedData, ivData: userInfo.iv };
      //登录远程服务器
      util.request(api.CurrentUser + "?encrypData=" + userInfo.encryptedData + "&ivData=" + userInfo.iv, data + "&sessionKey=" + wx.getStorageSync("user").sessionKey).then(res => {
        if (res.code === 200) {
          wx.setStorageSync('user', res.body);
          resolve(res.body.personId);  
        } else {
          reject(false);
        }
      })
    }).catch(err=>{
      reject(false);
    })
  });
}



/**
 * 判断用户是否登录
 */
function checkLogin() {
  return new Promise(function (resolve, reject) {
    if (wx.getStorageSync('user') && wx.getStorageSync('token')) {
      console.log("来啦")
      util.request(api.CurrentUser).then(res => {
        if (res.code === 200) {
          rolesHandler(res.body)
          resolve(true);
        } else {
          reject(false);
        }
      }).catch((err) => {
        reject(false);
      });
    } else {
      reject(false);
    }
  });
}

function isManager(){
  let roles = wx.getStorageSync('roles');
  //保留原有manager判断；
  if (roles.SHOP_MANAGER) return true;
  //以下是新权限设计
  //manager判断，直接判断对应角色代码有无即可
  if (roles[950]) {
    return true;
  }
  if (roles[951]) {
    return true;
  }
  if (roles[960]) {
    return true;
  }
  if (roles[970]) {
    return true;
  }
  if (roles[971]) {
    return true;
  }
  if (roles[972]) {
    return true;
  }
  if (roles[999]) {
    return true;
  }

}

module.exports = {
  loginByWeixin,
  checkLogin,
  getCurrentUser,
  isManager,
  getCurrentUserII,
};











