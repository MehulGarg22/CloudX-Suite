import React from "react";
import Navbar from "../navbar/navbar";
import AdminForm from "../priviledges/admin/adminForm";
import User from "../priviledges/users/user";
import GuestUser from "../priviledges/guestUser/guestUser";



export default function Dashboard(){
    return(
        <div>
            <div style={{overflowX:'hidden', width:'100%', backgroundColor:'#EBE8DB', height:'92vh'}}>
                {
                    localStorage.getItem("role")=="Administrator" && <AdminForm /> // It contains forms and addition of any details
                }

            </div>
            <div>
                {
                    localStorage.getItem("role")=="Guest User" && <GuestUser /> // Access to portal but limited priviledges.
                }
                {
                    localStorage.getItem("role")=="User" && <User /> //Access to full feature of portal
                }
            </div>
        </div>
    );
}
