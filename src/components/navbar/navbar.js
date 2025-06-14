import React, { useContext, useState, useEffect } from "react";
import './navbar.css';
import { AuthContext } from "../loginAuth/authContext";
import { useLocation } from "react-router-dom";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Menu, Divider } from "@aws-amplify/ui-react";
import logo from '../../assets/cloudxsuite_logo.png'
import { Button } from "antd";
import axios from "axios";

export default function Navbar() {
    const { signOut } = useContext(AuthContext);
    const location = useLocation();
    const [filePath, setFilePath]= useState("")


    useEffect(()=>{
        let payload={
            email: sessionStorage.getItem("email")
        }

        const profileImageFetchUrl="https://tb98og2ree.execute-api.us-east-1.amazonaws.com/cloudxsuite-profile/fetch-profile-image-filePath-to-dynamodb"

        axios.post(profileImageFetchUrl, payload).then((res)=>{
            console.log("Filepath of image in useEffect", res.data.filePath)
            setFilePath(res.data.filePath)
        }).catch((err)=>{
            console.log("filepath in useEffect",err)
        })
    },[])
    
    return (
    <nav className="loginNavbar">
    {
        location.pathname !=="/" && location.pathname !=="/user" && (
        <div style={{display:'flex'}}>
            <div style={{display:'flex'}}>
                <span>
                    <img src={logo} style={{height:'50px', width:'60px', marginLeft:'90%'}} />
                </span>
                <span style={{marginLeft:'60px', marginTop:'6px', fontSize:'25px', fontWeight:'bold'}}>
                    CloudX Suite
                </span>
            </div>
            <div style={{marginLeft:'75vw'}}>
                <Menu
                    style={{
                        cursor: 'pointer',
                        marginTop: '5px',
                        marginRight: '10px',
                    }}
                    trigger={
                        <div
                        style={{
                            color: 'black',
                            cursor: 'pointer',
                            fontSize: '30px',
                            marginLeft: '95%',
                            marginTop: '5px',
                            marginBottom: '1px',
                            backgroundColor: 'white', // Trigger background
                            height: '50px',
                            width: '50px',
                            zIndex:1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        >
                            {console.log("Image", sessionStorage.getItem("filePath"))}
                            {
                                !filePath ? 
                                    <div style={{fontSize:'30px'}}>
                                        <UserOutlined />
                                    </div>
                                    :
                                    <img src={filePath} style={{height:'40px', borderRadius:'100px'}}/>
                                    
                            }
                        </div>
                    }
                >
                <div style={{
                    backgroundColor: 'white', // Menu Content background
                    border: '2px solid black', // Menu Content border
                    borderRadius: '10px',
                    padding: '10px',
                    width:'200px'
                }}>
                    <p
                    style={{
                        cursor: 'default',
                        color: '#034C53',
                        fontWeight: 'bold',
                        marginLeft: '10px',
                        marginTop: '2%',
                        fontSize: '19px',
                    }}
                    >
                    {sessionStorage.getItem("role")}
                    </p>
                    <p
                    style={{
                        cursor: 'default',
                        color: 'black',
                        fontWeight: 'bold',
                        marginLeft: '10px',
                        marginTop: '2%',
                        fontSize: '15px',
                    }}
                    >
                    {sessionStorage.getItem("name")}
                    </p>
                    <Divider />
                    <p
                    style={{
                        cursor: 'pointer',
                        color: 'black',
                        fontWeight: 'bold',
                        marginLeft: '10px',
                        fontSize: '15px',
                    }}
                    onClick={signOut}
                    >
                    <LogoutOutlined style={{ fontWeight: 'bold' }} />
                    {" "}
                    Sign Out
                    </p>
                </div>
                </Menu>
            </div>
        </div>
        )
    }
    </nav>
    );
}