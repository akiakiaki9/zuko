'use client'

import { useState, useEffect, useRef } from 'react'
import { FiPlus, FiMinus, FiShoppingCart } from 'react-icons/fi'
import { useCart } from '@/context/CartContext'
import './menu.css'

const menuItems = [
  // Burgerlar
  { id: 1, name: 'ZUKO Burger', description: 'Ikkita go\'sht kotleti, salat, pomidor, sous', price: 32000, category: 'burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&fit=crop', popular: true },
  { id: 2, name: 'Cheese Burger', description: 'Ikkita go\'sht kotleti, qo\'shaloq pishloq', price: 28000, category: 'burger', image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=300&h=300&fit=crop', popular: true },
  { id: 3, name: 'Chicken Burger', description: 'Tovuq kotleti, salat, mayonez', price: 25000, category: 'burger', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZk7eTwSX46LTR6A0FHQTlHO5Dq9VjZsgNJg&s' },
  { id: 4, name: 'Double Burger', description: 'Ikkita go\'sht kotleti, qo\'shaloq pishloq, bekon', price: 38000, category: 'burger', image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=300&h=300&fit=crop', popular: true },
  
  // Lavash
  { id: 5, name: 'Lavash Classic', description: 'Go\'sht, pomidor, bodring, sous, lavash', price: 22000, category: 'lavash', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQulVgOpjdSpsszZ_esSpbPjApIZA0kK2flKw&s', popular: true },
  { id: 6, name: 'Lavash Chicken', description: 'Tovuq, pomidor, bodring, sous, lavash', price: 20000, category: 'lavash', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300&h=300&fit=crop', popular: true },
  { id: 7, name: 'Lavash Cheese', description: 'Go\'sht, qo\'shaloq pishloq, sous, lavash', price: 24000, category: 'lavash', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300&h=300&fit=crop' },
  { id: 8, name: 'Mini Lavash', description: 'Kichik lavash, go\'sht, sous', price: 15000, category: 'lavash', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnaMwduGY78Epi5u8F0nAJOT2hyJrXCcCTzA&s' },
  
  // Pizza
  { id: 9, name: 'Pepperoni Pizza', description: 'Pepperoni, pishloq, pomidor sousi', price: 45000, category: 'pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=300&fit=crop', popular: true },
  { id: 10, name: 'Margherita Pizza', description: 'Pishloq, pomidor, reyhan', price: 38000, category: 'pizza', image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=300&h=300&fit=crop' },
  { id: 11, name: 'Chicken BBQ Pizza', description: 'Tovuq, BBQ sous, pishloq', price: 48000, category: 'pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=300&fit=crop', popular: true },
  { id: 12, name: 'Mixed Pizza', description: 'Go\'sht, tovuq, kolbasa, qo\'ziqorin', price: 55000, category: 'pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=300&fit=crop' },
  
  // Garnirlar
  { id: 13, name: 'Fransuz Kartoshkasi', description: 'Oltin rangda qovurilgan kartoshka', price: 12000, category: 'sides', image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=300&h=300&fit=crop', popular: true },
  { id: 14, name: 'Nuggets (6 dona)', description: 'Xushbichim tovuq nuggetslari', price: 18000, category: 'sides', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=300&h=300&fit=crop' },
  { id: 15, name: 'Onion Rings', description: 'Piramida halqalari', price: 15000, category: 'sides', image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=300&h=300&fit=crop' },
  { id: 16, name: 'Cheese Sticks', description: 'Pishloqli tayoqchalar', price: 17000, category: 'sides', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop' },
  
  // Ichimliklar
  { id: 17, name: 'Coca-Cola', description: '0.5l', price: 8000, category: 'drinks', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300&h=300&fit=crop' },
  { id: 18, name: 'Fanta', description: '0.5l', price: 8000, category: 'drinks', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&h=300&fit=crop' },
  { id: 19, name: 'Sprite', description: '0.5l', price: 8000, category: 'drinks', image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=300&h=300&fit=crop' },
  { id: 20, name: 'Suv', description: '0.5l', price: 5000, category: 'drinks', image: 'https://s.optlist.ru/i/67/38/16702724b9524ee7-6738-1.jpg' },
  
  // Kombo
  { id: 21, name: 'ZUKO Combo', description: 'Burger + Kartoshka + Cola', price: 45000, category: 'combo', image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=300&h=300&fit=crop', popular: true },
  { id: 22, name: 'Family Combo', description: '2 Burger + Kartoshka + 2 Cola + Nuggets', price: 85000, category: 'combo', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeMpMQFON-dqkNl0iGYyqiPxThf-DYwDIFRA&s', popular: true },
  { id: 23, name: 'Student Combo', description: 'Burger + Kartoshka + Cola', price: 35000, category: 'combo', image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=300&h=300&fit=crop' },
]

const categories = [
  { id: 'all', name: 'Hammasi', icon: '🍽️' },
  { id: 'burger', name: 'Burgerlar', icon: '🍔' },
  { id: 'lavash', name: 'Lavash', icon: '🌯' },
  { id: 'pizza', name: 'Pitsa', icon: '🍕' },
  { id: 'sides', name: 'Garnirlar', icon: '🍟' },
  { id: 'drinks', name: 'Ichimliklar', icon: '🥤' },
  { id: 'combo', name: 'Kombo', icon: '🍱' },
]

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [quantities, setQuantities] = useState({})
  const [isAnimating, setIsAnimating] = useState(false)
  const { addToCart } = useCart()
  const sectionRef = useRef(null)
  const gridRef = useRef(null)

  // Функция для анимации карточек
  const animateCards = () => {
    const items = document.querySelectorAll('.menu-item')
    items.forEach((item, idx) => {
      // Сначала скрываем
      item.classList.remove('visible')
      // Затем показываем с задержкой
      setTimeout(() => {
        item.classList.add('visible')
      }, idx * 50)
    })
  }

  // При изменении категории перезапускаем анимацию
  useEffect(() => {
    setIsAnimating(true)
    // Небольшая задержка для DOM обновления
    setTimeout(() => {
      animateCards()
      setIsAnimating(false)
    }, 50)
  }, [activeCategory])

  // Начальная анимация при загрузке
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCards()
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const filteredItems = menuItems.filter(item =>
    activeCategory === 'all' ? true : item.category === activeCategory
  )

  const updateQuantity = (id, delta) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }))
  }

  const handleAddToCart = (item) => {
    const quantity = quantities[item.id] || 1
    if (quantity > 0) {
      addToCart({ ...item, quantity })
      setQuantities(prev => ({ ...prev, [item.id]: 0 }))
    }
  }

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId)
    // Скроллим к меню
    const menuSection = document.querySelector('#menu')
    if (menuSection) {
      const offset = 80
      const elementPosition = menuSection.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section id="menu" className="menu-section" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <h2>Bizning <span className="highlight">Menu</span></h2>
          <p>Eng mazali taomlar faqat ZUKO'da</p>
        </div>

        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat.id)}
            >
              <span className="category-icon">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        <div className="menu-grid" ref={gridRef}>
          {filteredItems.map(item => (
            <div key={item.id} className="menu-item">
              {item.popular && <div className="popular-badge">🔥 Ommabop</div>}
              <div className="item-image-wrapper">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="item-image"
                  loading="lazy"
                />
              </div>
              <h3>{item.name}</h3>
              <p className="item-desc">{item.description}</p>
              <div className="item-price">{item.price.toLocaleString()} so‘m</div>

              <div className="item-actions">
                <div className="quantity-selector">
                  <button onClick={() => updateQuantity(item.id, -1)} disabled={(quantities[item.id] || 0) <= 0}>
                    <FiMinus />
                  </button>
                  <span>{quantities[item.id] || 0}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}>
                    <FiPlus />
                  </button>
                </div>
                <button
                  className="add-to-cart"
                  onClick={() => handleAddToCart(item)}
                  disabled={(quantities[item.id] || 0) === 0}
                >
                  <FiShoppingCart /> Savatga
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredItems.length === 0 && (
          <div className="no-items">
            <p>Bu kategoriyada hozircha taomlar mavjud emas</p>
          </div>
        )}
      </div>
    </section>
  )
}