'use client'

import { useState } from 'react'
import { FiX, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi'
import { useCart } from '@/context/CartContext'
import './cart.css'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice, isCartOpen, setIsCartOpen } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' })

  const handleOrderSubmit = async (e) => {
    e.preventDefault()
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert('Iltimos, barcha maydonlarni to\'ldiring')
      return
    }

    setIsSubmitting(true)

    const orderText = `
🛍️ YANGI BUYURTMA
━━━━━━━━━━━━━━━━
👤 Mijoz: ${customerInfo.name}
📞 Telefon: ${customerInfo.phone}
📍 Manzil: ${customerInfo.address}
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
        alert('Buyurtmangiz qabul qilindi! Tez orada siz bilan bog‘lanamiz.')
        clearCart()
        setCustomerInfo({ name: '', phone: '', address: '' })
        setIsCartOpen(false)
      } else {
        alert('Xatolik yuz berdi. Iltimos, telefon orqali buyurtma bering.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Xatolik yuz berdi. Iltimos, telefon orqali buyurtma bering.')
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

              <div className="cart-total">
                <span>Jami:</span>
                <span className="total-price">{getTotalPrice().toLocaleString()} so‘m</span>
              </div>

              <form onSubmit={handleOrderSubmit} className="order-form">
                <h4>Buyurtma berish</h4>
                <input
                  type="text"
                  placeholder="Ismingiz"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  required
                />
                <input
                  type="tel"
                  placeholder="Telefon raqam"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Yetkazib berish manzili"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  required
                />
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Yuborilmoqda...' : 'Buyurtma berish'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  )
}