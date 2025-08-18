import { useContext } from "react";
import { Navigate } from "react-router-dom";
import {AuthContext} from './authContext';
import ModernSkeleton from "../ModernSkeleton";

export default function ({children}){
    const {user, isLoading}= useContext(AuthContext)
    if(isLoading){
        return <ModernSkeleton />
    }
    if(!user){
        return <Navigate to="/" />
    }
    return children;
}