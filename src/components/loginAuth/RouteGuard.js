import { useContext } from "react";
import { Navigate } from "react-router-dom";
import {AuthContext} from './authContext';

export default function ({children}){
    const {user, isLoading}= useContext(AuthContext)
    if(isLoading){
        return <></>
    }
    if(!user){
        return <Navigate to="/" />
    }
    return children;
}