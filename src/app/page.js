'use client'

import Cart from "./components/cart/Cart"
import Contacts from "./components/contacts/Contacts"
import Footer from "./components/footer/Footer"
import Header from "./components/header/Header"
import Menu from "./components/menu/Menu"
import Navbar from "./components/navbar/Navbar"


export default function Home() {
  return (
    <>
      <Navbar />
      <Header />
      <Menu />
      <Contacts />
      <Cart />
      <Footer />
    </>
  )
};