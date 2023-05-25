import { useContext } from "react";
import { useState } from "react";
import axios from "axios";
import "./update.css";
import { AuthContext } from "../../context/authContext";

const Update = () => {
    const {user} = useContext(AuthContext);
    const[credentials, setCredentials] = useState({});
    const [file, setFile] = useState("");

    const{loading,dispatch} = useContext(AuthContext);

    const handleChange = (e)=>{
        setCredentials((prev)=>({...prev, [e.target.id]:e.target.value}))
    }

    const handleClick = async (e)=>{
        e.preventDefault() //Otherwise it will refresh the page
        const data = new FormData();
        data.append("file",file);
        data.append("upload_preset","upload");

        try{
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

            const res = await axios.put(`/users/${user._id}`,newUser)
            console.log(res.data);
            dispatch({type:"LOGIN_SUCCESS", payload:res.data})
            alert("Updated Successfully");

        }catch(err){
            console.log(err);
            alert("Oops! There is something wrong")
        }
    }

  return (
    <div className="update">
      <div className="uContainer">
        <div className="uImg">
            <label htmlFor="file">
                <img
                src={
                    file
                    ? URL.createObjectURL(file)
                    : user.img || "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                }
                alt=""
                className="uImage"
                />
            </label>
            <input
                type="file"
                id="file"
                onChange={(e) => setFile(e.target.files[0])}
                style={{ display: "none" }}
            />
        </div>
        <div className="uItem">
            <div className="uDesc">
                <div className="uIteml">
                    <div className="uCell">
                        <div className="uText">Username</div>
                        <input type="text" className="uInput" onChange={handleChange} id="username" placeholder={user.username} required/>
                    </div>
                    <div className="uCell">
                        <div className="uText">Phone</div>
                        <input type="phone" className="uInput" onChange={handleChange} id="phone" placeholder={user.phone} required/>
                    </div>  
                </div>
                <div className="uItemr">
                <div className="uCell">
                        <div className="uText">Country</div>
                        <input type="country" className="uInput" onChange={handleChange} id="country" placeholder={user.country} required/>
                    </div>
                    <div className="uCell">
                        <div className="uText">City</div>
                        <input type="city" className="uInput" onChange={handleChange} id="city" placeholder={user.city} required/>
                    </div>
                </div>
            </div>
            <div className="uBtn">
                <button disabled={loading} onClick={handleClick} className="uButton">Update</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Update;