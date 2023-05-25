import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            require: true,
        },
        email:{
            type: String,
            require: true,
            unique: true
        },
        country:{
            type: String,
            require: true
        },
        img:{
            type: String,
        },
        city:{
            type: String,
            require: true
        },
        phone:{
            type: String,
            require: true
        },
        password:{
            type: String,
            require: true
        },
        isAdmin:{
            type: Boolean,
            default: false,
        },
        bookings:{
            type:[Object]
        }
    },
    {timestamps: true}
);

const user = mongoose.model("User", UserSchema);
export default user;