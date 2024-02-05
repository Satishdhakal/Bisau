import React from 'react'
import BottomNavbar from './components/BottomNavbar.js';
import Map from './components/Map.js';
import Filler from './components/Filler.js'

import './Main.css';


const Main = () => {
  return (
    <div className='main'>
        <BottomNavbar className='bottom-navbar' />
        <Filler />
        <Map />
    </div>
  )
}

export default Main