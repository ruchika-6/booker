import { useContext, useState } from "react"
import "./navbar.css"
import {Link, useNavigate} from "react-router-dom"
import { AuthContext } from "../../context/authContext";

const Navbar = () => {
  const [open,setOpen] = useState(false);
  const {user,loading,error,dispatch} = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = ()=>{
    // e.preventDefault() //Otherwise it will refresh the page
      dispatch({type:"LOGOUT"});
      navigate("/");
  }

  const handleLogin = ()=>{
      navigate("/login")
  }

  const handleRegister = ()=>{
      navigate("/register")
  }

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" style={{color:"inherit", textDecoration:"none"}}>
          <span className="logo">booker</span>
        </Link>
          {user? (
            <div className="navItems">
              <img src={user.img || "http://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon"} alt="" onClick={()=>setOpen(!open)} className="profilePic" />
              {/* <span className="account">{user.username}</span> */}
              {
                // open && 
                <div className={open? "open" : "close"}>
                    <button onClick={()=>navigate("/profile",{state:{bookings:false}})} className="navButton">Profile</button>
                    <button onClick={()=>navigate("/profile",{state:{bookings:true}})} className="navButton">Bookings</button>
                </div>
              }
              <button onClick={handleLogout} className="navButton">Logout</button>
            </div>
          )
          :(
            <div className="navItems">
              <button onClick={handleRegister} className="navButton">Register</button>
              <button onClick={handleLogin} className="navButton">Login</button>
            </div>
          )}
      </div>
    </div>
  )
}

export default Navbar