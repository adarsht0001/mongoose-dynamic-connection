import mongoose, { Schema } from "mongoose";

export const postSchema = new Schema({
    name: { type: String },
});

const post = mongoose.model("post", postSchema);
export default post;
