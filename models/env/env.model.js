
const mongoose = require('mongoose');
const db = require('../../databases/development.database');
const mongooseSoftDelete = require('mongoose-delete');

const Schema = new mongoose.Schema(
    {
       config: {
           type: String,
           index: true,
           unique: true,
       },
       last_calculated: Date,
       data: new mongoose.Schema({
           access_token: String,
           expiry_date: Date,
       }, {strict: false, _id: false})
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        collection: 'env',
        useNestedStrict: true,
    }
);

Schema.plugin(mongooseSoftDelete, {
    overrideMethods: 'all'
});

module.exports = db.model('env', Schema);
