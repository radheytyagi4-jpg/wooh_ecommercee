import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    uploadedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    orderedby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        required:true,
        env:["Pending", "Cancel", "Delivered"],
        default:"Pending"
    }
})

export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema)