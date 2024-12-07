import { useState } from 'react'
import './App.css'
import axios from 'axios';
import Welcome from './Components/Welcome';
// import Login from './Login';
// import RegisterUser from './RegisterUser';
// import RegisterBusiness from './RegisterBusiness';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  const [responseValue, setResponseValue] = useState([]);

  const fetchData = async () => {
    try {
      console.log("Attempting to fetch data...");
      const response = await axios.get('http://localhost:5000/api/samples');
      console.log("Response received:", response.data);
      setResponseValue(response.data); // Update state with the response array
    } catch (error) {
      console.error('Error fetching data:', error);
      setResponseValue([]); // Set state to an empty array on error
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        {/* <Route path="/login" component={Login} />
        <Route path="/register/user" component={RegisterUser} />
        <Route path="/register/business" component={RegisterBusiness} /> */}
        {/* Add other routes here */}
      </Routes>
      <div>
        <button onClick={fetchData}>
          Fetch Server Response
        </button>
        <h2>API Response:</h2>
        <ul>
          {responseValue.map((item) => (
            <li key={item.id}>
              ID: {item.id}, Name: {item.name || "No Name Provided"}
            </li>
          ))}
        </ul>
      </div>
    </Router>
  );
}

export default App;
