import { useContext } from "react";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import "./profile.css";
import { AuthContext } from "../../context/authContext";
import Bookings from "../../components/bookings/bookings";
import Update from "../../components/update/update"
import { useLocation } from "react-router-dom";

const Profile = () => {
    const {user} = useContext(AuthContext);
    const location = useLocation();
    const bookings = location.state.bookings;

  return (
    <div className="profile">
      <Navbar />
      <Header type="list"/>
      <div className="pContainer">
        <div className="pWrap">
          {
            !bookings? <Update/>
            : (
              <> 
                  <h1>Your Bookings</h1> 
                <div className="listResult">
                  {[...user.bookings].reverse().map(item =>(                  
                      <Bookings item={item}/>                
                  ))}
                </div>
              </>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Profile;