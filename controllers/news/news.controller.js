const NewsHelper = require('../../helpers/news.helper');
const omit = require('lodash/omit');
const { ITEM_NOT_FOUND} = require('../../errorDefinition/errors.map');
const pick = require('lodash/pick');

class NewsController {

    static async index(req, res) {
        try {

            const options = {
                sort: req.query.sort,
                order: req.query.order,
                filter: req.query.filter,
                // fromDate: req.query.fromDate,
                // toDate: req.query.toDate,
                // statusFlag: req.query.statusFlag,
                pageSize: req.query.pageSize,
                // companyTag: req.headers.companytag,
                // clientKey: req.header('Client-key'),
                page: req.query.page
            }

            const items = await NewsHelper.getItems(options);

            return res.sendSuccess(items);
        } catch (error) {
            console.log(error);
            res.sendError(error, req.header('languageId'), '', error);
        }
    }

    

    static async create(req, res) {
        try {
            const item = await NewsHelper.create(req.body);
            res.sendSuccess(item);
        } catch (error) {
            res.sendError(error, req.header('languageId'), null, error);
        }
    }

}

module.exports = NewsController;
