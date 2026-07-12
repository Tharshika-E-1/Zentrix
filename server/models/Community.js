import mongoose from "mongoose";

const communitySchema = new mongoose.Schema(
{
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },

    userName:String,

    image:String,

    prompt:String,

    likes:{
        type:Number,
        default:0
    }
},
{
    timestamps:true
});

export default mongoose.model("Community",communitySchema);