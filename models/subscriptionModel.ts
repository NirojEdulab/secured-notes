import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema({
    stripeSubscriptionId: {
        type: String,
        required: true,
        unique: true
    },
    interval: {
        type: String,
    },
    status: {
        type: String,
    },
    planId: {
        type: String,
    },
    currentPeriodStart: {
        type: Number,
    },
    currentPeriodEnd: {
        type: Number,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
},
{timestamps: true});

const Subscription = mongoose.models.subscription || mongoose.model("subscription", SubscriptionSchema);

export default Subscription;