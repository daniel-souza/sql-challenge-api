import mongoose from 'mongoose';

const ChallengeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    problem: {
        type: String,
        required: true
    },
    tables: {
        type: String,
        required: true
    },
    explanation: String,
    level: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    category: [{
        name: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

export default mongoose.model("Challenge", ChallengeSchema);