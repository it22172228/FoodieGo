const mongoose=require("mongoose");

let connection;
const connectDB=async()=>{
    try{
        connection=await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB Successfully");
    }catch(error){
        console.log("Error Connecting to MongoDB:${error}");
    }
}

module.exports=connectDB;