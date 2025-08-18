import axios from 'axios';
import react from 'react';
import React, {useContext, useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../loginAuth/authContext";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import logo from '../../../assets/cloudxsuite_logo.png'
import PlatformRewards from '../../features/creditCardPlatformRewards'
import Profile from "../../features/profile";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Button } from "antd";
import { LinearGradient } from 'react-text-gradients'
import './userNavbar.css'; // Add this CSS file
import dummyImage from '../../../assets/avatar.png'; // Assuming you have a dummy image for profile
import { useNavigate } from "react-router-dom";
import UserNavigation from './userNavigation';

export default function CreditCard() {

    return (
        <div className="min-h-full">
            <UserNavigation/>
        </div>
    );
}