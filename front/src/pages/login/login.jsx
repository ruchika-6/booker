import { useContext, useState } from "react"
import "./login.css"
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {GoogleLoginButton} from "react-social-login-buttons";
import {LoginSocialGoogle} from "reactjs-social-login"

const Login = ()=>{
    const[credentials, setCredentials] = useState({
        email: undefined,
        password: undefined
    });

    const{loading,error,dispatch} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e)=>{
        setCredentials((prev)=>({...prev, [e.target.id]:e.target.value}))
    }

    const handleClick = async (e)=>{
        e.preventDefault() //Otherwise it will refresh the page
        dispatch({type:"LOGIN_START"});
        try{
            const res = await axios.post("/api/auth/login",credentials)
            dispatch({type:"LOGIN_SUCCESS", payload:res.data.details})
            navigate("/");
        }catch(err){
            dispatch({type:"LOGIN_FAILURE",payload:err.response.data})
        }
    }

    return (
        <div className="login">
            <div className="lContainer">
                <input type="email" className="lInput" onChange={handleChange} id="email" placeholder="Email"/>
                <input type="password" className="lInput" onChange={handleChange} id="password" placeholder="Password"/>
                <button disabled={loading} onClick={handleClick} className="lButton">Login</button>
                {/* <span style={{fontSize:"12px", cursor:"pointer", color:"red", marginBottom:"10px"}}>Forgot Password?</span> */}
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
                <div className="ltext">Don't have an account?</div>
                <button disabled={loading} onClick={()=>navigate("/register")} className="lButton">Register</button>
            </div>
        </div>
    )
}

export default Login;