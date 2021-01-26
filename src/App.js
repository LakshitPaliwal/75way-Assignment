import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import DataTable from 'react-data-table-component';
import Button from '@material-ui/core/Button';
import './App.css';
function App() {
 
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const handleFileUpload = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {

      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });

      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      processData(data);
    };
    reader.readAsBinaryString(file);
  }
 
  const processData = dataString => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
 
    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
      if (headers && row.length == headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] == '"')
              d = d.substring(1, d.length - 1);
            if (d[d.length - 1] == '"')
              d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }
 
        if (Object.values(obj).filter(x => x).length > 0) {
          list.push(obj);
        }
      }
    }
 
    const columns = headers.map(c => ({
      name: c,
      selector: c,
    }));
 
    setData(list);
    setColumns(columns);
  }
 
  
  return (
    <div className="center">
      <h3>75way technology Assignment</h3>
 
     <input
     className="inputcsv"
      id="choosefile"
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
      />
      

      <label htmlFor="choosefile">
        <Button variant="contained" color="primary" component="span">
       Open CSV file
        </Button>
      </label>
      
      <DataTable
        highlightOnHover
        columns={columns}
        data={data}
      />

    </div>
  );
}
 
export default App;