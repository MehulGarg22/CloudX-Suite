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
import './userNavbar.css'; // Add this CSS file
import dummyImage from '../../../assets/avatar.png'; // Assuming you have a dummy image for profile
import { useNavigate } from "react-router-dom";
import UserNavigation from "./userNavigation";
import CreditCardComparisonTable from "../../features/generalCardComparisonTable";

export default function User(){
    const [switchToComparison, setSwitchToComparison]= useState(false)

    return(
        <div className="min-h-full">
            <UserNavigation setSwitchToComparison={setSwitchToComparison} switchToComparison={switchToComparison}/>
            
            <div className="rewards-content">
                {
                    switchToComparison ? 
                    <CreditCardComparisonTable />
                    :
                    <PlatformRewards/>
                }
            </div>
        </div>
    );
}
