import mongoose from "mongoose";
const premiumSchema = new mongoose.Schema({
    serverId: String,
    users: [
        {
            userId: String,
            username: String,
            mission: Number,
            report: Number,
            challenge: Number
        }
    ],
    from: Number,
    till: Number,
    mods: [String]
});
const Premium = mongoose.model("premium", premiumSchema);
export default Premium;
