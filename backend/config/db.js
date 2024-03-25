const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb+srv://jojosehrawat21:2nb82EUacxSpf9T7@cluster0.r4yw3jl.mongodb.net/Talkative");
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch(error){
        console.log(`Error: ${error.message}`);
    }
}

module.exports = {
    connectDB
}