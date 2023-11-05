const OrdersHelper = require('../../helpers/orders.helper');
const omit = require('lodash/omit');
const { ITEM_NOT_FOUND} = require('../../errorDefinition/errors.map');
const pick = require('lodash/pick');

class OrdersController {

    static async index(req, res) {
        console.log(req.query);
        try {

            const options = {
                sort: req.query.sort,
                order: req.query.order,
                filter: req.query.filter,
                fromDate: req.query.fromDate,
                toDate: req.query.toDate,
                statusFlag: req.query.statusFlag,
                pageSize: req.query.pageSize,
                companyTag: req.headers.companytag,
                clientKey: req.header('Client-key'),
                page: req.query.page
            }
            console.log(options);
            const items = await OrdersHelper.getOrders(options);
            console.log(items);

            return res.sendSuccess(items);
        } catch (error) {
            console.log(error);
            res.sendError(error, req.header('languageId'), '', error);
        }
    }

    

    static async create(req, res) {
        try {
            // const departure = new Date(req.body.departure_date);
            // const arrival = new Date(req.body.arrival_date);
            // req.body.departure_date = departure;
            // req.body.arrival_date = arrival;
            const item = await OrdersHelper.create(req.body);
            res.sendSuccess(item);
        } catch (error) {
            console.log(error);
            res.sendError(error, req.header('languageId'), null, error);
        }
    }


}

module.exports = OrdersController;
