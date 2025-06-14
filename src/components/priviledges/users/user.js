import React, {useContext, useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Menu, Divider } from "@aws-amplify/ui-react";
import { Button } from "antd";
import { AuthContext } from "../../loginAuth/authContext";
import logo from '../../../assets/cloudxsuite_logo.png'
import PlatformRewards from '../../features/creditCardPlatformRewards'
import axios from "axios";
import Profile from "../../features/profile";

export default function User(){
    const { signOut } = useContext(AuthContext);
    
    const [switchToRewards, setSwitchToRewards]= useState(false)
    const [filePath, setFilePath]= useState("")
    const [changeProfile, setChangeProfile]= useState(false)


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

    const handleProfile=()=>{
        console.log("set")
        setChangeProfile(true)
    }

    return(
        <div>
            <div style={{display:'flex'}}>

                <div style={{display:'flex'}}>
                    <span>
                        <img src={logo} style={{height:'50px', width:'60px', marginLeft:'90%'}} />
                    </span>
                    <span style={{marginLeft:'60px', marginTop:'6px', fontSize:'25px', fontWeight:'bold'}}>
                        CloudX Suite
                    </span>
                    {
                        changeProfile && <Profile setChangeProfile={setChangeProfile} changeProfile={changeProfile} />
                    }
                </div>
                    {
                        switchToRewards ?
                        <div style={{marginLeft:'61.7vw', display:'flex'}}>
                            <div style={{                        
                                    color: 'black',
                                    cursor: 'pointer',
                                    fontSize: '30px',
                                    marginRight:'20px',
                                    marginLeft: '90%',
                                    marginTop: '5px',
                                    marginBottom: '1px',
                                    backgroundColor: 'white', // Trigger background
                                    height: '50px',
                                    width: '50px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                            }}>
                                <Button onClick={()=> setSwitchToRewards(false)}>
                                    Back
                                </Button>
                            </div>
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
                                    marginLeft: '50%',
                                    marginTop: '5px',
                                    marginBottom: '1px',
                                    backgroundColor: 'white', // Trigger background
                                    height: '50px',
                                    width: '50px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                >
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
                                        color: 'black',
                                        fontWeight: 'bold',
                                        marginLeft: '10px',
                                        marginTop: '2%',
                                        fontSize: '15px',
                                    }}
                                >
                                    {sessionStorage.getItem("name")}
                                </p>
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
                                        cursor: 'pointer',
                                        color: 'black',
                                        fontWeight: 'bold',
                                        marginLeft: '10px',
                                        marginTop: '2%',
                                        fontSize: '15px',

                                    }}
                                    onClick={handleProfile}
                                >
                                    Profile
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
                        :
                        <div style={{marginLeft:'58vw', display:'flex'}}>
                            <div style={{                        
                                    color: 'black',
                                    cursor: 'pointer',
                                    fontSize: '30px',
                                    marginRight:'20px',
                                    marginLeft: '90%',
                                    marginTop: '5px',
                                    marginBottom: '1px',
                                    backgroundColor: 'white', // Trigger background
                                    height: '50px',
                                    width: '50px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                            }}>
                                <Button onClick={()=> setSwitchToRewards(true)}>
                                    Credit Card Platform Rewards
                                </Button>
                            </div>
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
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                >
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
                                {sessionStorage.getItem("name")}
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
                                {sessionStorage.getItem("role")}
                                </p>
                                <p
                                    style={{
                                        cursor: 'pointer',
                                        color: 'black',
                                        fontWeight: 'bold',
                                        marginLeft: '10px',
                                        marginTop: '2%',
                                        fontSize: '15px',

                                    }}
                                    onClick={handleProfile}
                                >
                                    Profile
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

                    }
            </div>
            {
                switchToRewards && (
                    <PlatformRewards/>
                )
            }

        </div>
    );
}
