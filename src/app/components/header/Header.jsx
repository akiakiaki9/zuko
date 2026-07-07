'use client'

import { useEffect, useRef } from 'react'
import { FiMapPin, FiClock, FiPhone, FiArrowRight } from 'react-icons/fi'
import { BsInstagram } from 'react-icons/bs'
import { GiHamburger } from 'react-icons/gi'
import './header.css'

export default function Header() {
  const headerRef = useRef(null)

  useEffect(() => {
    const elements = headerRef.current?.querySelectorAll('.animate-on-load')
    elements?.forEach((el, index) => {
      el.style.animationDelay = `${index * 0.1}s`
    })
  }, [])

  const scrollToMenu = (e) => {
    e.preventDefault()
    const menuSection = document.querySelector('#menu')
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="header" ref={headerRef}>
      <div className="header-bg-overlay"></div>
      <div className="container">
        <div className="header-content">
          <div className="header-left animate-on-load">
            <div className="badge">
              <GiHamburger className="badge-icon" />
              <span className="badge-text">Feel the Taste</span>
            </div>
            <h1>
              ZUKO <span className="highlight">ta'mni his qil</span>
            </h1>
            <p className="subtitle">
              Eng sifatli va mazali fastfud. Har bir luqma — zavq!
            </p>

            <div className="info-grid">
              <div className="info-item">
                <FiMapPin className="info-icon" />
                <div>
                  <strong>Filiallar</strong>
                  <span>Pasquale & Buxoro savdo majmuasi</span>
                </div>
              </div>
              <div className="info-item">
                <FiClock className="info-icon" />
                <div>
                  <strong>Ish vaqti</strong>
                  <span>09:00 - 00:00</span>
                </div>
              </div>
              <div className="info-item">
                <FiPhone className="info-icon" />
                <div>
                  <strong>Yetkazib berish</strong>
                  <span className="phone">99 250 2299</span>
                </div>
              </div>
            </div>

            <div className="header-buttons">
              <button onClick={scrollToMenu} className="btn-primary">
                Buyurtma berish
                <FiArrowRight className="btn-icon" />
              </button>
              <a
                href="https://instagram.com/zukouzbekistan"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-instagram"
              >
                <BsInstagram size={18} />
                Instagram
              </a>
            </div>
          </div>

          <div className="header-right animate-on-load">
            <div className="hero-image">
              <div className="hero-burger-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=600&fit=crop"
                  alt="ZUKO Burger"
                  className="hero-burger-img"
                />
                <div className="hero-burger-shadow"></div>
              </div>
              {/* Плавающие элементы */}
              <div className="floating-elements">
                <div className="float-1">🍟</div>
                <div className="float-2">🥤</div>
                <div className="float-3">🧀</div>
                <div className="float-4">🌶️</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}