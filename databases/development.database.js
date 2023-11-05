const mongoose = require('mongoose');

const mongodbURL =
    process.env.MONGODB_URL;
const db = mongoose.createConnection(mongodbURL, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 20000,
    socketTimeoutMS: 20000
});

// mongoose.set('useFindAndModify', false);
module.exports = db;
