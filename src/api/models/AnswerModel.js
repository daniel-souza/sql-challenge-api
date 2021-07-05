import mongoose from 'mongoose';

const AsnwerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    challenge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Challenge",
        required: true
    },
    hits: [String]
}, {
    timestamps: true
});

export default mongoose.model("Answer", AsnwerSchema);