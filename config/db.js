// const config = require('config');
const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        console.log("Mongodb Connected");
        await mongoose.connect( db);
        // console.log(db);
    } catch(err) {
        console.error(err.message);
        //exit process with failure
        process.exit(1);

    }
}
module.exports = connectDB;

