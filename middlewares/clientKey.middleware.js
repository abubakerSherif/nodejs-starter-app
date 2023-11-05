const response = require('../helpers/response.helper');
const { ERRORS } = require('./../errorDefinition/errorCodesConstants');
const { CLIENT_KEY_NO_LONGER_SUPPORTED_PLS_USE_IOWT } = require('./../errorDefinition/errors.map');
const { ErrorParser } = require('./../errorParser/errorParser');
const MOBILEAPP_KEY = 'Mob!le@pp';
class ClientKeyMiddleware {
  static async clientKey(req, res, next) {
    try {
      let lang = req.header('languageid');
      if (lang) {
        switch (lang) {
          case '1':
            global.currentLang = 'en-US';
            break;
          case '2':
            global.currentLang = 'ms';
            break;
          case '3':
            global.currentLang = 'zh-Hans';
            break;
          case '4':
            global.currentLang = 'zh-Hant';
            break;
          default:
            global.currentLang = 'en-US';
            break;
        }
      } else {
        global.currentLang = 'en-US';
      }
      const givenClientKey = req.header('Client-key');
      if (givenClientKey === MOBILEAPP_KEY) {
        req.client = {
          key: "com.delivery.mobile"
        };
        next();
      } else {
        res
          .status(200)
          .send(new ErrorParser(ERRORS.NOT_AUTHORIZED));
      }

    } catch (error) {
      console.log(error);
      res.sendError(error, req.header('languageId'), null, error);
    }
  }
}

module.exports = ClientKeyMiddleware;
