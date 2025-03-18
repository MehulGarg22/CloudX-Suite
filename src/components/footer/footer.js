import react from "react";

export default function Footer(){
    return (
        <div style={{textAlign:'center'}}>
            Copyright ©{(new Date().getFullYear())}- Developed by Mehul Garg
        </div>
    )
}