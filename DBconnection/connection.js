import mongoose from "mongoose"; 

async function connectToDatabase(url){
    return mongoose.connect(url);
}

export default connectToDatabase;