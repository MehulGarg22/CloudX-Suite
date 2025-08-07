import React, {useState, useEffect, useContext} from 'react';
import CreditCardReward from './creditCardReward';
import { AuthContext } from "../../loginAuth/authContext";
import { useLocation } from "react-router-dom";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import logo from '../../../assets/cloudxsuite_logo.png'
import { Button } from "antd";
import axios from "axios";
import { LinearGradient } from 'react-text-gradients'
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import CreditCardList from './creditCardList';
import { useNavigate } from 'react-router-dom';
import Profile from '../../features/profile'; // Add Profile import
import './adminNavbar.css';

export default function AdminNavbar() {
    const { signOut } = useContext(AuthContext);
    const location = useLocation();
    const [filePath, setFilePath] = useState("")
    const [changeProfile, setChangeProfile] = useState(false) // Add profile state

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    const navigate = useNavigate();

    const CreditCardReward = () => {
        navigate('/admin/creditcard');
    }

    const CreditCardList = () => {
        navigate('/admin/creditcardlist');
    }

    // Add profile handler
    const handleProfile = () => {
        console.log("set")
        setChangeProfile(true)
    }

    useEffect(() => {
        let payload = {
            email: sessionStorage.getItem("email")
        }

        const profileImageFetchUrl = "https://tb98og2ree.execute-api.us-east-1.amazonaws.com/cloudxsuite-profile/fetch-profile-image-filePath-to-dynamodb"

        axios.post(profileImageFetchUrl, payload).then((res) => {
            console.log("Filepath of image in useEffect", res.data.filePath)
            setFilePath(res.data.filePath)
        }).catch((err) => {
            console.log("filepath in useEffect", err)
        })
    }, [])

    return (
        <div className="min-h-full">
            <Disclosure as="nav" className="admin-navbar">
                {/* Add Profile Component */}
                {
                    changeProfile && <Profile setChangeProfile={setChangeProfile} changeProfile={changeProfile} />
                }
                <div className="admin-navbar-container">
                    <div className="admin-navbar-content">
                        <div className="mobile-menu-button">
                            {/* Mobile menu button*/}
                            <DisclosureButton className="mobile-menu-toggle">
                                <span className="sr-only">Open main menu</span>
                                <Bars3Icon aria-hidden="true" className="menu-icon menu-icon-open" />
                                <XMarkIcon aria-hidden="true" className="menu-icon menu-icon-close" />
                            </DisclosureButton>
                        </div>
                        
                        <div className="admin-navbar-brand-section">
                            <div className="admin-brand-container">
                                <div className="admin-logo-container">
                                    <img
                                        alt="CloudX Suite Logo"
                                        src={logo}
                                        className="admin-brand-logo"
                                    />
                                </div>
                                <div className="admin-brand-text">
                                    <h1 className="admin-brand-title">
                                        <LinearGradient gradient={['to right', '#DA5B9B', '#6B96F4']}>
                                            CloudX Suite
                                        </LinearGradient>
                                    </h1>
                                    <span className="admin-brand-subtitle">Admin Dashboard</span>
                                </div>
                            </div>
                            
                            <div className="admin-desktop-navigation">
                                <div className="admin-nav-items">
                                    <button 
                                        className={`admin-nav-button ${location.pathname === '/admin/creditcard' ? 'active' : ''}`}
                                        onClick={CreditCardReward}
                                    >
                                        💳 Credit Card Rewards
                                    </button>
                                    <button 
                                        className={`admin-nav-button ${location.pathname === '/admin/creditcardlist' ? 'active' : ''}`}
                                        onClick={CreditCardList}
                                    >
                                        📋 Credit Card List
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="admin-navbar-actions">
                            <button
                                type="button"
                                className="admin-notification-button"
                            >
                                <span className="sr-only">View notifications</span>
                                <BellIcon aria-hidden="true" className="notification-icon" />
                                <span className="notification-badge"></span>
                            </button>

                            {/* Profile dropdown */}
                            <Menu as="div" className="admin-profile-menu">
                                <div>
                                    <MenuButton className="admin-profile-button">
                                        <span className="sr-only">Open user menu</span>
                                        <div className="admin-profile-avatar">
                                            {
                                                !filePath ? 
                                                    <div className="admin-default-avatar">
                                                        <UserOutlined />
                                                    </div>
                                                    :
                                                    <img src={filePath} className="admin-user-avatar" alt="Profile"/>
                                            }
                                        </div>
                                    </MenuButton>
                                </div>
                                <MenuItems className="admin-profile-dropdown">
                                    <MenuItem>
                                        <div className="admin-profile-info">
                                            <span className="admin-user-name">
                                                {sessionStorage.getItem("name")}
                                            </span>
                                            <span className="admin-user-role">
                                                {sessionStorage.getItem("role")}
                                            </span>
                                            <span className="admin-user-email">
                                                {sessionStorage.getItem("email")}
                                            </span>
                                        </div>
                                    </MenuItem>
                                    <hr className="admin-dropdown-divider" />
                                    {/* Add Your Profile Menu Item */}
                                    <MenuItem>
                                        <button
                                            className="admin-dropdown-item"
                                            onClick={handleProfile}
                                        >
                                            👤 Your Profile
                                        </button>
                                    </MenuItem>
                                    <MenuItem>
                                        <button
                                            className="admin-dropdown-item logout-item"
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
                
                <DisclosurePanel className="admin-mobile-panel">
                    <div className="admin-mobile-nav-content">
                        <button 
                            className={`admin-mobile-nav-button ${location.pathname === '/admin/creditcard' ? 'active' : ''}`}
                            onClick={CreditCardReward}
                        >
                            💳 Credit Card Rewards
                        </button>
                        <button 
                            className={`admin-mobile-nav-button ${location.pathname === '/admin/creditcardlist' ? 'active' : ''}`}
                            onClick={CreditCardList}
                        >
                            📋 Credit Card List
                        </button>
                    </div>
                </DisclosurePanel>
            </Disclosure>
        </div>
    );
}
