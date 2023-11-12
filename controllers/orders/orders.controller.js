const OrdersHelper = require('../../helpers/orders.helper');
const omit = require('lodash/omit');
const pick = require('lodash/pick');
const {NOT_FOUND} = require("../../errorDefinition/errors.map");
class OrdersController {

    static async index(req, res) {
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
            const items = await OrdersHelper.getOrders(options);
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


    static async update(req, res) {
        try {
            const order_id = req.params.id;
            let order = await OrdersHelper.findById({ _id:order_id });
            order = await OrdersHelper.update(
                {   
                    _id:order_id,
                    body:req.body 
                }
                ,{ new: true }
            );    
            res.sendSuccess(order);
        } catch (error) {
            console.log(error);
            res.sendError(error, req.header('languageId'));
        }
    }

    static async delete(req, res) {
        try {
            const order_id = req.params.id;
            let order = await OrdersHelper.findById({ _id:order_id });
            if (!order) {
                throw NOT_FOUND; 
            }
            order = await OrdersHelper.delete(
                {   
                    _id:order_id
                }
            );    
            res.sendSuccess(order);
        } catch (error) {
            console.log(error);
            res.sendError(error, req.header('languageId'));
        }
    }



}

module.exports = OrdersController;
