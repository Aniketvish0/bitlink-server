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

export async function seedZookeeper() {
  try{
    const existing = await Zookeeper.findOne();
    if (!existing) {
        const newZookeeper = new Zookeeper({
            ranges: [
                { start: 262144, end: 400000 },
                { start: 400001, end: 600000 },
                { start: 600001, end: 800000 },
                { start: 800001, end: 1000000 },
            ],
        });
        await newZookeeper.save();
        console.log("Zookeeper seeded with default ranges.");
    }
    } catch (error) {
          throw Error("Something wrong in seeding Zookeeper , error" + error);
    }    
}