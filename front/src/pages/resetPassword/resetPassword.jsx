import { useState } from "react";

const ResetPassword = ()=>{

    const [email,setEmail] = useState("");
    const [open,setOpen] = useState(false);

    const sendEmail = ()=>{
        
    }

    return (
        <div className="login">
            <div className="lContainer">
                Enter Your Registered Email
                <input type="email" className="lInput" id="email" onClick={(e)=>setEmail(e.target.value)} placeholder="Email"/>
                <button className="lButton">Send email</button>
                {/* {error &&
                    <span className="error">{error}</span>
                } */}
            </div>
        </div>
    )
}

export default ResetPassword;