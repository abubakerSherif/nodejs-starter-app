const mongoose = require('mongoose');
const db = require('../../databases/development.database');
const mongooseSoftDelete = require('mongoose-delete');

const OrderSchema = new mongoose.Schema({
    order_id: {
        type: String
    },
    code: {
        type: String
    },
    description: {
        type: String
    },
    status: {
        type: String,
        default: 'scheduled'
    },
    updated_by: String,
    created_by: String,
},{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// OrderSchema.pre('save', function(next) {
//     !this.created_by ? this.created_by = currentUser.uid : null;
//     this.updated_by = currentUser.uid;
//     !this.order_id ? this.order_id = this._id : null;
//     next();
// });
   

OrderSchema.plugin(mongooseSoftDelete, {
    overrideMethods: 'all'
});

module.exports  = db.model('orders', OrderSchema);