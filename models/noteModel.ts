import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    }
},
{timestamps: true});

const Note = mongoose.models.notes || mongoose.model("notes", NoteSchema);

export default Note;