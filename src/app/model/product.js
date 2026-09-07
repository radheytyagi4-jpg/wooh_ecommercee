import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    title:{
    type:String,
    required:true,
    },
    detail:{
        type:String,
        required:true
    },
    uploadBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    price:{
        type:Number,
        required:true
    }
});


export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);