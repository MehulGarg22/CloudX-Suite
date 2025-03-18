import React, { useState, useContext } from "react";
import { FaUserTie  } from "react-icons/fa";
import { TbPasswordUser  } from "react-icons/tb";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./loginAuth/authContext";
import './landingpage.css';
import Footer from "./footer/footer";
import { IoMdInformationCircleOutline } from "react-icons/io";

import { Tooltip } from "@material-tailwind/react";

export default function LandingPage() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [userType, setUserType] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate();

  const { user, signIn } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      await signIn(username, password);
      setLoading(false);
      // Redirect to the app's main page or dashboard
    } catch (err) {
      console.log(err.message);
      alert("Email or password is incorrect")
    }
  };

  const handleGuestLogin=async(e)=>{
    try {
      await signIn("guestuser@gmail.com", "Test@123");
      setLoading(false);
      // Redirect to the app's main page or dashboard
    } catch (err) {
      console.log(err.message);
      alert("Email or password is incorrect")
    }
  }

  if (user) {
    // Redirect to the profile page
    return <Navigate to="/dashboard" />;
  }


  return (
    <div style={{ overflowX: "hidden",minHeight:'100vh', backgroundColor:'#EBE8DB', height:'100%', width: "100%" }}>
      <div style={{ display: "flex", backgroundColor:'white', borderRadius:'30px', marginLeft:'30px', marginRight:'30px', marginTop:'5%', height:'500px', boxShadow: '0 4px 4px 0 rgb(60 64 67 / 30%), 0 8px 12px 6px rgb(60 64 67 / 15%)'}}>
        <div
          style={{
            width: "50%",
            textAlign: "justify",
            marginLeft: "20px",
            marginTop: "2%",
            marginRight: "20px",
            fontSize: "20px",
          }}
        >
          <div style={{ fontWeight: "bold", color: "#a51d4a", marginBottom:'60px', fontSize:'40px' }}>  
            CloudX Suite
          </div>
          <span style={{ fontWeight: "bold", color: "#a51d4a" }}>
            {" "}
            "Cloud-Powered Web Application with AWS & React"
            
          </span>{" "}
        
            A Cloud-based web platform integrating AWS services and ReactJS to offer secure authentication, AI-driven automation, and seamless task management. 
            <br/>
            <br/>
            <br/>

            The application features user authentication via AWS Cognito, task and expense management with data visualization, and AI-powered modules like a chatbot assistant. Future enhancements include real-time notifications, workflow automation, and deeper AI-driven insights, ensuring a scalable and intelligent cloud solution.
         
        </div>
        <div style={{ width: "50%" }}>
          <form
            style={{ width: "100%", marginTop: "20%", marginLeft: "5%" }}
            onSubmit={handleSubmit}
          >
            <div className="input-container">
              <span style={{ fontSize: "30px", marginRight:'1%', color:'#a51d4a' }}>
                <FaUserTie  />
              </span>
              <input
                className="input-field"
                type="text"
                width={400}
                placeholder="Email ID"
                name="usrnm"
                required
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
              />
              <IoMdInformationCircleOutline/>
            </div>
            <br/>
            <div className="input-container">
              <span style={{ fontSize: "30px", color:'#a51d4a' }}>
                <TbPasswordUser  />
              </span>
              <input
                style={{ marginLeft: "2%" }}
                className="input-field"
                type="password"
                value={password}
                placeholder="Password"
                name="psw"
                required
                onChange={(event) => setPassword(event.target.value)}
              />
              <Tooltip content="Material Tailwind" >
                <span style={{cursor:'pointer', marginTop:'10px', marginLeft:'10px',fontSize:'20px'}}>
                  <IoMdInformationCircleOutline/>
                </span>
              </Tooltip>
            </div>

            <div style={{ display: "flex",marginTop:'5%' }}>
                <button type="submit" className="button-17" style={{marginRight:'10px'}}>
                  Login
                </button>
                {/* <Tooltip content="Material Tailwind"> */}
                    <button onClick={handleGuestLogin} className="button-17">
                      Guest login
                    </button>
                {/* </Tooltip> */}
            </div>
          </form>
        </div>
      </div>
      <div style={{marginTop:'6%'}}>
        <Footer/>
      </div>
    </div>
  );
}
