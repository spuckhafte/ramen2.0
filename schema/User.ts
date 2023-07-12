import mongoose from 'mongoose';

const DNumber = {
    type: Number,
    default: 0
}

const userSchema = new mongoose.Schema({
    username: String,
    id: String,
    reminder: {
        mission: DNumber,
        report: DNumber,
        tower: DNumber,
        train: DNumber,
        adventure: DNumber,
        daily: DNumber,
        vote: DNumber,
        weekly: DNumber,
        challenge: DNumber,
        quest: DNumber
    },
    stats: {
        mission: DNumber,
        report: DNumber,
        challenge: DNumber
    },
    extras: {
        defaultChannel: String,
        online: {
            type: Boolean,
            default: false
        },
        early: {
            type: Number,
            default: 0,
        }
    },
    weekly: {
        mission: DNumber,
        report: DNumber,
        challenge: DNumber
    },
    server_specific_stats: {
        server1: {
            id: String,
            name: String,
            stats: {
                mission: DNumber,
                report: DNumber
            }
        },
        server2: {
            id: String,
            name: String,
            stats: {
                mission: DNumber,
                report: DNumber
            }
        },
        server3: {
            id: String,
            name: String,
            stats: {
                mission: DNumber,
                report: DNumber
            }
        }
    },
    blockPings: {
        type: [String],
        default: []
    },

    lastPlayed: {
        mission: String,
        report: String,
        tower: String,
        train: String,
        adventure: String,
        daily: String,
        vote: String,
        weekly: String,
        challenge: String,
        quest: String
    },
});

const User = mongoose.model("user", userSchema);

export default User;