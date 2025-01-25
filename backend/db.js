const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const mongoURL = process.env.MONGODB_URL; 
// const mongoURL = process.env.MONGODB_URL_LOCAL; 
console.log("MongoDB URL:", process.env.MONGODB_URL);

mongoose.connect(mongoURL);
const db = mongoose.connection;

//optional... (below stuff)
db.on("error", () => { console.log("Error connecting to the database"); });
db.on("connected", () => { console.log("Connected to the database"); });
db.on("disconnected", () => { console.log("Disconnected from the database"); });

module.exports = db;
