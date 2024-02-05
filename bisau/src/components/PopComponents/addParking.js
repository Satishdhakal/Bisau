import React, {useEffect, useState, useRef } from 'react';
import { FaCar } from "react-icons/fa";
import { FaMotorcycle } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { useData } from '../../context/ObjectContext';

import './addParking.css'

const AddParking = () =>{
    const [parkingLocation, setParkingLocation] = useState("");
    const [parkingLocationOrig, setParkingLocationOrig] = useState();

    const twoWheelerRef = useRef();
    const fourWheelerRef = useRef();
    const twoWheelerPriceRef = useRef();
    const fourWheelerPriceRef = useRef();

    const {data} = useData();

    const listener = (dat) => {
        setParkingLocation(dat.lat.toFixed(2)+", "+dat.lng.toFixed(2));
        setParkingLocationOrig(dat);
        data.stateOfMap(true);
        data.setPopComponentDropDown(false);
    };
    
    useEffect(()=>{
        data.setParkingLocationListener = (a)=>listener(a);
        return data.stateOfMap(true);
    }, []);

    function onChooseLocation() {
        data.stateOfMap(false);
        data.setPopComponentDropDown(true);
    }

    function onSubmit() {
        const location = [parkingLocationOrig.lat, parkingLocationOrig.lng];
        const no2Wheelers = twoWheelerRef.current.value;
        const no4Wheelers = fourWheelerRef.current.value;
        const twoWheelersPrice = twoWheelerPriceRef.current.value;
        const fourWheelersPrice = fourWheelerPriceRef.current.value;

        if ((no2Wheelers || no4Wheelers) === false) { return; }
        try {
            data.setPopupDownOff();
            data.createParkingSpot(
                data.currentUser.uid,
                location[0], location[1],
                no2Wheelers, no4Wheelers,
                twoWheelersPrice, fourWheelersPrice
            );
        }
        catch (err) {
            console.error(err);
        }
    }


    return  (
    <div className='add-parking-spot'>
        <h1 className="pop-component-header popup-titles">Add a parking spot</h1>
    
        <div className='coordinate-select-wrapper'>
            <FaLocationDot size="2.2em" style={{transform: "translateY(-8px)"}} className="location-icon"/>
            <button className="choose-location-value" onClick={()=>onChooseLocation()}>{ parkingLocation?.length===0 ? "Choose Location" : parkingLocation }</button>
        </div>
        <h4 className="header-choose-vehicle popup-titles">Available Parking Space</h4>
        <div className='available-space-wrapper'>
                <div className='count-wrapper'> 
                    <FaMotorcycle size="2.5em" style={{transform: "translateY(-12px)"}} className="icon-bike"/>
                    <input ref={twoWheelerRef} type="number" name="points" step="1" className="choose-two-wheelers choose-input"/>
                </div>
                <div className='count-wrapper'>    
                    <FaCar size="2.2em" step="1" style={{transform: "translateY(-11px)"}} className="icon-car"/>
                    <input ref={fourWheelerRef} type="number" className="choose-four-wheelers choose-input"/>
                </div>

                
        </div>

        <h4 className="header-choose-vehicle popup-titles">Fees Per Hour</h4>
        <div className='available-space-wrapper'>
                <div className='count-wrapper'> 
                    <FaMotorcycle size="2.5em" style={{transform: "translateY(-12px)"}} className="icon-bike"/>
                    <input ref={twoWheelerPriceRef} type="text" placeholder='Rs.20' className="choose-two-wheelers choose-input add-dollar"/>
                </div>
                <div className='count-wrapper'>    
                    <FaCar size="2.2em" style={{transform: "translateY(-11px)"}} className="icon-car"/>
                    
                    <input ref={fourWheelerPriceRef} type="text" placeholder="Rs.30" className="choose-four-wheelers choose-input add-dollar"/>
                </div>
                <div className="image-upload">
                    <label htmlFor="img" className="popup-titles header-choose-vehicle title-image">
                        <div className="div-file-choose"><span className="choose-image">Select <br></br> image of property</span></div>
                    </label>
                    <input type="file" id="img" name="img" accept="image/*" className="image-input hidden" />
                </div>

                
        </div>
        <button className="button-submit" onClick={onSubmit}>Submit</button>    
    </div>)
}

export default AddParking;