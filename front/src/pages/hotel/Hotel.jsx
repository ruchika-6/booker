import "./hotel.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { SearchContext } from "../../context/searchContext";
import { AuthContext } from "../../context/authContext";
import Reserve from "../../components/reserve/reserve";

const Hotel = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [openModel, setOpenModel] = useState(false);

  const {data,loading,error} = useFetch(`/hotels/find/${id}`)

  const{ date,options } = useContext(SearchContext);
  const {user} = useContext(AuthContext)
  const navigate = useNavigate();


  const ms_per_day = 1000*60*60*24;
  function dayDifference(date1,date2)
  {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const dayDiff = Math.ceil(timeDiff/ms_per_day);
    return Math.max(1,dayDiff);
  }
  const days = dayDifference(date[0].startDate,date[0].endDate)
  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };


  const handleMove = (direction) => {
    let newSlideNumber;

    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? data.photos.length-1 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === data.photos.length-1 ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber)
  };

  const handleClick = ()=>{
    if(user)
    {
      setOpenModel(true);
    }
    else
    {
      navigate("/login")
    }
  }

  return (
    <div className="hotel">
      <Navbar />
      <Header type="list" />
      {loading?("Loading Please Wait")
      : (
      <div className="hotelContainer">
        {open && (
          <div className="slider">
            <FontAwesomeIcon
              icon={faCircleXmark}
              className="close"
              onClick={() => setOpen(false)}
            />
            <FontAwesomeIcon
              icon={faCircleArrowLeft}
              className="arrow"
              onClick={() => handleMove("l")}
            />
            <div className="sliderWrapper">
              <img src={data.photos[slideNumber]} alt="" className="sliderImg" />
            </div>
            <FontAwesomeIcon
              icon={faCircleArrowRight}
              className="arrow"
              onClick={() => handleMove("r")}
            />
          </div>
        )}
        <div className="hotelWrapper">
          <button onClick={handleClick} className="bookNow">Reserve or Book Now!</button>
          <h1 className="hotelTitle">{data.name}</h1>
          <div className="hotelAddress">
            <FontAwesomeIcon icon={faLocationDot} />
            <span>{data.address}</span>
          </div>
          <span className="hotelDistance">
            Excellent location – {data.distance}m from center
          </span>
          <span className="hotelPriceHighlight">
            Book a stay over &#8377;{data.cheapestPrice} at this property and get a free airport taxi
          </span>
          <div className="hotelImages">
            {data.photos?.map((photo, i) => (
              <div className="hotelImgWrapper" key={i}>
                <img
                  onClick={() => handleOpen(i)}
                  src={photo}
                  alt=""
                  className="hotelImg"
                />
              </div>
            ))}
          </div>
          <div className="hotelDetails">
            <div className="hotelDetailsTexts">
              <h1 className="hotelTitle">{data.title}</h1>
              <p className="hotelDesc">
                {/* Located a 5-minute walk from St. Florian's Gate in Krakow, Tower
                Street Apartments has accommodations with air conditioning and
                free WiFi. The units come with hardwood floors and feature a
                fully equipped kitchenette with a microwave, a flat-screen TV,
                and a private bathroom with shower and a hairdryer. A fridge is
                also offered, as well as an electric tea pot and a coffee
                machine. Popular points of interest near the apartment include
                Cloth Hall, Main Market Square and Town Hall Tower. The nearest
                airport is John Paul II International Kraków–Balice, 16.1 km
                from Tower Street Apartments, and the property offers a paid
                airport shuttle service. */}
                {data.desc}
              </p>
            </div>
            <div className="hotelDetailsPrice">
              <h1>Perfect for a {days}-night stay!</h1>
              {data.rating && <span>
                Located in the real heart of Krakow, this property has an
                excellent location score of {data.rating}!
              </span>}
              <h2>
                <b>&#8377;{days*data.cheapestPrice*options.room}</b> ({days} nights)
              </h2>
              <button onClick={handleClick}>Reserve or Book Now!</button>
            </div>
          </div>
        </div>
        <MailList />
        <Footer />
      </div>)}
      {openModel && <Reserve setOpen={setOpenModel} hotelId={id} days = {days} item = {data}/>}
    </div>
  );
};

export default Hotel;
