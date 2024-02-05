import React, { useEffect } from 'react'
import { useState } from 'react';
import "./PopComponent.css"
import { useData } from '../context/ObjectContext';

const PopComponent = (props) => {
  const [display, setDisplay] = useState();
  const { data } = useData();

  useEffect(()=>{
    data.setPopComponentDropDown = (e)=>setDisplay(e);
  }, []);

  return (
    <div className={"pop-component " + (display && "drop-down")}>
      {props.children}
    </div>
  )
}

export default PopComponent