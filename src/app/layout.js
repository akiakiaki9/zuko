import './styles/globals.css'
import CartProvider from '@/context/CartContext'

export const metadata = {
  title: 'ZUKO | Ta\'mni his qil — Feel the Taste',
  description: 'Eng mazali fastfud. Yetkazib berish +998 99 250-22-99',
  icons: {
    icon: '/images/logo.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="uz">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
};