const response = require('../helpers/response.helper');
const { validationResult } = require('express-validator');

class RequestBodyValidatorMiddleware {
    static async check(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array());
            
            return res.sendError('0006', req.header('languageId'), null, errors.array());
        }
        if (req.body.order) {
            req.body.order = (req.body.order === 'desc') ? -1 : req.body.order; 
            req.body.order = (req.body.order === 'asc') ? 1 : req.body.order; 
        }
        next();
    }
}

module.exports = RequestBodyValidatorMiddleware;
