const response = require('../helpers/response.helper');
const { ERRORS } = require('./../errorDefinition/errorCodesConstants');
const { ErrorParser } = require('./../errorParser/errorParser');
const MOBILEAPP_KEY = 'Mob!le@pp';
class ClientKeyMiddleware {
  static async clientKey(req, res, next) {
    try {      
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
