import mongoose from "mongoose"

const rangeSchema = mongoose.Schema({
    start: {
        type: Number,
        required: true
    },
    end: {
        type: Number,
        required: true
    }
});

const zookeeperSchema = new mongoose.Schema({
    ranges: {
        type: [rangeSchema],
        required: true,
    }
});

const Zookeeper = mongoose.model('Zookeeper', zookeeperSchema);

export default Zookeeper;
