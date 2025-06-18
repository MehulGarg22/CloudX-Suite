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

export default function User(){
    const { signOut } = useContext(AuthContext);
    
    const [switchToRewards, setSwitchToRewards]= useState(false)
    const [filePath, setFilePath]= useState("")
    const [changeProfile, setChangeProfile]= useState(false)

    const navigation = [
        { name: 'Dashboard', href: '#', current: true },
        { name: 'Team', href: '#', current: false },
        { name: 'Projects', href: '#', current: false },
        { name: 'Calendar', href: '#', current: false },
    ]

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

        <div>

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
                    <span style={{marginLeft:'10px', marginTop:'1px', fontSize:'25px', color:'white' ,fontWeight:'bold'}}>
                        CloudX Suite
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
                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
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
                    <MenuItem>
                        <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                        onClick={signOut}
                        >
                        Sign out
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
                    <PlatformRewards/>
                )
            }

        </div>
    );
}








// export default function Example() {
//   return (

//         <div>
//             <div style={{display:'flex'}}>

//                 <div style={{display:'flex'}}>
//                     <span>
//                         <img src={logo} style={{height:'50px', width:'60px', marginLeft:'90%'}} />
//                     </span>
                    // <span style={{marginLeft:'60px', marginTop:'6px', fontSize:'25px', fontWeight:'bold'}}>
                    //     CloudX Suite
                    // </span>
                    // {
                    //     changeProfile && <Profile setChangeProfile={setChangeProfile} changeProfile={changeProfile} />
                    // }
//                 </div>
//                     {
//                         switchToRewards ?
//                         <div style={{marginLeft:'61.7vw', display:'flex'}}>
//                             <div style={{                        
//                                     color: 'black',
//                                     cursor: 'pointer',
//                                     fontSize: '30px',
//                                     marginRight:'20px',
//                                     marginLeft: '90%',
//                                     marginTop: '5px',
//                                     marginBottom: '1px',
//                                     backgroundColor: 'white', // Trigger background
//                                     height: '50px',
//                                     width: '50px',
//                                     display: 'flex',
//                                     justifyContent: 'center',
//                                     alignItems: 'center'
//                             }}>
//                                 <Button onClick={()=> setSwitchToRewards(false)}>
//                                     Back
//                                 </Button>
//                             </div>
//                             <Menu
//                             style={{
//                                 cursor: 'pointer',
//                                 marginTop: '5px',
//                                 marginRight: '10px',
//                             }}
//                             trigger={
//                                 <div
//                                 style={{
//                                     color: 'black',
//                                     cursor: 'pointer',
//                                     fontSize: '30px',
//                                     marginLeft: '50%',
//                                     marginTop: '5px',
//                                     marginBottom: '1px',
//                                     backgroundColor: 'white', // Trigger background
//                                     height: '50px',
//                                     width: '50px',
//                                     display: 'flex',
//                                     justifyContent: 'center',
//                                     alignItems: 'center',
//                                 }}
//                                 >
                                    // {
                                    //     !filePath ? 
                                    //         <div style={{fontSize:'30px'}}>
                                    //             <UserOutlined />
                                    //         </div>
                                    //         :
                                    //         <img src={filePath} style={{height:'40px', borderRadius:'100px'}}/>
                                            
                                    // }
//                                 </div>
//                             }
//                             >
//                             <div style={{
//                                 backgroundColor: 'white', // Menu Content background
//                                 border: '2px solid black', // Menu Content border
//                                 borderRadius: '10px',
//                                 padding: '10px',
//                                 width:'200px'
//                             }}>
//                                 <p
//                                     style={{
//                                         cursor: 'default',
//                                         color: 'black',
//                                         fontWeight: 'bold',
//                                         marginLeft: '10px',
//                                         marginTop: '2%',
//                                         fontSize: '15px',
//                                     }}
//                                 >
//                                     {sessionStorage.getItem("name")}
//                                 </p>
//                                 <p
//                                 style={{
//                                     cursor: 'default',
//                                     color: '#034C53',
//                                     fontWeight: 'bold',
//                                     marginLeft: '10px',
//                                     marginTop: '2%',
//                                     fontSize: '19px',
//                                 }}
//                                 >
//                                     {sessionStorage.getItem("role")}
//                                 </p>
//                                 <p
//                                     style={{
//                                         cursor: 'pointer',
//                                         color: 'black',
//                                         fontWeight: 'bold',
//                                         marginLeft: '10px',
//                                         marginTop: '2%',
//                                         fontSize: '15px',

