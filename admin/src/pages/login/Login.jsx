import { useContext, useState } from "react"
import "./login.scss"
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ()=>{
    const[credentials, setCredentials] = useState({
        email: undefined,
        password: undefined
    });

    const{loading,error,authDispatch} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e)=>{
        setCredentials((prev)=>({...prev, [e.target.id]:e.target.value}))
    }

    const handleClick = async (e)=>{
        e.preventDefault() //Otherwise it will refresh the page
        authDispatch({type:"LOGIN_START"});
        try{
            const res = await axios.post("/auth/login",credentials)
            if(res.data.isAdmin)
            {
                authDispatch({type:"LOGIN_SUCCESS", payload:res.data.details})
              navigate("/");
            }else{
                authDispatch({type:"LOGIN_FAILURE",payload:"You are not allowed"})
            }
        }catch(err){
            authDispatch({type:"LOGIN_FAILURE",payload:err.response.data})
        }
    }

    return (
        <div className="login">
            <div className="lContainer">
                <input type="email" className="lInput" onChange={handleChange} id="email" placeholder="Email"/>
                <input type="password" className="lInput" onChange={handleChange} id="password" placeholder="Password"/>
                <button disabled={loading} onClick={handleClick} className="lButton">Login</button>
                {error &&
                    <span className="error">{error}</span>
                }
                {/* <div className="ltext">Don't have an account?</div>
                <button disabled={loading} onClick={()=>navigate("/register")} className="lButton">Register</button> */}
            </div>
        </div>
    )
}

export default Login;