'use client'

import { useState, useEffect } from 'react'
import { FiMapPin, FiPhone, FiClock, FiStar, FiSend, FiUser, FiMessageSquare, FiExternalLink } from 'react-icons/fi'
import { BsInstagram } from 'react-icons/bs'
import { FaStar } from 'react-icons/fa'
import './contacts.css'

export default function Contacts() {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [userName, setUserName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reviews, setReviews] = useState([])
  const [submitMessage, setSubmitMessage] = useState('')

  // Координаты ресторана
  const coordinates = {
    lat: 39.757298,
    lng: 64.423668,
    name: 'ZUKO Restoran',
    address: 'Buxoro shahri, Pasquale to\'g\'risida'
  }

  // Загрузка отзывов из localStorage
  useEffect(() => {
    const savedReviews = localStorage.getItem('zuko-reviews')
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews))
    } else {
      const demoReviews = [
        {
          id: 1,
          name: 'Sarvar',
          rating: 5,
          text: 'Juda mazali burgerlar! Tez yetkazib berishdi. Albatta qaytaman.',
          date: '2024-01-15'
        },
        {
          id: 2,
          name: 'Dilnoza',
          rating: 4,
          text: 'Lavash ajoyib edi. Kartoshka ham mazali. Tavsiya qilaman!',
          date: '2024-01-14'
        },
        {
          id: 3,
          name: 'Jasur',
          rating: 5,
          text: 'Eng yaxshi fastfud. Pizza ham juda mazali chiqadi.',
          date: '2024-01-13'
        }
      ]
      setReviews(demoReviews)
      localStorage.setItem('zuko-reviews', JSON.stringify(demoReviews))
    }
  }, [])

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    
    if (rating === 0) {
      setSubmitMessage('Iltimos, baho bering!')
      setTimeout(() => setSubmitMessage(''), 3000)
      return
    }
    
    if (!reviewText.trim()) {
      setSubmitMessage('Iltimos, fikringizni yozing!')
      setTimeout(() => setSubmitMessage(''), 3000)
      return
    }
    
    if (!userName.trim()) {
      setSubmitMessage('Iltimos, ismingizni yozing!')
      setTimeout(() => setSubmitMessage(''), 3000)
      return
    }
    
    setIsSubmitting(true)
    
    const currentDate = new Date().toISOString().split('T')[0]
    
    try {
      const response = await fetch('/api/send-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userName,
          rating: rating,
          review: reviewText,
          date: currentDate
        })
      })
      
      if (response.ok) {
        const newReview = {
          id: Date.now(),
          name: userName,
          rating: rating,
          text: reviewText,
          date: currentDate
        }
        
        const updatedReviews = [newReview, ...reviews]
        setReviews(updatedReviews)
        localStorage.setItem('zuko-reviews', JSON.stringify(updatedReviews))
        
        setRating(0)
        setReviewText('')
        setUserName('')
        setSubmitMessage('Rahmat! Fikringiz qabul qilindi! ✅')
        
        setTimeout(() => setSubmitMessage(''), 3000)
      } else {
        setSubmitMessage('Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring!')
        setTimeout(() => setSubmitMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error:', error)
      setSubmitMessage('Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring!')
      setTimeout(() => setSubmitMessage(''), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenFullMap = () => {
    const url = `https://yandex.uz/maps/?ll=${coordinates.lng}%2C${coordinates.lat}&z=17&pt=${coordinates.lng}%2C${coordinates.lat}%2Cflag&l=map`
    window.open(url, '_blank')
  }

  const locations = [
    {
      name: '1-Filial',
      address: 'Pasquale to\'g\'risida',
      icon: '📍',
      coords: '39.757298, 64.423668'
    },
    {
      name: '2-Filial',
      address: 'Buxoro savdo majmuasi',
      icon: '🏢',
      coords: '39.757298, 64.423668'
    }
  ]

  const renderStars = (ratingValue, interactive = false) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`star ${i <= (interactive ? hoverRating || rating : ratingValue) ? 'filled' : ''}`}
          onClick={() => interactive && setRating(i)}
          onMouseEnter={() => interactive && setHoverRating(i)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          size={interactive ? 28 : 16}
        />
      )
    }
    return stars
  }

  return (
    <section id="contacts" className="contacts-section">
      <div className="container">
        <div className="section-header">
          <h2>Biz bilan <span className="highlight">bog‘laning</span></h2>
          <p>Istagan filialga murojaat qiling</p>
        </div>

        <div className="contacts-grid">
          <div className="contact-card">
            <div className="contact-icon">📞</div>
            <h3>Yetkazib berish</h3>
            <a href="tel:992502299" className="phone-number">99 250 2299</a>
            <p className="contact-note">9:00 dan 00:00 gacha</p>
          </div>

          <div className="contact-card">
            <div className="contact-icon">⏰</div>
            <h3>Ish vaqti</h3>
            <p className="working-hours">09:00 - 00:00</p>
            <p>Har kuni</p>
          </div>

          <div className="contact-card">
            <div className="contact-icon">📱</div>
            <h3>Ijtimoiy tarmoqlar</h3>
            <a href="https://instagram.com/zukouzbekistan" target="_blank" rel="noopener noreferrer" className="instagram-link">
              <BsInstagram size={20} />
              @zukouzbekistan
            </a>
          </div>
        </div>

        {/* Яндекс Карта с меткой */}
        <div className="map-container">
          <div className="map-header">
            <div>
              <h3>📍 Bizning manzil</h3>
              <p className="map-address-text">{coordinates.address}</p>
            </div>
            <button onClick={handleOpenFullMap} className="open-maps-btn">
              <FiExternalLink size={16} />
              Karta orqali ko'rish
            </button>
          </div>
          
          {/* iframe карта с меткой */}
          <iframe
            src={`https://yandex.uz/map-widget/v1/?ll=${coordinates.lng}%2C${coordinates.lat}&z=17&pt=${coordinates.lng}%2C${coordinates.lat}%2Cpm2rdm&l=map`}
            width="100%"
            height="400"
            frameBorder="0"
            allowFullScreen
            className="yandex-map-iframe"
            title="ZUKO Restoran xaritasi"
          />
          
          <div className="map-footer">
            <div className="map-coords">
              <FiMapPin size={14} />
              <span>Koordinatalar: {coordinates.lat}, {coordinates.lng}</span>
            </div>
            <a 
              href={`https://yandex.uz/navi/?what=geo&geo=${coordinates.lat},${coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="navigate-link"
            >
              Yo'nalish olish
            </a>
          </div>
        </div>

        {/* Форма для отзывов и оценок */}
        <div className="reviews-section">
          <div className="reviews-header">
            <h3>⭐ Mijozlar fikrlari</h3>
            <p>Sizning fikringiz biz uchun muhim</p>
          </div>

          <div className="review-form-container">
            <form onSubmit={handleSubmitReview} className="review-form">
              <div className="form-group">
                <label>
                  <FiUser size={16} />
                  Ismingiz
                </label>
                <input
                  type="text"
                  placeholder="Ismingizni kiriting"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>
                  <FiStar size={16} />
                  Baho bering
                </label>
                <div className="rating-stars">
                  {renderStars(rating, true)}
                  <span className="rating-text">
                    {rating === 0 ? 'Baho tanlang' : `${rating} / 5`}
                  </span>
                </div>
              </div>
              
              <div className="form-group">
                <label>
                  <FiMessageSquare size={16} />
                  Fikringiz
                </label>
                <textarea
                  placeholder="Biz haqimizda fikringizni yozing..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows="4"
                  required
                />
              </div>
              
              <button type="submit" className="submit-review-btn" disabled={isSubmitting}>
                <FiSend size={18} />
                {isSubmitting ? 'Yuborilmoqda...' : 'Fikr bildirish'}
              </button>
              
              {submitMessage && (
                <div className={`submit-message ${submitMessage.includes('Rahmat') ? 'success' : 'error'}`}>
                  {submitMessage}
                </div>
              )}
            </form>
          </div>

          {/* Список отзывов */}
          <div className="reviews-list">
            <h4>So‘nggi fikrlar ({reviews.length})</h4>
            <div className="reviews-grid">
              {reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <strong>{review.name}</strong>
                        <div className="review-stars">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                    </div>
                    <span className="review-date">{review.date}</span>
                  </div>
                  <p className="review-text">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="locations-grid">
          <h3 className="locations-title">Filiallarimiz</h3>
          <div className="location-cards">
            {locations.map((loc, idx) => (
              <div key={idx} className="location-card">
                <div className="location-icon">{loc.icon}</div>
                <div>
                  <h4>{loc.name}</h4>
                  <p>{loc.address}</p>
                  <small className="location-coords">{loc.coords}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}