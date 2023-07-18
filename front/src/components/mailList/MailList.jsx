import { useState } from "react"
import "./mailList.css"
import axios from "axios"

const MailList = () => {
  const [emails,setEmails] = useState({
    email:undefined,
  })

  const [open,setOpen] = useState(false)

  const [text,setText] = useState(undefined)

  const handleChange = (e)=>{
    setEmails((prev)=>({...prev, [e.target.id]:e.target.value}))
  }

  const handleClick = async (e)=>{
    // e.preventDefault();
    try{
      if(!emails.email)
      {
        setText("Enter Email");
        setOpen(true);
        return;
      }
      const res = await axios.post("/api/subscribe",emails)
      setText("Thank You for Subscribing!");
      setOpen(true);
    }catch(err){
      setText("You are already subscribed")
      setOpen(true);
    }
  }

  return (
    <div className="mail">
      <h1 className="mailTitle">Save time, save money!</h1>
      <span className="mailDesc">Sign up and we'll send the best deals to you</span>
      <div className="mailInputContainer">
        <input type="text" onChange={handleChange} placeholder="Your Email" id="email"/>
        <button onClick={handleClick}>Subscribe</button>
        {open && <div className="subText">{text}</div>}
      </div>
    </div>
  )
}

export default MailList