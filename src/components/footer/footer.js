import React from "react";
import "./footer.css"; // Assuming you have a CSS file for styling


export default function Footer() {
    return (
        <div className="footer-content">
            <div className="footer-wrapper">
                <p className="copyright-text">
                    © {new Date().getFullYear()} CloudX Suite. All rights reserved.
                </p>
                <div className="developer-credit">
                    Crafted with ❤️ by 
                    <a 
                        href="https://mehulgarg.netlify.app/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="developer-link"
                    >
                        Mehul Garg
                    </a>
                </div>
            </div>
        </div>
    );
}
