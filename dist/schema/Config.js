import mongoose from "mongoose";
const configSchema = new mongoose.Schema({
    discriminator: {
        default: "only-config",
        type: String
    },
    subs: [{
            username: String,
            amount: String
        }],
    try: String
});
const Config = mongoose.model("config", configSchema);
export default Config;
