import { useState } from 'react'
import './App.css'
import axios from 'axios';

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
  );
}

export default App;
