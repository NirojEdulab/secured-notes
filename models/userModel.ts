import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    picture: {
        type: String,
        required: true
    },
    stripeCustomerId:{
        type: String,
        unique: true
    },
    colorScheme:{
        type: String,
        default: "theme-orange"
    }
},
{timestamps: true});

const User = mongoose.models.users || mongoose.model("users", UserSchema);

export default User;