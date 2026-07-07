import { NextResponse } from 'next/server'

const TOKEN = '8638779611:AAGg1V8-pX460xNZEvVPAYDjQH9-8Vw3Njo'
const SITE_URL = 'https://zuko-eight.vercel.app/'

export async function POST(request) {
  try {
    const body = await request.json()
    
    console.log('📩 Получено сообщение:', JSON.stringify(body, null, 2))
    
    if (body.message) {
      const chatId = body.message.chat.id
      const text = body.message.text
      
      console.log(`👤 Пользователь ${chatId} написал: ${text}`)
      
      // Отправляем ответ с КОРРЕКТНЫМИ ссылками
      const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: '🍔 ZUKO - Ta\'mni his qil!\n\n👇 Quyidagi tugmalardan birini bosing:',
          reply_markup: {
            inline_keyboard: [
              [{ text: '🌐 Saytni ochish', url: SITE_URL }],
              [{ text: '📞 Buyurtma berish', url: 'https://zuko-eight.vercel.app/' }],
              [{ text: '📸 Instagram', url: 'https://instagram.com/zukouzbekistan' }]
            ]
          }
        })
      })
      
      const result = await response.json()
      console.log('✅ Ответ Telegram:', JSON.stringify(result, null, 2))
      
      if (!result.ok) {
        console.error('❌ Ошибка Telegram:', result.description)
      }
    } else {
      console.log('⚠️ Не сообщение, а что-то другое:', body)
    }
    
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('❌ Webhook error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Webhook is working! Send POST requests here.' 
  })
}