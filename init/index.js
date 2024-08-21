const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const MONGO_URL = process.env.ATLASDB_URL;

main().then(() => {
    console.log("Connected to DB");
}).catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
};

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj, 
        owner: "66bf20999f16ac4ddba5e611"
    }));
    await Listing.insertMany(initData.data);
    console.log("Data was intialized");
};
initDB();