'use client'

import { FiHeart, FiCode, FiExternalLink } from 'react-icons/fi'
import { BsInstagram } from 'react-icons/bs'
import './footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h2>ZUKO</h2>
            <p>Ta'mni his qil — Feel the Taste</p>
          </div>

          <div className="footer-links">
            <a href="#menu">Menu</a>
            <a href="#contacts">Kontaktlar</a>
            <a href="https://instagram.com/zukouzbekistan" target="_blank" rel="noopener noreferrer">
              <BsInstagram /> Instagram
            </a>
          </div>
        </div>

        <div className="footer-developer">
          <div className="developer-info">
            <FiCode size={16} />
            <span>Developed by</span>
            <a 
              href="https://akbarsoft.uz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="developer-link"
            >
              Akbar Soft
              <FiExternalLink size={12} />
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} ZUKO. Barcha huquqlar himoyalangan.</p>
          <p className="made-with">
            Made with <FiHeart color="#FD1D03" /> for ZUKO Uzbekistan
          </p>
        </div>
      </div>
    </footer>
  )
}