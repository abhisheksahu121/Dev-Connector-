// const config = require('config');
const mongoose = require('mongoose');
const config = require('config');
const Pro = require('../routes/api/profile');
const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        console.log("Mongodb Connected");
        await mongoose.connect( db);
        Pro.propfind(function(err,pro)
{
    if(err) console.log(err);
    console.log(pro);
})
        // console.log(db);
    } catch(err) {
        console.error(err.message);
        //exit process with failure
        process.exit(1);

    }
}
module.exports = connectDB;

