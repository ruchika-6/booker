import mongoose from "mongoose";

const SubscriberSchema = new mongoose.Schema(
    {
        email:{
            type: String,
            require: true,
            unique: true
        },
    },
    {timestamps: true}
);

const Subscriber = mongoose.model("Subscriber", SubscriberSchema);
export default Subscriber;