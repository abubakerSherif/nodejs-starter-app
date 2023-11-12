const NewsModel = require('../models/news/news.model.js');
const ObjectId = require('mongoose').Types.ObjectId;
const { INVALID_STATUS_FLAG, GROUP_NOT_FOUND } = require('../errorDefinition/errors.map');
const mongoose = require('mongoose');

class News {


    static async findById(_id) {
        let result;
        try {
            result = await NewsModel.findOne({
                _id: _id
            });

            if (result) {
                return result;
            }
            return null;
        } catch (e) {
            throw e;
        }
    }


    static async update({
        _id,
        body,
    }) {
        try {
            const result = await NewsModel.findOneAndUpdate({ _id: _id }, { $set: body }, { returnOriginal: false });
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async delete({
        _id
    }) {
        try {
            const result = await NewsModel.deleteOne({ _id: _id });
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
        bodyFilter,
        statusFilter,
        titleFilter,
        pageSize,
        page,
    }) {
        try {
            sort = sort || 'created_at';
            order = order || 'desc';
            bodyFilter = bodyFilter || ''
            statusFilter = statusFilter || ''
            titleFilter = titleFilter || ''
            pageSize = parseInt(pageSize) || 100
            // companyTag = companyTag || '';
            page = page || 1;
            const startIndex = (page - 1) * pageSize;
            // let aggregateQuery = { display: 1, status_flag : 'approved', company_tag: { $ne: 'TH' } }
            let aggregateQuery = {}

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
            if (bodyFilter) {
                query.match({
                    $or: [{
                        title: {
                            $regex: `${bodyFilter}`,
                            $options: 'xi'
                        }
                    },
                    {
                        body: {
                            $regex: bodyFilter,
                            $options: 'xi'
                        }
                    }
                    ]
                });
            }

            if (statusFilter) {
                query.match({
                    status: {
                        $regex: `${statusFilter}`,
                        $options: 'xi'
                    }
                });
            }

            if (titleFilter) {
                query.match({
                    title: {
                        $regex: `${titleFilter}`,
                        $options: 'xi'
                    }
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
                [sort]: order
            })

            let result = await query;

            if (result.length < 1) {
                return result;
            }
            return result;

        } catch (error) {
            throw error;
        }
    }

}

module.exports = News;
