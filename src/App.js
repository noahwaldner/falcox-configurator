import React from 'react';
import logo from './logo.svg';
import './App.css';
import { clone } from '@babel/types';
const { ipcRenderer } = window.require("electron");


function App() {
  let [osdValue, setOsdValue] = React.useState({ "1": "", "2": "", "3": "", "4": "", "5": "", "6": "", "7": "", "8": "", "9": "", "10": "", "11": "", "12": "", "13": "", "14": "", "15": "", "16": "" })
  let [connection, setConnection] = React.useState('No FC connected')
  const handleMessage = (event, data) => {
    console.log(data);
    
    if (data.toString().includes("attatched")) {
      console.log("attatched");
      setConnection('Please wait, connecting to FC ...')
    }

    if (data.toString().includes("ddd")) {
      console.log("detached");
      setConnection('No FC connected')
    }

    if (data.toString().includes("[")) {
      
      let commands = data.toString().split('[')
      commands.forEach(element => {
        
        if (element.toString().includes('H')) {
          setConnection('data')
          let content = element.split('H')[1].split("")[0]
          let lineNum = element.split('H')[0].split(';')[0]
          console.log(lineNum, content);
          const cloneState = osdValue;
          cloneState[lineNum] = content

          setOsdValue(osdValue => { return Object.assign({}, { ...cloneState }) })
          console.log(osdValue);

        }
      });
    }
  }

  React.useState(() => {
    ipcRenderer.on("catch_on_render", handleMessage)
    return (false);
  }, [])

  let prompt;
  if (connection == 0) {
    prompt = "No Device connected"
  } else if (connection == 1) {
    prompt = "Connecting to FC, Please Wait!"
  } else {
    prompt = ""
  }


  return (
    <div className="App">
      <header className="App-header">

        <p>{connection != 'data' ? connection : ""}</p>
        {connection == 'data' ? (Object.values(osdValue).map((value, index) => {
          return (<div className="osd-line">{value}</div>)
        })) : <div></div>}
        {
          connection == 'data' ? <button onClick={()=> {ipcRenderer.send('catch_on_main', "enterDFU"); setConnection('Successfully entered DFU mode')}}>Enter DFU Mode</button> : <div></div>
        }
       


      </header>
    </div>
  );
}

export default App;
