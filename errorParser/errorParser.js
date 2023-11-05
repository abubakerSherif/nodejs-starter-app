const  Response  = require('./../helpers/response.helper');
class ErrorParser extends Response {
    constructor(constant) {
        super();
        if (constant) {
            this.code = constant.ERROR_CODE;
            this.message = constant.ERROR_MESSAGE;
            this.data = null;
        } else {
            this.code = 'XXXX-XXXX',
                this.message = 'WRONG ERROR CONSTANT';
            this.data = null;
        }
    }
}

module.exports = {
    ErrorParser
};