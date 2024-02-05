import React, { useContext, useEffect, useState } from "react";
import Firebase from "../database/Model";
import LogoB from '../assets/logo_b.png'
import LogoF from '../assets/logo_f.png'


const ObjectValues = React.createContext();

export function ObjectValuesProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const values = {
    data: new Firebase(),
  };

  useEffect(() => {
    values.data.setAuthCallBack(userIn);
  }, []);

  function userIn(user) {
    setTimeout(()=>setIsLoading(false), [3000]);
  }
  
  if (!isLoading){
    return (
      <ObjectValues.Provider value={values}>{children}</ObjectValues.Provider>
    );
  }

  
  if(isLoading){
    return(
      <div className="splashScreen">
        <img alt="logo_b" src={ LogoB } className="logo-b"/>
        <img alt="logo_a" src={ LogoF } className="logo-f"/>
      </div>
    )
  }
}


export function useData() {
  return useContext(ObjectValues);
}