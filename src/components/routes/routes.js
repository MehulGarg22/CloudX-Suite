import React from "react";
import { Route, Routes } from "react-router-dom";
import {AuthProvider} from '../loginAuth/authContext';
import LandingPage from "../landingpage";
import RouteGuard from "../loginAuth/RouteGuard";
import Dashboard from "../dashboard/dashboard";
import Navbar from "../navbar/navbar";
export default function MyRoutes(){
    return(
        <AuthProvider>
            <Navbar />
            <div>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/dashboard" element={
                            <RouteGuard>
                                <Dashboard/>
                            </RouteGuard>
                        }
                    />
                    
                </Routes>
            </div>
        </AuthProvider>
    );
}
