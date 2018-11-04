const apiRoot = 'https://used.beimei2.com';
const OSS_ACCESS_KEY_ID = 'LTAIqOUcfWsExRPm';
const OSS_ACCESS_KEY_SECRET = '2CsV9Qf1QjimVBA3rbQFax31JD77Wg';
const OSS_ENDPOINT = 'http://oss-us-west-1-internal.aliyuncs.com';
const OSS_BUCKET = 'used-america';
const OSS_CDNDOMAIN = 'http://img.beimei2.com';
const OSS_PROCESS_THUMBNAIL = '? x-oss-process=style/thumbnail';
const OSS_PROCESS_SMALL_THUMBNAIL = '?x-oss-process=style/small_thumbnail';
const GET_TAG_LIST = apiRoot + '/used/v1/tag';
const PAY_INFO = apiRoot + "/used/v3/order";
const AUTH_LOGIN = apiRoot + '/market/v1/authentication/miniapp'; //market微信小程序登录
const PROVIDERID = "auction";
const CREATE_AUCTION = apiRoot + '/used/v1/auction'
const AUCTION = apiRoot + '/used/v1/auction'

module.exports = {
  GET_TAG_LIST,
  PAY_INFO,
  AUTH_LOGIN,
  PROVIDERID,
  CREATE_AUCTION,
  AUCTION
};