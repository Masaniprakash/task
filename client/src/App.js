import React, { useState } from "react";
import * as XLSX from "xlsx";
import "./App.css";
import axios from "axios";

function App() {
  const [jsonData, setJsonData] = useState(null);
  const [value, onChange] = useState(new Date());

  const handleSubmit = async() => {
    try {
      
      if (!jsonData) {
        alert("No data to submit");
        return;
      }
  
      const response = await axios.post("http://localhost:6300/api/user/upload/multiple", {data : jsonData});

        alert("Data submitted successfully");
      
    } catch (error) {
      alert(error.response.data.error); 
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const jsonData = XLSX.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[0]]
      );
      setJsonData(jsonData);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="upCon">
      <div className="upWra" >
        <h2 className="upTitle">Upload Excel File</h2>
        <input type="file" onChange={handleFileChange} accept=".xlsx, .xls" />
        <br />
        <br />
        <button className="upBtn" onClick={handleSubmit}>Submit</button>
        <br />
      </div>
    </div>
  );
}

export default App;
