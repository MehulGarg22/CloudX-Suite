import React, {useContext, useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../loginAuth/authContext";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import logo from '../../../assets/cloudxsuite_logo.png'
import PlatformRewards from '../../features/creditCardPlatformRewards'
import axios from "axios";
import Profile from "../../features/profile";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Button } from "antd";
import { LinearGradient } from 'react-text-gradients'
import './guestUser.css'; // Add this CSS file
import dummyImage from '../../../assets/avatar.png'; // Assuming you have a dummy image for profile

export default function User(){
    const { signOut } = useContext(AuthContext);
    
    const [switchToRewards, setSwitchToRewards]= useState(false)
    const [filePath, setFilePath]= useState("")
    const [changeProfile, setChangeProfile]= useState(false)

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

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
        <div className="min-h-full">
            <Disclosure as="nav" className="modern-navbar">
                {
                    changeProfile && <Profile setChangeProfile={setChangeProfile} changeProfile={changeProfile} />
                }
                <div className="navbar-container">
                    <div className="navbar-content">
                        <div className="mobile-menu-button">
                            {/* Mobile menu button*/}
                            <DisclosureButton className="mobile-menu-toggle">
                                <span className="sr-only">Open main menu</span>
                                <Bars3Icon aria-hidden="true" className="menu-icon menu-icon-open" />
                                <XMarkIcon aria-hidden="true" className="menu-icon menu-icon-close" />
                            </DisclosureButton>
                        </div>
                        
                        <div className="navbar-brand-section">
                            <div className="brand-container">
                                <div className="logo-container">
                                    <img
                                        alt="CloudX Suite Logo"
                                        src={logo}
                                        className="brand-logo"
                                    />
                                </div>
                                <div className="brand-text">
                                    <h1 className="brand-title">
                                        <LinearGradient gradient={['to right', '#DA5B9B', '#6B96F4']}>
                                            CloudX Suite
                                        </LinearGradient>
                                    </h1>
                                    <span className="brand-subtitle">User Dashboard</span>
                                </div>
                            </div>
                            
                            <div className="desktop-navigation">
                                {
                                    switchToRewards ?
                                    <div className="nav-items">
                                        <button 
                                            className="nav-button back-button" 
                                            onClick={()=> setSwitchToRewards(false)}
                                        >
                                            ← Back to Dashboard
                                        </button>
                                    </div>:
                                    <div className="nav-items">
                                        <button 
                                            className="nav-button rewards-button" 
                                            onClick={()=> setSwitchToRewards(true)}
                                        >
                                            🎁 Credit Card Rewards
                                        </button>
                                    </div>
                                }
                            </div>
                        </div>
                        
                        <div className="navbar-actions">
                            <button
                                type="button"
                                className="notification-button"
                            >
                                <span className="sr-only">View notifications</span>
                                <BellIcon aria-hidden="true" className="notification-icon" />
                                <span className="notification-badge"></span>
                            </button>

                            {/* Profile dropdown */}
                            <Menu as="div" className="profile-menu">
                                <div>
                                    <MenuButton className="profile-button">
                                        <span className="sr-only">Open user menu</span>
                                        <div className="profile-avatar">
                                            {
                                                !filePath ? 
                                                    <div className="default-avatar">
                                                        <img src={dummyImage} className="user-avatar" alt="Profile"/>

                                                    </div>
                                                    :
                                                    <img src={filePath} className="user-avatar" alt="Profile"/>
                                            }
                                        </div>
                                    </MenuButton>
                                </div>
                                <MenuItems className="profile-dropdown">
                                    <MenuItem>
                                        <div className="profile-info">
                                            <span className="user-name">
                                                {sessionStorage.getItem("name")}
                                            </span>
                                            <span className="user-email">
                                                {sessionStorage.getItem("email")}
                                            </span>
                                        </div>
                                    </MenuItem>
                                    <hr className="dropdown-divider" />
                                    <MenuItem>
                                        <button
                                            className="dropdown-item"
                                            onClick={handleProfile}
                                        >
                                            👤 Your Profile
                                        </button>
                                    </MenuItem>
                                    <MenuItem>
                                        <button
                                            className="dropdown-item logout-item"
                                            onClick={signOut}
                                        >
                                            🚪 Sign Out
                                        </button>
                                    </MenuItem>
                                </MenuItems>
                            </Menu>
                        </div>
                    </div>
                </div>
                
                <DisclosurePanel className="mobile-panel">
                    <div className="mobile-nav-content">
                        {
                            switchToRewards ?
                            <button 
                                className="mobile-nav-button back-button" 
                                onClick={()=> setSwitchToRewards(false)}
                            >
                                ← Back to Dashboard
                            </button>:
                            <button 
                                className="mobile-nav-button rewards-button" 
                                onClick={()=> setSwitchToRewards(true)}
                            >
                                🎁 Credit Card Platform Rewards
                            </button>
                        }
                    </div>
                </DisclosurePanel>
            </Disclosure>
            
            <PlatformRewards/>
            {
                switchToRewards && (
                    <div className="rewards-content">
                    </div>
                )
            }
        </div>
    );
}
