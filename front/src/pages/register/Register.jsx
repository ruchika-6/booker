import { useContext, useState } from "react"
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {GoogleLoginButton} from "react-social-login-buttons";
import {LoginSocialGoogle} from "reactjs-social-login"
import OtpInput from "react-otp-input";
import "./Register.css"

const Register = ()=>{
    const[credentials, setCredentials] = useState({});
    const [file, setFile] = useState("");
    const [openOtp,setOpenOtp] = useState(false);
    const [otp,setOtp] = useState("");
    const [data,setData] = useState("");

    const{loading,error,dispatch} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e)=>{
        setCredentials((prev)=>({...prev, [e.target.id]:e.target.value}))
    }

    const handleClick = async (e)=>{
        e.preventDefault() //Otherwise it will refresh the page
        const data = new FormData();
        data.append("file",file);
        data.append("upload_preset","upload");
        
        dispatch({type:"LOGIN_START"});
        try{
            if(!credentials.username || !credentials.email || !credentials.password || !credentials.phone || !credentials.country || !credentials.city)
            {
                dispatch({type:"LOGIN_FAILURE", payload:"Enter Credentials"})
                return
            }

            let newUser = {
                ...credentials,
            };
            if(file)
            {
                const uploadRes = await axios.post("https://api.cloudinary.com/v1_1/drfoxrlaf/image/upload",data);
                const {url} = uploadRes.data;

                newUser = {
                    ...credentials,
                    img: url,
                };
            }

            const {data} = await axios.post("/api/auth/register",newUser)
            setData(data);
            setOpenOtp(true);
        }catch(err){
            dispatch({type:"LOGIN_FAILURE",payload:err.response.data})
        }
    }

    const resendOtp = async ()=>{
        try {
            const res = await axios.post("/api/auth/resendOtp",data.data)
            setData(res.data);
        } catch (error) {
            console.log(error)
        }
    }

    const verifyOtp = async ()=>{
        const otpInfo = {
            userId: data.data.userId,
            otp:otp
        }

        try{
            await axios.post("/api/auth/verifyOtp",otpInfo)
            let newUser = {
                ...credentials,
            };
            const res = await axios.post("/api/auth/login",newUser)
            dispatch({type:"LOGIN_SUCCESS", payload:res.data.details})
            navigate("/");
        }
        catch(err)
        {
            dispatch({type:"LOGIN_FAILURE",payload:err.response.data})
        }
    }

    return (
        <div className="login">
            {
                !openOtp && 
                <div className="lContainer">
                    <label htmlFor="file">
                        <img
                        src={
                            file
                            ? URL.createObjectURL(file)
                            : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                        }
                        alt=""
                        className="lImage"
                        />
                    </label>
                    <input
                    type="file"
                    id="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    style={{ display: "none" }}
                    />
                    <input type="text" className="lInput" onChange={handleChange} id="username" placeholder="Username" required/>
                    <input type="email" className="lInput" onChange={handleChange} id="email" placeholder="Email" required/>
                    <input type="password" className="lInput" onChange={handleChange} id="password" placeholder="Password" required/>
                    <input type="phone" className="lInput" onChange={handleChange} id="phone" placeholder="Phone" required/>
                    <input type="country" className="lInput" onChange={handleChange} id="country" placeholder="Country" required/>
                    <input type="city" className="lInput" onChange={handleChange} id="city" placeholder="City" required/>
                    <button disabled={loading} onClick={handleClick} className="lButton">Register</button>
                    {error &&
                        <span className="error">{error}</span>
                    }
                    OR
                    <LoginSocialGoogle
                        client_id={"851019704682-6g4hvpgnk9pp68kjrohl0l6mmrdmssj6.apps.googleusercontent.com"}
                        scope="openid profile email"
                        discoveryDocs="claims_supported"
                        access_type="offline"
                        onResolve={async ({ provider, data }) => {
                            console.log(data)
                            const newUser = {
                                username : data.name,
                                email: data.email,
                                img: data.picture,
                            };
                                const res = await axios.post("/api/auth/google",newUser)
                                dispatch({type:"LOGIN_SUCCESS", payload:res.data.details})
                                navigate("/");  
                        }}
                        onReject={(err) => {
                        console.log(err);
                        }}
                    >
                        <GoogleLoginButton/>
                    </LoginSocialGoogle>
                    <div className="ltext">Already have an account?</div>
                    <button disabled={loading} onClick={()=>navigate("/login")} className="lButton">Login</button>
                </div>
            }
            {
                openOtp && 
                <div className="lContainer">
                    <p>Enter OTP sent to your email</p>
                    <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={4}
                        inputStyle="otpInput"
                        renderSeparator={<span></span>}
                        renderInput={(props) => <input {...props} />}
                    />
                    <button className="lButton" onClick={verifyOtp}>Verify</button>
                    <span style={{
                        fontSize: "12px",
                        cursor: "pointer"
                    }} onClick={resendOtp}>Resend OTP</span>
                    {error &&
                        <span className="error">{error}</span>
                    }
                </div>
            }
        </div>
    )
}

export default Register;