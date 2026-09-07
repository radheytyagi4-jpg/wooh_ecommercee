import mongoose from "mongoose"

async function connectDb(){

    if(mongoose.connection.readyState === 1){
    console.log("db is already connected");
    return;
}

    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("db successfully connected");
    } catch(error){
        console.log("error while connecting to db : ", error )
    }
}

mongoose.connection.on('connected', () => console.log('Mongoose connected'));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));

export { connectDb }