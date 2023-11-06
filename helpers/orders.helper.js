const OrdersModel = require('../models/orders/orders.model.js');
const ObjectId = require('mongoose').Types.ObjectId;
const { INVALID_STATUS_FLAG, GROUP_NOT_FOUND } = require('../errorDefinition/errors.map.js');
const mongoose = require('mongoose');
const randomstring = require("randomstring");

class Orders {
    static async create(order) {
        try {
            const code = randomstring.generate({
                charset: "numeric",
                length: 6,
              });
              order.code = code;
            const result = await OrdersModel.create(order);
            return result;
        } catch (error) {
            console.log(error);

            throw error
        }
    }

    static async getOrders({
        sort,
        order,
        filter,
        // fromDate,
        // toDate,
        pageSize,
        page,

    }) {
        try {
            sort = sort || 'created_at';
            order = order || 'desc';
            filter = filter || '';
            pageSize = parseInt(pageSize) || 100
            page = page || 1;
            const startIndex = (page - 1) * pageSize;            

            
            
            // let aggregateQuery = { display: 1, status_flag : 'approved', company_tag: { $ne: 'TH' } }
            let aggregateQuery = {  }

            let query = OrdersModel.aggregate()

            .match(aggregateQuery);
            
            console.log(query);

            // Date
            // if (fromDate && toDate) {
            //     query.match({
            //         expiry_date: {
            //             $lte: new Date(toDate),
            //             $gte: new Date(fromDate)
            //         }
            //     });
            // }

            // if (statusFlag) {
            //     query.match({
            //         status : statusFlag
            //     });
            // }


            // //filter        
            if (filter) {
                query.match({
                    $or: [{
                        status: {
                            $regex: `${filter}`,
                            $options: 'xi'
                        }
                    },
                    {
                        description: {
                            $regex: filter,
                            $options: 'xi'
                        }
                    }
                    ]
                });
            }
            query.project({
                order_id: true,
                code: true,
                description: true,
                status: true,
                // vessel: true,
                // origin_port: true,
                // destination_port: true,
                // status: true,
                // departure_date: true,
                // arrival_date: true,
                // created_at: true,
                // updated_at: true,
            }).limit(parseInt(pageSize));
            // sort
            query.sort({
                    [sort]: order
                })
//                 .group({
//                     _id: null,
// news: {
//                         $push: '$$ROOT'
//                     }
//                 })

            let result = await query;

            if (result.length < 1) {
                return result;
            }
            return result;
            
        } catch (error) {
            throw error;
        }
    }

   
}

module.exports = Orders;
