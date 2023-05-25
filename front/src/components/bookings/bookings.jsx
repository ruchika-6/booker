import dateFormat from "dateformat";
import "./bookings.css";

const Bookings = ({item}) => {

return (
    <div className="bookings">
        <div className="bContainer">
        <div className="bItems">
            <img src={item.photo} alt="" className="bImg" />
            <div className="bDetails">
                <div className="bTitle">{item.name}</div>
                <div>{dateFormat(item.startDate,"mmmm d,yyyy")} to {dateFormat(item.endDate,"mmmm d,yyyy")}</div>
                <div className="bCity">{item.city}</div>
                <div>&#8377;{item.price}</div>
            </div>
        </div>
        </div>
    </div>
  );
};

export default Bookings;
