const mongoose = require('mongoose');
const db = require('../../databases/development.database');
const mongooseSoftDelete = require('mongoose-delete');

const ItemSchema = new mongoose.Schema({
    news_id: {
        type: String
    },
    body: {
        type: String
    },
    title: {
        type: String
    },
    image_url: {
        type: String
    },
    status: {
        type: String,
        default: 'published'
    },
    updated_by: String,
    created_by: String,
},{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// ItemSchema.pre('save', function(next) {
//     !this.created_by ? this.created_by = currentUser.uid : null;
//     this.updated_by = currentUser.uid;
//     !this.news_id ? this.news_id = this._id : null;
//     next();
// });
   

ItemSchema.plugin(mongooseSoftDelete, {
    overrideMethods: 'all'
});

module.exports  = db.model('news', ItemSchema);
