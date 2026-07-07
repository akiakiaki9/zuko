'use client'

import { useState, useEffect } from 'react'
import { FiX, FiMinus, FiPlus, FiTrash2, FiMapPin, FiLoader, FiCheck, FiNavigation, FiUser, FiPhone, FiHome, FiCreditCard } from 'react-icons/fi'
import { useCart } from '@/context/CartContext'
import './cart.css'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice, isCartOpen, setIsCartOpen } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [locationStatus, setLocationStatus] = useState('idle')
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    lat: null,
    lng: null
  })

  // Блокировка скролла при открытии корзины
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isCartOpen])

  // Блокировка скролла при открытии модалки
  useEffect(() => {
    if (isCheckoutModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isCheckoutModalOpen])

  // Определение геолокации при открытии модалки
  useEffect(() => {
    if (isCheckoutModalOpen && !customerInfo.address && locationStatus === 'idle') {
      getLocation()
    }
  }, [isCheckoutModalOpen])

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error')
      return
    }

    setIsGettingLocation(true)
    setLocationStatus('loading')

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        setCustomerInfo(prev => ({
          ...prev,
          lat: latitude,
          lng: longitude
        }))

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          )
          const data = await response.json()

          if (data && data.display_name) {
            const address = data.display_name
              .split(',')
              .slice(0, 4)
              .join(', ')
              .trim()

            setCustomerInfo(prev => ({
              ...prev,
              address: address
            }))
            setLocationStatus('success')

            setTimeout(() => {
              setLocationStatus('idle')
            }, 3000)
          }
        } catch (error) {
          console.error('Ошибка получения адреса:', error)
          setLocationStatus('error')
        } finally {
          setIsGettingLocation(false)
        }
      },
      (error) => {
        console.error('Ошибка геолокации:', error)
        setIsGettingLocation(false)
        setLocationStatus('error')
        if (error.code === 1) {
          alert('📍 Пожалуйста, разрешите доступ к геолокации')
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  }

  const openCheckout = () => {
    setIsCheckoutModalOpen(true)
  }

  const closeCheckout = () => {
    setIsCheckoutModalOpen(false)
  }

  const handleOrderSubmit = async (e) => {
    e.preventDefault()

    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert('Iltimos, barcha maydonlarni to\'ldiring')
      return
    }

    setIsSubmitting(true)

    const mapLinks = customerInfo.lat && customerInfo.lng ? `

🗺️ Xarita orqali ko'rish:
• Google Maps: https://www.google.com/maps?q=${customerInfo.lat},${customerInfo.lng}
• Yandex Maps: https://yandex.uz/maps/?ll=${customerInfo.lng},${customerInfo.lat}&z=17&pt=${customerInfo.lng},${customerInfo.lat},flag
    ` : ''

    const orderText = `
🛍️ YANGI BUYURTMA
━━━━━━━━━━━━━━━━
👤 Mijoz: ${customerInfo.name}
📞 Telefon: ${customerInfo.phone}
📍 Manzil: ${customerInfo.address}
${mapLinks}
━━━━━━━━━━━━━━━━
📋 Buyurtma:
${cart.map(item => `• ${item.name} x${item.quantity} = ${(item.price * item.quantity).toLocaleString()} so‘m`).join('\n')}
━━━━━━━━━━━━━━━━
💰 Jami: ${getTotalPrice().toLocaleString()} so‘m
    `

    try {
      const response = await fetch('/api/send-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: orderText })
      })

      if (response.ok) {
        alert('✅ Buyurtmangiz qabul qilindi!')
        clearCart()
        setCustomerInfo({ name: '', phone: '', address: '', lat: null, lng: null })
        setLocationStatus('idle')
        setIsCheckoutModalOpen(false)
        setIsCartOpen(false)
      } else {
        alert('Xatolik yuz berdi. Iltimos, telefon orqali buyurtma bering.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Xatolik yuz berdi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isCartOpen) return null

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsCartOpen(false)} />
      <div className="cart-drawer">
        <div className="cart-header">
          <h3>
            <span>🛒</span> Savatcha
            {cart.length > 0 && <span className="cart-count-badge">{cart.length}</span>}
          </h3>
          <button className="close-btn" onClick={() => setIsCartOpen(false)}>
            <FiX size={22} />
          </button>
        </div>

        <div className="cart-content">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <span className="empty-icon">🛒</span>
              <p>Savat hozircha bo‘sh</p>
              <button className="btn-primary" onClick={() => setIsCartOpen(false)}>
                Menyuga o‘tish
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-price">{item.price.toLocaleString()} so‘m</span>
                    </div>
                    <div className="item-actions">
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <FiMinus size={12} />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <FiPlus size={12} />
                        </button>
                      </div>
                      <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="cart-total">
                  <span>Jami:</span>
                  <span className="total-price">{getTotalPrice().toLocaleString()} so‘m</span>
                </div>
                <button className="checkout-btn" onClick={openCheckout}>
                  <FiCreditCard size={18} />
                  O‘tish
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ===== CHECKOUT MODAL ===== */}
      {isCheckoutModalOpen && (
        <>
          <div className="modal-overlay" onClick={closeCheckout} />
          <div className="checkout-modal">
            <div className="modal-header">
              <h3>📋 Buyurtma rasmiylashtirish</h3>
              <button className="modal-close-btn" onClick={closeCheckout}>
                <FiX size={22} />
              </button>
            </div>

            <div className="modal-body">
              <div className="order-summary-mini">
                <span className="items-count">{cart.length} ta mahsulot</span>
                <span className="total-amount">{getTotalPrice().toLocaleString()} so‘m</span>
              </div>

              <form onSubmit={handleOrderSubmit} className="checkout-form">
                {/* Поле Имя */}
                <div className="form-group">
                  <div className="input-icon">
                    <FiUser size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder="Ismingiz"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    required
                  />
                </div>

                {/* Поле Телефон */}
                <div className="form-group">
                  <div className="input-icon">
                    <FiPhone size={16} />
                  </div>
                  <input
                    type="tel"
                    placeholder="Telefon raqam"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    required
                  />
                </div>

                {/* Поле Адрес с геолокацией */}
                <div className="address-wrapper">
                  <div className="form-group address-group">
                    <div className="input-icon">
                      <FiHome size={16} />
                    </div>
                    <input
                      type="text"
                      placeholder="Yetkazib berish manzili"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className={`location-btn ${locationStatus}`}
                      onClick={getLocation}
                      disabled={isGettingLocation || locationStatus === 'success'}
                      title="Avtomatik manzilni aniqlash"
                    >
                      {locationStatus === 'loading' && <FiLoader className="spinner" size={16} />}
                      {locationStatus === 'success' && <FiCheck size={16} />}
                      {locationStatus === 'error' && <FiMapPin size={16} />}
                      {(locationStatus === 'idle' || locationStatus === '') && <FiNavigation size={16} />}
                    </button>
                  </div>

                  <div className="location-status">
                    {locationStatus === 'loading' && (
                      <span className="status-loading">📍 Manzil aniqlanmoqda...</span>
                    )}
                    {locationStatus === 'success' && (
                      <span className="status-success">✅ Manzil avtomatik aniqlandi!</span>
                    )}
                    {locationStatus === 'error' && (
                      <span className="status-error">❌ Manzilni aniqlab bo‘lmadi</span>
                    )}
                    {customerInfo.lat && customerInfo.lng && locationStatus !== 'loading' && (
                      <span className="status-coords">
                        📍 {customerInfo.lat.toFixed(6)}, {customerInfo.lng.toFixed(6)}
                      </span>
                    )}
                  </div>
                </div>

                <button type="submit" className="submit-order-btn" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <FiLoader className="spinner" size={18} />
                      Yuborilmoqda...
                    </>
                  ) : (
                    <>
                      <FiCheck size={18} />
                      Buyurtma berish
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  )
}