import mongoose, { Schema, type Document } from "mongoose";

export interface IChat extends Document {
    participants: mongoose.Schema.Types.ObjectId[];
    lastMessage?: mongoose.Schema.Types.ObjectId;
    lastMessageAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const chatSchema = new Schema<IChat>({
    participants: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        required: true,
    },
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: "Message",
        default: null,
    },
    lastMessageAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

export const Chat = mongoose.model<IChat>("Chat", chatSchema);