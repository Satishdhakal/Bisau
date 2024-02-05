import React, {useState} from 'react';
import "./BottomNavbar.css"
import { FaCircleUser } from "react-icons/fa6";
import Profile from './Profile';
import PopComponent from './PopComponent';
import LogoWText from "../assets/logowtext.png"
import AddParking from './PopComponents/addParking';
import AddParkingIcon from '../assets/add_parking_icon.png'
import SearchParkingIcon from '../assets/search_location_icon.png'
import VehicleSelectIcon from '../assets/vehicle_select_icon.png'
import VehicleSelectIcon2 from '../assets/bike-logo.png'
import { useData } from '../context/ObjectContext';

const BottomNavbar=() => {
  const [swap, setSwap] = useState(false);
  const [display, setDisplay]= useState(false);
  const [displayPro, setDisplayPro]= useState(false);

  const { data } = useData();

  data.setPopupDownOff = () => setDisplay(false);
  
  function openComponent(){
    setDisplay(!display);
  }
  
  function openProfile(){
    setDisplayPro(!displayPro);
  }

  function switchVehicle(){
    data.setToggleVechicleState(swap);
    setSwap(!swap);
  }

  function showRouteButton() {
    data.showRoute();
  }

  return(
    
    <>
    {
      display && 
      <PopComponent>
        <AddParking></AddParking>
      </PopComponent>
    }

    {
      displayPro &&
   
        <Profile />
    
    }
    
    <div className="top">
      <div className='logo-wrapper'>
        <img alt='Logo with text' style={{width: "65px"}} src={ LogoWText }/>
      </div>
      <FaCircleUser size="2.5em" className='profile-icon' onClick={openProfile}/>
    </div>
    <div className='bottom-navbar-wrapper'> 
      <div className="bottom-navbar">
        <img alt="Add parking spot icon" src={ AddParkingIcon } className="add-parking-icon" onClick={openComponent}/>
        {/* <div className='divider'></div> */}
        <div className='search-icon-bg'> 
          <img alt="Add parking spot icon" src={ SearchParkingIcon } className="search-parking-icon" onClick={()=>showRouteButton()}/>   
        </div>
        {/* <div className='divider'></div> */}
        {
          swap &&
        <div className='vehicle-select-bg'> 
          <img alt='Vehicle select icon' src={ VehicleSelectIcon } className='vehicle-select-icon' onClick={switchVehicle}/>
        </div>
        }

        {
          !swap &&
          <div className='vehicle-select-bg'> 
            <img alt='Vehicle select icon' src={ VehicleSelectIcon2 } className='vehicle-select-icon' onClick={switchVehicle}/>
          </div>
        }
      </div>
    </div>
  </>
  )
  
};

export default BottomNavbar;