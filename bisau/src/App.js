import { useEffect } from 'react';
import './App.css';
import { useData } from './context/ObjectContext.js';
import { useNavigate } from "react-router-dom";


function App() {
  const { data } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    if (data.currentUser?.email) {
      navigate("/main");
    }
    else {
      navigate("/signup");
    }
  }, []);
  
}

export default App;
