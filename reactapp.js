// this file just shows in the react app how we are making the http request to upload the file  

import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

const axios = require("axios");
const requestApi = () => {
  axios
    .post(
      "https://inshirahtest-dqrs2brq2q-uw.a.run.app/user/login",

      {
        email: "othman@gmail.com",
        password: "password",
      }
    )
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
};

function App() {
  const [File, setFile] = useState("");
  const fileName = "thisisthefilename";

  const setimg = (event) => {
    const img = event.target.files[0];
    setFile(img);
  };

  const send = () => {
    const data = new FormData();
    data.append("name", fileName);
    data.append("file", File);
    axios
      .post("http://127.0.0.1:8000/upload", data)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    console.log(data);
  };

  return (
    <div className="App">
      <h1>hello world</h1>
      <button onClick={requestApi}>Make API Request</button>
      <form action="/profile" method="post" encType="multipart/form-data">
        <input type="file" name="avatar" onChange={setimg} />
      </form>
      <button onClick={send}>Upload</button>
    </div>
  );
}

export default App;