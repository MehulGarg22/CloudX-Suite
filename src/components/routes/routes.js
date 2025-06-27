import React from "react";
import { Route, Routes } from "react-router-dom";
import {AuthProvider} from '../loginAuth/authContext';
import LandingPage from "../landingpage";
import RouteGuard from "../loginAuth/RouteGuard";
import AdminDashboard from "../priviledges/admin/adminNavbar";
import GuestUser from "../priviledges/guestUser/guestUser";
import User from "../priviledges/users/user";
import CreditCardList from "../priviledges/admin/creditCardList";
import CreditCardReward from "../priviledges/admin/creditCardReward";



export default function MyRoutes(){
    return(
        <AuthProvider>
            <div>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/admin/creditcard" element={
                            <RouteGuard>
                                <CreditCardReward/>
                            </RouteGuard>
                        }
                    />
                    <Route path="/admin/creditcardlist" element={
                            <RouteGuard>
                                <CreditCardList/>
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
