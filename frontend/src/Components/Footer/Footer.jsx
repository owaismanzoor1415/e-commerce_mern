import React from 'react'
import './Footer.css'

import footer_logo from '../Assets/nav-logo.png'
import linkedin_icon from '../Assets/linkedin_icon.png'
import github_icon from '../Assets/github_icon.png'
import whatsapp_icon from '../Assets/whatsapp_icon.png'

const Footer = () => {
  return (
    <div className='footer'>
      <div className="footer-logo">
        <img src={footer_logo} alt="" />
        <p>SwiftCart</p>
      </div>
      {/* <ul className="footer-links">
        <li>Company</li>
        <li>Products</li>
        <li>Offices</li>
        <li>About</li>
        <li>Contact</li>
      </ul> */}
      <div className="footer-social-icons">
  <a
    href="https://www.linkedin.com/in/owais-manzoor-989314261/"
    target="_blank"
    rel="noopener noreferrer"
    className="footer-icons-container"
  >
    <img src={linkedin_icon} alt="LinkedIn" />
  </a>

  <a
    href="https://github.com/owaismanzoor1415"
    target="_blank"
    rel="noopener noreferrer"
    className="footer-icons-container"
  >
    <img src={github_icon} alt="GitHub" />
  </a>

  <a
    href="https://wa.me/919999999999"
    target="_blank"
    rel="noopener noreferrer"
    className="footer-icons-container"
  >
    <img src={whatsapp_icon} alt="WhatsApp" />
  </a>
</div>

      <div className="footer-copyright">
        <hr />
        <p>Developed by OWAIS</p>
      </div>
    </div>
  )
}

export default Footer
