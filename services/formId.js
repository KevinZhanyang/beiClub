/**
 * 通知相关服务
 */

const util = require('../utils/util.js');
const api = require('../config/api.js');
import { CREATE_USER_FORMID } from "../config/api.js";

/**
 * 记录FORMID
 */
function createUserFormId(formId) {
  return new Promise(function (resolve, reject) {
    util.request(CREATE_USER_FORMID, {
     openId: wx.getStorageSync("user").openId,
      formId: formId,
      provider:"pms"
      },'POST'
    ).then((res) => {
      resolve(res);
    });
  });
}

module.exports = {
  createUserFormId,
};