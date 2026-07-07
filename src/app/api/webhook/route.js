import { NextResponse } from 'next/server'

const TOKEN = '8638779611:AAGg1V8-pX460xNZEvVPAYDjQH9-8Vw3Njo'
const SITE_URL = 'https://zuko-eight.vercel.app/'

export async function POST(request) {
    try {
        const body = await request.json()

        // Если есть сообщение
        if (body.message) {
            const chatId = body.message.chat.id

            // Отправляем ответ с кнопками
            await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: '🍔 ZUKO - Ta\'mni his qil!\n\n👇 Quyidagi tugmalardan birini bosing:',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '🌐 Saytni ochish', url: SITE_URL }],
                            [{ text: '📞 Buyurtma berish', url: 'tel:+998992502299' }],
                            [{ text: '📸 Instagram', url: 'https://instagram.com/zukouzbekistan' }]
                        ]
                    }
                })
            })
        }

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('Webhook error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}