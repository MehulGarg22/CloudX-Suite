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
import Footer from "../footer/footer";

// Layout wrapper that adds Footer to every page
function PageLayout({ children }) {
    return (
        <div className="page-layout-with-footer">
            <div className="page-layout-content">{children}</div>
            <Footer />
        </div>
    );
}


function ComparisonTablePage() {
    const role = sessionStorage.getItem("role");
    const NavComponent = role === 'Administrator' ? AdminDashboard :
        role === 'Guest User' ? GuestUser : null;
    return (
        <PageLayout>
            {NavComponent && <NavComponent />}
            <GeneralCardComparisonTable />
        </PageLayout>
    );
}

function CardsPage() {
    const role = sessionStorage.getItem("role");
    const NavComponent = role === 'Administrator' ? AdminDashboard :
        role === 'Guest User' ? GuestUser :
        role === 'User' ? User : null;
    return (
        <PageLayout>
            {NavComponent && <NavComponent />}
            <Cards />
        </PageLayout>
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
                            <PageLayout><CreditCardReward /></PageLayout>
                        </RouteGuard>
                    }
                    />
                    <Route path="/admin/creditcardlist" element={
                        <RouteGuard>
                            <PageLayout><CreditCardList /></PageLayout>
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
                            <PageLayout><GuestUser /></PageLayout>
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
                            <PageLayout><User /></PageLayout>
                        </RouteGuard>
                    }
                    />
                    <Route path="/user/creditcards" element={
                        <RouteGuard>
                            <PageLayout><CreditCard /></PageLayout>
                        </RouteGuard>
                    }
                    />
                    <Route path="/blogs" element={
                        <RouteGuard>
                            <PageLayout><Dashboard /></PageLayout>
                        </RouteGuard>
                    } />
                </Routes>
            </div>
        </AuthProvider>
    );
}
