const apiRoot = "https://used.beimei2.com";
const OSS_ACCESS_KEY_ID = "LTAIqOUcfWsExRPm";
const OSS_ACCESS_KEY_SECRET = "2CsV9Qf1QjimVBA3rbQFax31JD77Wg";
const OSS_ENDPOINT = "http://oss-us-west-1-internal.aliyuncs.com";
const OSS_BUCKET = "used-america";
const OSS_CDNDOMAIN = "http://img.beimei2.com";
const OSS_PROCESS_THUMBNAIL = "? x-oss-process=style/thumbnail";
const OSS_PROCESS_SMALL_THUMBNAIL = "?x-oss-process=style/small_thumbnail";
const GET_TAG_LIST = apiRoot + "/used/v1/tag";
const PAY_INFO = apiRoot + "/used/v1/miniPay";
const AUTH_LOGIN = apiRoot + "/market/v1/authentication/miniapp"; //market微信小程序登录
const PROVIDERID = "auction";
const CREATE_AUCTION = apiRoot + "/used/v1/auction";
const AUCTION = apiRoot + "/used/v1/auction";
const BIDDER = apiRoot + "/used/v1/bidder";
const CURRENTUSER = apiRoot + "/used/v1/currentUser";
const CREATE_TAG = apiRoot + "/used/v1/tag";
const CREATE_USER_FORMID = apiRoot + "/used/v1/miniFormId";
const WITHDRAW =apiRoot+"/used/v1/withdraw"
module.exports = {
  apiRoot,
  GET_TAG_LIST,
  PAY_INFO,
  AUTH_LOGIN,
  PROVIDERID,
  CREATE_AUCTION,
  AUCTION,
  BIDDER,
  CURRENTUSER,
  CREATE_TAG,
  CREATE_USER_FORMID,
  WITHDRAW
};
