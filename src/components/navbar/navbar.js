import React,{useActionState, useContext} from "react";
import './navbar.css'
import { AuthContext } from "../loginAuth/authContext";
import { useLocation } from "react-router-dom";
import {UserOutlined, LogoutOutlined} from "@ant-design/icons";
import {Menu, Divider} from "@aws-amplify/ui-react";
// import {Tooltip} from "antd";

export default function Navbar(){
    const {user, signOut}=useContext(AuthContext);

    const location=useLocation();

    return(
        <nav className="loginNavbar"> 
            {
                location.pathname !=="/" && (
                    <Menu
                        style={{
                            cursor:'pointer',
                            backgroundColor:'white',
                            border:'2px solid black',
                            height:'50px',
                            width:'200px',
                            borderRadius:'10px',
                            marginTop:'10px',
                            marginRight:'10px',
                        }}
                        trigger={
                            <div
                                style={{
                                    color:'white',
                                    cursor:'pointer',
                                    fontSize:'30px',
                                    marginLeft:'95%',
                                    marginTop:'5px',
                                    borderRadius:'70px', 
                                    marginBottom:'14px'
                                }}
                            >
                                {/* <Tooltip title="CLick to view profile" placement="topRight"> */}
                                    <UserOutlined />
                                {/* </Tooltip> */}
                            </div>
                        }
                    >
                        <p
                            style={{
                                cursor:'default',
                                color:'#034C53',
                                fontWeight:'bold',
                                marginLeft:'10px',
                                marginTop:'4%',
                                fontSize:'19px'
                            }}
                        >
                            {localStorage.getItem("role")}
                        </p>
                        <p
                            style={{
                                cursor:'default',
                                color:'black',
                                fontWeight:'bold',
                                marginLeft:'10px',
                                marginTop:'2%',
                                fontSize:'15px'
                            }}
                        >
                            {localStorage.getItem("name")}
                        </p>
                        <Divider/>
                        <p
                            style={{
                                cursor:'pointer',
                                color:'black',
                                fontWeight:'bold',
                                marginLeft:'10px',
                                fontSize:'15px'
                            }}
                            onClick={signOut}
                        >
                            {" "}
                            <LogoutOutlined style={{fontWeight:'bold'}} />
                            {" "}
                            {" "}
                            Sign Out
                        </p>
                    </Menu>
                )
            }
        </nav>
    );
}