//                                     }}
//                                     onClick={handleProfile}
//                                 >
//                                     Profile
//                                 </p>

//                                 <Divider />
//                                 <p
//                                 style={{
//                                     cursor: 'pointer',
//                                     color: 'black',
//                                     fontWeight: 'bold',
//                                     marginLeft: '10px',
//                                     fontSize: '15px',
//                                 }}
//                                 onClick={signOut}
//                                 >
//                                 <LogoutOutlined style={{ fontWeight: 'bold' }} />
//                                 {" "}
//                                 Sign Out
//                                 </p>
//                             </div>
//                             </Menu>
//                         </div>
//                         :
//                         <div style={{marginLeft:'58vw', display:'flex'}}>
//                             <div style={{                        
//                                     color: 'black',
//                                     cursor: 'pointer',
//                                     fontSize: '30px',
//                                     marginRight:'20px',
//                                     marginLeft: '90%',
//                                     marginTop: '5px',
//                                     marginBottom: '1px',
//                                     backgroundColor: 'white', // Trigger background
//                                     height: '50px',
//                                     width: '50px',
//                                     display: 'flex',
//                                     justifyContent: 'center',
//                                     alignItems: 'center'
//                             }}>
//                                 <Button onClick={()=> setSwitchToRewards(true)}>
//                                     Credit Card Platform Rewards
//                                 </Button>
//                             </div>
//                             <Menu
//                             style={{
//                                 cursor: 'pointer',
//                                 marginTop: '5px',
//                                 marginRight: '10px',
//                             }}
//                             trigger={
//                                 <div
//                                 style={{
//                                     color: 'black',
//                                     cursor: 'pointer',
//                                     fontSize: '30px',
//                                     marginLeft: '95%',
//                                     marginTop: '5px',
//                                     marginBottom: '1px',
//                                     backgroundColor: 'white', // Trigger background
//                                     height: '50px',
//                                     width: '50px',
//                                     display: 'flex',
//                                     justifyContent: 'center',
//                                     alignItems: 'center',
//                                 }}
//                                 >
//                                     {
//                                         !filePath ? 
//                                             <div style={{fontSize:'30px'}}>
//                                                 <UserOutlined />
//                                             </div>
//                                             :
//                                             <img src={filePath} style={{height:'40px', borderRadius:'100px'}}/>
                                            
//                                     }
//                                 </div>
//                             }
//                             >
//                             <div style={{
//                                 backgroundColor: 'white', // Menu Content background
//                                 border: '2px solid black', // Menu Content border
//                                 borderRadius: '10px',
//                                 padding: '10px',
//                                 width:'200px'
//                             }}>
//                                 <p
//                                 style={{
//                                     cursor: 'default',
//                                     color: '#034C53',
//                                     fontWeight: 'bold',
//                                     marginLeft: '10px',
//                                     marginTop: '2%',
//                                     fontSize: '19px',
//                                 }}
//                                 >
//                                 {sessionStorage.getItem("name")}
//                                 </p>
//                                 <p
//                                 style={{
//                                     cursor: 'default',
//                                     color: 'black',
//                                     fontWeight: 'bold',
//                                     marginLeft: '10px',
//                                     marginTop: '2%',
//                                     fontSize: '15px',
//                                 }}
//                                 >
//                                 {sessionStorage.getItem("role")}
//                                 </p>
//                                 <p
//                                     style={{
//                                         cursor: 'pointer',
//                                         color: 'black',
//                                         fontWeight: 'bold',
//                                         marginLeft: '10px',
//                                         marginTop: '2%',
//                                         fontSize: '15px',

//                                     }}
//                                     onClick={handleProfile}
//                                 >
//                                     Profile
//                                 </p>
//                                 <Divider />
//                                 <p
//                                 style={{
//                                     cursor: 'pointer',
//                                     color: 'black',
//                                     fontWeight: 'bold',
//                                     marginLeft: '10px',
//                                     fontSize: '15px',
//                                 }}
//                                 onClick={signOut}
//                                 >
//                                 <LogoutOutlined style={{ fontWeight: 'bold' }} />
//                                 {" "}
//                                 Sign Out
//                                 </p>
//                             </div>
//                             </Menu>
//                         </div>

//                     }
//             </div>
            // {
            //     switchToRewards && (
            //         <PlatformRewards/>
            //     )
            // }

//         </div>
//   )
// }
