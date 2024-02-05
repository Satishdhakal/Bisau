/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L, { latLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerPublicIconPng from "../assets/marker-public-icon.png";
import { Icon } from "leaflet";
import { useData } from "../context/ObjectContext";
import currentLocationSvg from "../assets/location_marker.svg";
import addMarker from "../assets/add_location_marker.png";
import compoundImage from "../assets/compound.jpg"
import { FaMapMarkedAlt } from "react-icons/fa";
import bikeIcon from "../assets/vehicle_select_bike_icon.png"
import carIcon from "../assets/vehicle_select_icon.png"
import ElectricBolt from "../assets/marker-green-bolt.png";
import { FaPhone } from "react-icons/fa6";
import GrayMarker from "../assets/marker-grey.png";

// Fix for Leaflet marker icons not appearing
delete L.Icon.Default.prototype._getIconUrl;

// component for finding routes
const MapRouting = ({ map, position, target }) => {
  map = useMap();
  const data = useData();
  const startPoint = L.latLng(position);
  const endPoint = L.latLng(target[0], target[1]);
  

  
  useEffect(()=>{
    data.data.routingControl = L.Routing.control({
      waypoints: [startPoint, endPoint],
      routeWhileDragging: true,
      draggableWaypoints: false,
      createMarker: function () {
        return null;
      },
      lineOptions: {
        addWaypoints: false
      }
    });

    data.data.showRoute = ()=>data.data.routingControl.addTo(map);
  }, [])

  return (
    <>
      <Marker      
        position={startPoint}
        icon={
          new Icon({
            iconUrl: currentLocationSvg,
            iconSize: [24, 36],
            iconAnchor: [12, 18],
          })
        }
      />
    </>
  );
};

const InputMarker = () => {
  const map = useMap();
  const { data } = useData();

  const [position, setPosition] = useState();
  useEffect(() => {
    setPosition(map.getCenter());
    map.on("move", updateMarkerPosition);
  }, []);

  // Function to update marker position to the center of the map
  function updateMarkerPosition() {
    setPosition(map.getCenter());
  }

  function setMarkerButton(e) {
    e.preventDefault();
    data.setParkingLocationListener(map.getCenter());
  }

  return (
    <>
      {position && (
        <>
          <button className="map-input-ok-button" onClick={setMarkerButton}>
            OK
          </button>
          <Marker
            position={position}
            icon={
              new Icon({
                iconUrl: addMarker,
                iconSize: [30, 41],
                iconAnchor: [15, 41],
              })
            }
          />
        </>
      )}
    </>
  );
};

/*
                                                                                 __   
  _____ _____  ______     ____  ____   _____ ______   ____   ____   ____   _____/  |_ 
 /     \\__  \ \____ \  _/ ___\/  _ \ /     \\____ \ /  _ \ /    \_/ __ \ /    \   __\
|  Y Y  \/ __ \|  |_> > \  \__(  <_> )  Y Y  \  |_> >  <_> )   |  \  ___/|   |  \  |  
|__|_|  (____  /   __/   \___  >____/|__|_|  /   __/ \____/|___|  /\___  >___|  /__|  
      \/     \/|__|          \/            \/|__|               \/     \/     \/      
*/
const Map = () => {
  const [position, setPosition] = useState([27.7009895, 85.315017]);
  const [gotPosition, setGotPosition] = useState(false);
  const { data } = useData();

  const [positions, setPositions] = useState();

  const [solnIndex, setSolnIndex] = useState(Infinity);
  const [currentState, setCurrentState] = useState(true);
  const [isTwoWheeler, setIsTwoWheeler] = useState(true);
  const [allParkingSpots, setAllParkingSpots] = useState([]);

  const [popupDetails, setPopupDetails] = useState({});
  const positionInputCallBack = () => {};

  /* TO FILTER PARKING SPOTS */
  useEffect(() => {
    const getParkingSpots = async () => {
      const pSpots = await data.getAllParkingSpots();
      setAllParkingSpots(pSpots);
    };
    getParkingSpots();

    data.stateOfMap = (a) => setCurrentState(a);
    data.setToggleVechicleState = (a) => setIsTwoWheeler(a);
  }, []);

  
  useEffect(() => {
    if (!allParkingSpots.length) return;
    const getLabelIndex = (dat, index) => {
      const temp = [dat.XCoor, dat.YCoor, index];
      if (isTwoWheeler) {
        if ((dat.noBikes - dat.noBikesBooked) < 0) 
          temp.push(2);
        else if ((dat?.noBikes || 0) <= 0) {
          temp.push(2);
        }
        else temp.push(((dat?.public || 0) > 0) ? 0 : 1)
      }
      else {
        if ((dat.noCars - dat.noCarsBooked) < 0) 
          temp.push(2);
        else if ((dat?.noCars || 0) <= 0) {
          temp.push(2);
        }
        else temp.push(((dat?.public || 0) > 0) ? 0 : 1)
      }
      return temp;
    }
    const temp = [];
    for (let i=0; i<allParkingSpots.length; i++) {
      const dat = allParkingSpots[i];
      temp.push(getLabelIndex(dat, i));
    }
    setPositions(temp);

  }, [isTwoWheeler, allParkingSpots]);

  function haversine(lat1, lon1, lat2, lon2) {
    const pointA = L.latLng(lat1, lon1);
    const pointB = L.latLng(lat2, lon2);

    const distance = pointA.distanceTo(pointB);
    return distance;
  }

  
  /* TO FIND CURRENT LOCATION USING GEOLOCATION */
  useEffect(() => {
    const getLocation = async () => {
      try {
        const location = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => resolve(position),
            (error) => reject(error)
          );
        });

        const { latitude, longitude } = location.coords;
        setPosition([latitude, longitude]);
        setGotPosition(true);
      } catch (error) {
        console.error("Error getting user's location:", error.message);
      }
    };

    getLocation();
  }, []);

  // get position of marker
  const getLocation = (callback) => {
    setCurrentState(false);
    positionInputCallBack = callback;
  };

  // function to get the shortest legngth
  useEffect(() => {
    if (!(gotPosition && positions?.length >= 0)) return;

    let minScore = Infinity;
    let minIndex = Infinity;

    for (let i=0; i<positions.length; i++) {
      let tempDist = haversine(positions[i][0], positions[i][1], position[0], position[1]);
      if (tempDist < minScore) {
        minScore = tempDist;
        minIndex = i;
      };
    }
    setSolnIndex(minIndex);


  }, [positions, gotPosition]);

  const bookPopUpClick = (index) => {
    setPopupDetails(allParkingSpots[index])
  }

  return (
    <div className="maps">
      <MapContainer
        center={position}
        zoom={14}
        style={{ height: "100vh", width: "100%" }}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        { currentState && <>
          {gotPosition && solnIndex!==Infinity && <MapRouting position={position} target={positions[solnIndex]}/>}
          
          {positions && positions.map((item, index) => <>
            <Marker
              key={index}
              position={L.latLng(item[0], item[1])}
              icon={
                // createMarkerIcon('red')
                new Icon({
                  // iconUrl: !item[3] ? markerIconPng : markerPublicIconPng,
                  iconUrl: item[3]===0 ? markerPublicIconPng : item[3]===1 ? markerIconPng : GrayMarker,
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                })
              }
              eventHandlers={{
                click: (e) => {
                  bookPopUpClick(item[2])
                },
              }}
            >
              <Popup>
                <img src={compoundImage} height={200} width={200} className="compound-image"></img>
            

                <h3>Available Space</h3>
                <div className="icons-space">
                  <p>
                    <b><img src={bikeIcon} height="40px" /> </b>
                    <span className="icon-texts"> 
                      &nbsp;{popupDetails.noBikes - popupDetails.noBikesBooked}
                    </span>
                  </p>
                  <p className="car-all">
                    <b><img src={carIcon} height="40px" className="car-icon"/> </b>
                    <span className="icon-texts">
                      &nbsp; {popupDetails.noCars - popupDetails.noCarsBooked}
                    </span>
                  </p>
                </div>

                <h3>Price</h3>
                <div className="icons-space">
                  <p>
                    <b><img src={bikeIcon} height="40px" /> </b>
                    <span className="icons-text-price"> 
                      &nbsp;{popupDetails.priceBike || 25}
                    </span>
                  </p>
                  <p className="car-all">
                    <b><img src={carIcon} height="40px" className="car-icon"/> </b>
                    <span className="icons-text-price">
                      &nbsp; {popupDetails.priceCars || 80}
                    </span>
                  </p>
                </div>

                <h3 className="phone-class">
                  <FaPhone />&nbsp;&nbsp;+977 9845721226
                </h3>
                

                <div className="div-button">
                
                  <a href={`https://www.google.com/maps/dir/${position}/${[positions[index][0],positions[index][1]]}`}>
                    {" "}
                    <button className="open-in-maps">
                      <FaMapMarkedAlt />
                      </button>
                    
                  </a>
                
                <button className="class-book">
                  Book
                </button>
                
                </div>
              </Popup>
            </Marker>
          </>)}
          <Marker      
            position={[27.698830, 85.349748]}
            icon={
              new Icon({
                iconUrl: ElectricBolt,
                iconSize: [24, 36],
                iconAnchor: [12, 18],
              })
            }
          />
          <Marker      
            position={[27.713978, 85.312568]}
            icon={
              new Icon({
                iconUrl: ElectricBolt,
                iconSize: [24, 36],
                iconAnchor: [12, 18],
              })
            }
          />
          </>
        }
        {currentState || (
          <>
            <InputMarker />
          </>
        )}

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
};

export default Map;
