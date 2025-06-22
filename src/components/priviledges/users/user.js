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

            <Disclosure as="nav" className="bg-gray-800">
                {
                    changeProfile && <Profile setChangeProfile={setChangeProfile} changeProfile={changeProfile} />
                }
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        {/* Mobile menu button*/}
                            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
                                <span className="absolute -inset-0.5" />
                                <span className="sr-only">Open main menu</span>
                                <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                                <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                            </DisclosureButton>
                        </div>
                        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                            <div className="flex shrink-0 items-center">
                                <img
                                alt="Cloudzxsuite Logo"
                                src={logo}
                                className="h-16 w-auto"
                                />
                                <span style={{marginLeft:'10px', marginTop:'1px', fontSize:'20px', color:'white' ,fontWeight:'bold'}}>
                                    <LinearGradient gradient={['to left', '#DA5B9B ,#6B96F4']}>
                                        CloudX Suite
                                    </LinearGradient>
                                </span>
                            </div>
                            <div className="hidden sm:ml-6 sm:block">
                                {
                                    switchToRewards ?
                                    <div className="flex space-x-4 ">
                                        <p style={{cursor:'pointer', marginTop:'14px'}} className={classNames('text-gray-300 hover:bg-gray-700 hover:text-white','rounded-md px-3 py-2 text-sm font-medium')} onClick={()=> setSwitchToRewards(false)}>
                                            Back
                                        </p>
                                    </div>:
                                    <div className="flex space-x-4">
                                        <p style={{cursor:'pointer', marginTop:'16px'}} className={classNames('text-gray-300 hover:bg-gray-700 hover:text-white','rounded-md px-3 py-2 text-sm font-medium')} onClick={()=> setSwitchToRewards(true)}>
                                            Credit Card Platform Rewards
                                        </p>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <button
                            type="button"
                            className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                        >
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">View notifications</span>
                            <BellIcon aria-hidden="true" className="size-6" />
                        </button>

                        {/* Profile dropdown */}
                        <Menu as="div" className="relative ml-3">
                            <div>
                            <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                                <span className="absolute -inset-1.5" />
                                <span className="sr-only">Open user menu</span>
                                {
                                    !filePath ? 
                                        <div style={{fontSize:'30px', color: 'white'}}>
                                            <UserOutlined style={{color: 'white'}}/>
                                        </div>
                                        :
                                        <img src={filePath} style={{height:'40px', borderRadius:'100px'}}/>
                                        
                                }
                            </MenuButton>
                            </div>
                            <MenuItems
                            transition
                            className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                            >
                            <MenuItem>
                                <p
                                href="#"
                                className="block px-4 py-2 text-sm text-[#DA5B9B] data-focus:bg-gray-100 data-focus:outline-hidden"
                                >
                                {sessionStorage.getItem("name")}
                                </p>
                            </MenuItem>
                            <MenuItem>
                                <a
                                href="#"
                                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                onClick={handleProfile}
                                >
                                Your Profile
                                </a>
                            </MenuItem>
                            <hr class="border-gray-800 dark:border-white"></hr>
                            <MenuItem>
                                <a
                                href="#"
                                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                onClick={signOut}
                                >
                                Sign Out
                                </a>
                            </MenuItem>
                            </MenuItems>
                        </Menu>
                        </div>
                    </div>
                </div>
                <DisclosurePanel className="sm:hidden">
                    <div className="space-y-1 px-2 pt-2 pb-3">
                        {
                            switchToRewards ?
                            <div className="flex space-x-4 ">
                                <p style={{cursor:'pointer', marginTop:'12px'}} className={classNames('text-gray-300 hover:bg-gray-700 hover:text-white','rounded-md px-3 py-2 text-sm font-medium')} onClick={()=> setSwitchToRewards(false)}>
                                    Back
                                </p>
                            </div>:
                            <div className="flex space-x-4">
                                <p style={{cursor:'pointer', marginTop:'12px'}} className={classNames('text-gray-300 hover:bg-gray-700 hover:text-white','rounded-md px-3 py-2 text-sm font-medium')} onClick={()=> setSwitchToRewards(true)}>
                                    Credit Card Platform Rewards
                                </p>
                            </div>
                        }
                    </div>
                </DisclosurePanel>

            </Disclosure>
            {
                switchToRewards && (
                    <div>
                        <PlatformRewards/>
                    </div>
                        
                )
            }

        </div>
    );
}
