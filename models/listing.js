const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String, 
        required: true
    },
    description: String,
    image: {
        filename: String,
        url: {
            type: String,
            default: "https://pixabay.com/photos/mountains-lake-house-lake-house-1587287/",
            set: (v) => v === "" ? "https://pixabay.com/photos/mountains-lake-house-lake-house-1587287/" : v,
        },
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
});

listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;