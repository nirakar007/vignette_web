import { Schema, model } from "mongoose";

const MoodBoardSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, default: "" },
        items: [
            {
                type: { type: String, enum: ["image", "text", "color"], required: true },
                content: { type: String, required: true },
                position: { x: Number, y: Number },
            },
        ],
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true } 
);

export default model("MoodBoard", MoodBoardSchema);
