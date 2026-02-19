import React from 'react'
import { Phone, Mail, GitHub, Instagram, YouTube, LinkedIn } from '@mui/icons-material'
import '../componentStyles/componentStyles.css'

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Section1 */}
                <div className="footer-section contact">
                    <h3>Contact Us</h3>
                    <p><Phone fontSize='small' />Phone: 9821573456</p>
                    <p><Mail fontSize='small' />Email: parbat9821@gmail.com</p>
                </div>
        
                {/* Section2 */}
                <div className="footer-section social">
                    <h3>Follow Us</h3>
                    <div className="social-links">
                        <a href="" target='_blank'>
                            <GitHub className='social-icon' />
                        </a>
                        <a href="" target='_blank'>
                            <LinkedIn className='social-icon' />
                        </a>
                        <a href="" target='_blank'>
                            <YouTube className='social-icon' />
                        </a>
                        <a href="" target='_blank'>
                            <Instagram className='social-icon' />
                        </a>
                    </div>
                </div>
                
                {/* Section3 */}
                
                <div className="footer-section about">
                    <h3>About </h3>
                    <p>Genuine Clothing Brands and High Quality Products.</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2026 All Rights Reserved</p>
            </div>
        </footer>
    )
}


export default Footer;