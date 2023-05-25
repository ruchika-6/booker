import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            require: true,
        },
        desc:{
            type: String,
            require: true,
        },
        price:{
            type: Number,
            require: true,
        },
        capacity:{
            type: Number,
            require: true
        },
        roomNumbers: [{number: Number, unavailableDates: {type: [Date]}}]
    },
    {timestamps: true}
);

const room = mongoose.model("Room", RoomSchema);
export default room;