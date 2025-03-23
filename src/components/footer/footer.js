import react from "react";

export default function Footer(){
    return (
        <div style={{textAlign:'center'}}>
            Copyright ©{(new Date().getFullYear())}- Developed by <a target="_blank" style={{color:'black', cursor:'pointer'}} href="https://mehulgarg.netlify.app/" >Mehul Garg</a> 
        </div>
    )
}