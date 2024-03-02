const express = require("express");
const app= express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");


const listing = require("./routes/listing.js");
const review = require("./routes/review.js");

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main().then(() => {
    console.log("Connected to DB");
}).catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My Home",
//         description: "This is my home.",
//         price: 500000,
//         location: "Bhubaneswar",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("Successfull");
// });

app.use("/listings", listing);
app.use("/listings/:id/reviews", review);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not fuound"));
});

app.use((err, req, res, next) => {
    let {statusCode=500, message="Something went wrong"} = err;
    res.status(statusCode).render("listings/error.ejs", {message});
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});