import Zookeeper from "../models/zookeeper.js";

export async function getZooNumber() {
    try {
        const zookeeper = await Zookeeper.findOne();
        if (!zookeeper || zookeeper.ranges.length === 0) {
            throw new Error("No ranges found in the database.");
        }
        const randomIndex = Math.floor(Math.random() * zookeeper.ranges.length);
        const randomRange = zookeeper.ranges[randomIndex];
        const currentStart = randomRange.start;
        await Zookeeper.updateOne(
            {},
            { $set: { [`ranges.${randomIndex}.start`]: currentStart + 1 } }
        );
        return currentStart;
    } catch (error) {
        throw error;
    }
}
