import mongoose from "mongoose"; 
import { seedZookeeper } from "../Zookeeper/zookeeper.js";
async function connectToDatabase(url){
    return mongoose.connect(url)
    .then(() => {
        console.log("Connected to DB");
        return seedZookeeper();
    })
    .catch(console.error);;
}
export default connectToDatabase;