import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import { useLocation } from "react-router-dom";
import dateFormat from "dateformat";
import "./checkout.css";
import axios from "axios";
import { useContext, useState } from "react";
import { SearchContext } from "../../context/searchContext";
import { AuthContext } from "../../context/authContext";

function loadScript(src) {
	return new Promise((resolve) => {
		const script = document.createElement('script')
		script.src = src
		script.onload = () => {
			resolve(true)
		}
		script.onerror = () => {
			resolve(false)
		}
		document.body.appendChild(script)
	})
}

const Checkout = () => {

    const location = useLocation();
    const state = location.state;
    const item = state.item;
    const selectedRooms = state.selectedRooms;
    const allDates = state.allDates;

    const [open,setOpen] = useState(false);

    const {date,options} = useContext(SearchContext);
    const{user,dispatch} = useContext(AuthContext);

    const toSend = {
        bookings:{
            name: item.name,
            startDate:date[0].startDate,
            endDate:date[0].endDate,
            city:item.city,
            photo:item.photos[0],
            price:state.price*state.days
        },
        email:user.email
    }

    const updateUser = async () =>{

        try {
            await Promise.all(selectedRooms.map((roomId)=>{
                const res = axios.put(`/api/rooms/availability/${roomId}`,
                {dates:allDates,
                });
                return res.data
            })
            );

            try {
                const res = await axios.put(`/api/users/bookings/${user._id}`, toSend)
                dispatch({type:"LOGIN_SUCCESS", payload:res.data});
                setOpen(true);
            } catch (error) {
                console.log(error);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleClick = async ()=>{
        try{
            displayRazorpay();     
            // setOpen(false)
        }catch(err){
            console.log(err);
        }
    }

    async function displayRazorpay() {
		const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

		if (!res) {
			alert('Razorpay SDK failed to load. Are you online?')
			return
		}

		const data = await axios.post(`/api/razorpay/${state.price*state.days}`);

		console.log(data)

		const options = {
			key: 'rzp_test_mMCa9RkEASNIRF',
			currency: 'INR',
			amount: `${state.price*100*state.days}`,
			order_id: data.id,
			name: 'Hotel Booking',
			description: 'Thank you for nothing. Please give us some money',
			image: 'http://res.cloudinary.com/drfoxrlaf/image/upload/v1683899275/upload/vyfqgnrmk9ly6x1hpc8k.jpg',
			handler: function (response) {
				alert(response.razorpay_payment_id)
				alert(response.razorpay_order_id)
				alert(response.razorpay_signature)
                updateUser();
			},
			prefill: {
				name:user.username,
				email: user.email,
				phone_number: user.phone || '9899999999'
			}
		}
		const paymentObject = new window.Razorpay(options)
		paymentObject.open()
	}

  return (
    <div className="checkout">
    <Navbar />
    <Header type="list"/>
    <div className="wrap">
    {
        open && <h1>Your Booking has been confirmed!</h1>
    }
    {
        !open && 
        <div className="cContainer">
        <div className="left">
            <h2>Your Booking Details</h2>
            <div className="leftItem">
                <div className="title">Check-in: <div>{dateFormat(date[0].startDate,"mmmm d,yyyy")}</div></div>           
                <div className="title">Check-out: <div>{dateFormat(date[0].endDate,"mmmm d,yyyy")}</div></div>
            </div>
            <hr />
            <div className="leftItem">
                <div className="title">Total length of stay: </div>
                <div>{state.days} nights</div>
            </div>
            {/* <div className="leftItem">
                <div className="title">You selected:</div>
                <div>Deluxe Room</div>
            </div> */}
            <div className="leftItem">
                <div className="title">Sleeps:</div>
                <div className="liOptions">{options.adult} adults 
                {options.children>0 && <span>{options.children} children</span>}
                </div>
            </div>
            <div className="leftItem">
                <div className="title">Rooms:</div>
                <div>{options.room}</div>
            </div>
            <hr />
            <div className="leftItem">
                <div className="comment">This should be a great fit!</div>
            </div>
            <h2>Your Price Summary</h2>
            <div className="leftItem">
                <span><h1>Price</h1></span>
                <span><h1>&#8377;{state.price*state.days}</h1></span>
            </div>
            <button onClick={handleClick} className="cButton">Checkout</button>
        </div>
        <div className="right">
            <div className="SearchItem">
                <img
                    src={item.photos[0]}
                    className="riImg"
                />
                <div className="siDesc">
                    <div className="riTitle">
                        <h1 className="siTitle">{item.name}</h1>
                        {item.rating && 
                        <button>{item.rating}</button>}
                    </div>
                    <span className="riDistance">{item.distance}</span>
                    <span className="riSubtitle">
                    Studio Apartment with Air conditioning
                    </span>
                    <span className="riFeatures">
                    {item.desc}
                    </span>
                    <span className="riCancelOp">Free cancellation </span>
                </div>
            </div>
        </div>
        </div>
        }
      </div>
    </div>
  );
};

export default Checkout;