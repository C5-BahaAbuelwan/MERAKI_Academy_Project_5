import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCloudinaryAction,
  addToCloudinaryAction,
} from "../../redux/reducers/cloudinary";
import "./style.css"
function Upload() {
  const dispatch = useDispatch();
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadImage = async () => {
    // e.preventDefault();
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "maxqgc69");
    setLoading(true);
    await axios
      .post(`https://api.cloudinary.com/v1_1/hudhud/image/upload`, data)
      .then((result) => {
        setImage(result.data.secure_url);
        dispatch(addToCloudinaryAction(result.data.secure_url));
        setLoading(true);
        console.log(result);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <div className="upload">
       {!loading ? <div style={{background:"none"}}><p></p></div> : <img className="img_cloudenary" src={image} style={{ width: "300px" }} />}
      <button
        onClick={(e) => {
          uploadImage(e);
        }}
      >
        image
      </button>


      <input
        type="file"
        name="file"
        placeholder="Upload an image"
        onChange={(e) => {
          setImage(e.target.files[0]);
        }}
      />
     
    </div>
  );
}

export default Upload;
