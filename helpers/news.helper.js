const NewsModel = require('../models/news/news.model.js');
const ObjectId = require('mongoose').Types.ObjectId;
const { INVALID_STATUS_FLAG, GROUP_NOT_FOUND } = require('../errorDefinition/errors.map');
const mongoose = require('mongoose');

class News {
    

    static async update({
        _id,
        item
    }) {
        try {
            // if (item.status_flag !== 'approved' && item.status_flag !== 'pending') {
            //     throw INVALID_STATUS_FLAG;
            // }
    
            const result = await ItemModel.findOneAndUpdate({_id: _id}, { $set: item}, {returnNewDocument: true});
            return result;
        } catch (error) {  
            throw error;
        }
    }


    static async create(item) {
        try {
            const result = await NewsModel.create(item);
            return result;
        } catch (error) {
            throw error
        }
    }

    static async getItems({
        sort,
        order,
        filter,
        // fromDate,
        // toDate,
        // statusFlag,
        pageSize,
        // companyTag,
        page,
        clientKey
    }) {
        try {
            sort = sort || 'created_at';
            order = order || 'desc';
            filter = filter || '';
            // statusFlag = statusFlag || 'published';
            pageSize = parseInt(pageSize) || 100
            // companyTag = companyTag || '';
            page = page || 1;
            const startIndex = (page - 1) * pageSize;            

            
            
            // let aggregateQuery = { display: 1, status_flag : 'approved', company_tag: { $ne: 'TH' } }
            let aggregateQuery = {  }

            let query = NewsModel.aggregate()
            

            .match(aggregateQuery);
            

            // // Date
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
                        title: {
                            $regex: `${filter}`,
                            $options: 'xi'
                        }
                    },
                    {
                        body: {
                            $regex: filter,
                            $options: 'xi'
                        }
                    }
                    ]
                });
            }

            query.project({
                news_id: true,
                body: true,
                title: true,
                image_url: true,
                status: true,
                created_at: true,
                updated_at: true,
            }).limit(parseInt(pageSize));
            // sort
            query.sort({
                    [sort]: order
                })

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

module.exports = News;
