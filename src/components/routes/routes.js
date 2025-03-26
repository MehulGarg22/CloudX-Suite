import React from "react";
import { Route, Routes } from "react-router-dom";
import {AuthProvider} from '../loginAuth/authContext';
import LandingPage from "../landingpage";
import RouteGuard from "../loginAuth/RouteGuard";
import Navbar from "../navbar/navbar";
import AdminForm from "../priviledges/admin/adminForm";
import GuestUser from "../priviledges/guestUser/guestUser";
import User from "../priviledges/users/user";



export default function MyRoutes(){
    return(
        <AuthProvider>
            <Navbar />
            <div>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/admin/creditcard" element={
                            <RouteGuard>
                                <AdminForm/>
                            </RouteGuard>
                        }
                    />
                    <Route path="/guest" element={
                            <RouteGuard>
                                <GuestUser/>
                            </RouteGuard>
                        }
                    />
                    <Route path="/user" element={
                            <RouteGuard>
                                <User/>
                            </RouteGuard>
                        }
                    />
                </Routes>
            </div>
        </AuthProvider>
    );
}
