import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from '../loginAuth/authContext';
import LandingPage from "../landingpage";
import RouteGuard from "../loginAuth/RouteGuard";
import AdminDashboard from "../priviledges/admin/adminNavbar";
import GuestUser from "../priviledges/guestUser/guestUser";
import User from "../priviledges/users/user";
import CreditCardList from "../priviledges/admin/creditCardList";
import CreditCardReward from "../priviledges/admin/creditCardReward";
import CreditCard from "../priviledges/users/creditcards";
import Dashboard from "../blog/dashboard/dashboard";
import GeneralCardComparisonTable from '../features/generalCardComparisonTable'
import Cards from "../Cards/Cards";


function ComparisonTablePage() {
    const role = sessionStorage.getItem("role");
    const NavComponent = role === 'Administrator' ? AdminDashboard :
        role === 'Guest User' ? GuestUser : null;
    return (
        <>
            {NavComponent && <NavComponent />}
            <GeneralCardComparisonTable />
        </>
    );
}

function CardsPage() {
    const role = sessionStorage.getItem("role");
    const NavComponent = role === 'Administrator' ? AdminDashboard :
        role === 'Guest User' ? GuestUser :
        role === 'User' ? User : null;
    return (
        <>
            {NavComponent && <NavComponent />}
            <Cards />
        </>
    );
}

export default function MyRoutes() {
    return (
        <AuthProvider>
            <div>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/admin/creditcard" element={
                        <RouteGuard>
                            <CreditCardReward />
                        </RouteGuard>
                    }
                    />
                    <Route path="/admin/creditcardlist" element={
                        <RouteGuard>
                            <CreditCardList />
                        </RouteGuard>
                    }
                    />
                    <Route path="/Cards" element={
                        <RouteGuard>
                            <CardsPage />
                        </RouteGuard>
                    } />
                    <Route path="/guest" element={
                        <RouteGuard>
                            <GuestUser />
                        </RouteGuard>
                    }
                    />

                    <Route path="/comparisontable" element={
                        <RouteGuard>
                            <ComparisonTablePage />
                        </RouteGuard>
                    }
                    />

                    <Route path="/user" element={
                        <RouteGuard>
                            <User />
                        </RouteGuard>
                    }
                    />
                    <Route path="/user/creditcards" element={
                        <RouteGuard>
                            <CreditCard />
                        </RouteGuard>
                    }
                    />
                    <Route path="/blogs" element={
                        <RouteGuard>
                            <Dashboard />
                        </RouteGuard>
                    } />
                </Routes>
            </div>
        </AuthProvider>
    );
}
