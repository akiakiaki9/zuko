'use client'

import { useState, useEffect } from 'react'
import { FiShoppingBag, FiMenu, FiX, FiPhone, FiHome, FiGrid, FiMail, FiMapPin, FiClock } from 'react-icons/fi'
import { useCart } from '@/context/CartContext'
import './navbar.css'
import Image from 'next/image'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { getTotalItems, setIsCartOpen } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Блокировка скролла при открытом мобильном меню
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const navLinks = [
    { name: 'Menu', href: '#menu', icon: <FiGrid size={18} /> },
    { name: 'Kontaktlar', href: '#contacts', icon: <FiMail size={18} /> },
  ]

  const scrollToSection = (e, href) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMobileMenuOpen(false)
    }
  }

  const locations = [
    { name: '1-Filial', address: 'Pasquale to\'g\'risida', icon: <FiMapPin size={16} /> },
    { name: '2-Filial', address: 'Buxoro savdo majmuasi', icon: <FiMapPin size={16} /> }
  ]

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="nav-content">
            <a href="#" className="logo" onClick={(e) => scrollToSection(e, '#')}>
              <div className="logo-icon">
                <img 
                  src="/images/logo.png" 
                  alt="ZUKO Logo"
                  className="brand-logo"
                  priority
                />
              </div>
              <div className="logo-text-wrapper">
                <span className="logo-text">ZUKO</span>
                <span className="logo-tag">Feel the Taste</span>
              </div>
            </a>

            <div className="nav-links">
              {navLinks.map(link => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                >
                  {link.icon}
                  {link.name}
                </a>
              ))}
            </div>

            <button 
              className="cart-icon"
              onClick={() => setIsCartOpen(true)}
            >
              <FiShoppingBag size={22} />
              {getTotalItems() > 0 && (
                <span className="cart-count">{getTotalItems()}</span>
              )}
            </button>

            <button 
              className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)} />
      
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <div className="mobile-logo">
            <img 
              src="/images/logo.png" 
              alt="ZUKO Logo" 
              className="mobile-brand-logo"
            />
            <div>
              <span className="mobile-logo-text">ZUKO</span>
              <span className="mobile-logo-tag">Feel the Taste</span>
            </div>
          </div>
          <button className="mobile-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
            <FiX size={22} />
          </button>
        </div>

        <div className="mobile-menu-links">
          <a href="#" onClick={(e) => scrollToSection(e, '#')} style={{ animationDelay: `0s` }}>
            <FiHome size={18} />
            Bosh sahifa
          </a>
          {navLinks.map((link, index) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
            >
              {link.icon}
              {link.name}
            </a>
          ))}
        </div>

        <div className="mobile-info-section">
          <div className="info-title">
            <FiPhone size={16} />
            <span>Yetkazib berish</span>
          </div>
          <a href="tel:+998992502299" className="mobile-phone">
            +998 99 250-22-99
          </a>
          
          <div className="info-title" style={{ marginTop: '20px' }}>
            <FiClock size={16} />
            <span>Ish vaqti</span>
          </div>
          <div className="mobile-hours">
            09:00 - 00:00
          </div>
        </div>

        <div className="mobile-locations-section">
          <div className="info-title">
            <FiMapPin size={16} />
            <span>Filiallar</span>
          </div>
          <div className="locations-list">
            {locations.map((loc, idx) => (
              <div key={idx} className="location-item">
                {loc.icon}
                <div>
                  <div className="location-name">{loc.name}</div>
                  <div className="location-address">{loc.address}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}