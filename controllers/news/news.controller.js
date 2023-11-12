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
                bodyFilter: req.query.bodyFilter,
                statusFilter: req.query.statusFilter,
                titleFilter: req.query.titleFilter,
                pageSize: req.query.pageSize,
                page: req.query.page
            }
            const items = await NewsHelper.getItems(options);

            return res.sendSuccess(items);
        } catch (error) {
            console.log(error);
            res.sendError(error, req.header('languageId'), '', error);
        }
    }

    static async delete(req, res) {
        try {
            const news_id = req.params.id;
            let news = await NewsHelper.findById({ _id:news_id });
            if (!news) {
                throw NOT_FOUND; 
            }
            news = await NewsHelper.delete(
                {   
                    _id:news_id
                }
            );    
            res.sendSuccess(news);
        } catch (error) {
            console.log(error);
            res.sendError(error, req.header('languageId'));
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

    static async update(req, res) {
        try {
            const news_id = req.params.id;
            let news = await NewsHelper.findById({ _id:news_id });
            news = await NewsHelper.update(
                {   
                    _id:news_id,
                    body:req.body 
                }
                ,{ new: true }
            );    
            res.sendSuccess(news);
        } catch (error) {
            console.log(error);
            res.sendError(error, req.header('languageId'));
        }
    }

}

module.exports = NewsController;
