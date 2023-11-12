const Response = require('../classes/response');

class Error {
  static getError(code, languageId = 1, action, devError = "") {
    let message;

    if (!message) {
      code = "-1";
      message = code;
    }

    if (action) {
      if (typeof action !== "string") {
        action = JSON.stringify(action);
      }
    }

    if (devError) {
      if (typeof devError !== "string") {
        devError = JSON.stringify(devError);
      }
    }

    return new Response({
      code,
      message,
      action,
      devError,
    });
  }


  
}



module.exports = Error;
