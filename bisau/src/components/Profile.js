import React, { useEffect, useState } from 'react'
import "./profile.css"
import { FaCircleUser } from "react-icons/fa6";
import { useData } from '../context/ObjectContext';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const {data} = useData();
  const [parkingSpots, setParkingSpots] = useState([]);
  const navigator = useNavigate();
  
  const getAllParkingSpots = async () => {
    console.log(data.currentUser.uid)
    var temp = await data.parkingCollection.where('userId', '==', data.currentUser.uid).get();
    
    const tempArr = [];
    temp.forEach(snapshot => {
        tempArr.push(snapshot.data());
    });
    setParkingSpots(tempArr);
  }

  const deleteSpot = async (index) => {
    console.log("to delete is ", index);
  }

  useEffect(()=> {
    getAllParkingSpots();
  }, []);

  return (
    <div className="profile-full">
    <div className="profile-container">
    <div className="profile-header">
        <FaCircleUser size="8em" className="icon-profile" />
    </div>
    <div className="user-details">
        <div className="user-info">
            <h5>User Info</h5>
            <hr />
            <div className="info-item">
                <label>Name:</label>
                <span>Satish Dhakal</span>
            </div>
            <div className="info-item">
                <label>Email:</label>
                <span>dhakalsatish2004@gmail.com</span>
            </div>
            <div className="info-item">
                <label>Address:</label>
                <span>Maitighar, Kathmandu</span>
            </div>
            <div className="info-item">
                <label>Status:</label>
                <span>Property Owner  |  User</span>
            </div>
        </div>
        <div className="user-analytics">
            <h5>User Analytics</h5>
            <hr />
            <div className="analytics-item">
                <label>Last Parked Address:</label>
                <span>Patan Dhoka, Lalitpur</span>
            </div>
            <div className="analytics-item">
                <label>Number Of Times Parked:</label>
                <span>23</span>
            </div>
            <div className="analytics-item">
                <label>Favorite Parking Address:</label>
                <span>Aadarsha Colony, Tokha Road</span>
            </div>
        </div>

        <div className="user-analytics">
            <h5>Property Owner Analytics</h5>
            <hr />
            <div className="analytics-item">
            <label>Your Parking Addresses:</label>
                <span>{ parkingSpots.map((item, index) => <div key={index}>
               
                <div className='self-parking-spot' key={index}>
                    <Link className="coordinates-link" to={`https://www.google.com/maps?q=${item.XCoor},${item.YCoor}`}>{`${item.XCoor.toFixed(2)}, ${item.YCoor.toFixed(2)}`}</Link>
                    &nbsp;<button className="close-button" onClick={()=>deleteSpot(index)}>x</button>
                </div>
            </div>)}</span>
            </div>
        </div>
        <div className="logout-container">
            <button className="logout-button" onClick={()=>navigator('/signin')}>Logout</button>
        </div>


    </div>
</div>
</div>

  )
}

export default Profile