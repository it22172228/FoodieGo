const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const CartSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    location:{
        type:String
    },
    price:{
        type:Number,
        required:true
    },
    qty:{
        type:Number,
        required:true
    },
    total:{
        type:Number,
        required:true
    },

});

module.exports=mongoose.model("Cart",CartSchema);