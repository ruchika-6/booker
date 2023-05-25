import React, { useContext, useState } from "react";
import "./reserve.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import useFetch from "../../hooks/useFetch";
import { SearchContext } from "../../context/searchContext";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
// import { DateRange } from "react-date-range";

const Reserve = ({setOpen,hotelId,days,item})=>{

    const [selectedRooms,setSelectedRooms] = useState([])
    const [rooms,setRooms] = useState(0);
    const [price,setPrice] = useState(0);

    const {data,loading,error} = useFetch(`/hotels/room/${hotelId}`)
    const{ date,options } = useContext(SearchContext);
    const {user} = useContext(AuthContext);

    const navigate = useNavigate();

    const getDates = (start,end)=>{
        // const start = new Date(startDate);
        // const end = new Date(endDate);
        const d = new Date(start.getTime());

        let list = []

        while(d<=end)
        {
            list.push(new Date(d).getTime()); //Easier to work with time stamps than dates
            d.setDate(d.getDate() + 1);
        }

        return list;
    }

    const allDates = getDates(date[0].startDate, date[0].endDate)

    const isAvailable = (roomNumber) => {
        const isFound = roomNumber.unavailableDates.some((d) =>
        allDates.includes(new Date(d).getTime()))

        return !isFound;
    }

    const handleSelect = (e,cost)=>{
        const checked = e.target.checked
        const value = e.target.value
        setSelectedRooms(checked ? [...selectedRooms,value] : selectedRooms.filter((item)=>item!==value))
        if(checked)
        {
            setRooms(rooms+1);
            setPrice(price+cost);
        }
        else
        {
            setRooms(rooms-1);
            setPrice(price-cost);
        }
        console.log(price);
    }
    console.log(price);

    return (
        <div className="reserve">
            <div className="rContainer">
                <FontAwesomeIcon icon={faCircleXmark} className="rClose" onClick={()=>setOpen(false)}/>
                <span>Select Your Rooms</span>
                {data.map(item=>(
                    <div className="rItem">
                        <div className="rItemInfo">
                            <div className="rTitle">{item.title}</div>
                            <div className="rDesc">{item.desc}</div>
                            <div className="rMax">Maximum People: <b>{item.capacity}</b></div>
                            <div className="rPrice">&#8377;{item.price}</div>
                        </div>
                        <div className="rSelectRooms">
                            {item.roomNumbers.map(roomNumber=>(
                                <div className="room">
                                    <label>{roomNumber.number}</label>
                                    <input type="checkbox" disabled={!isAvailable(roomNumber) || (rooms == options.room && !selectedRooms.includes(roomNumber._id))} value={roomNumber._id} onChange={(e)=>handleSelect(e,item.price)}/>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
                }
                {/* <button onClick={handleClick} className="rButton">Reserve Now!</button> */}
                <button onClick={()=>{
                    if(!rooms)
                    {
                        alert("Select rooms");
                        return;
                    }
                    navigate("/checkout",{state:{price: price, days:days, item: item, selectedRooms:selectedRooms, allDates:allDates}})
                    }
                    } className="rButton">Reserve Now!</button>
            </div>
        </div>
    )
}

export default Reserve;