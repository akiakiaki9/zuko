import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const { name, rating, review, date } = await request.json()

        const botToken = process.env.TELEGRAM_BOT_TOKEN
        const chatId = process.env.TELEGRAM_CHAT_ID

        if (!botToken || !chatId) {
            return NextResponse.json(
                { error: 'Telegram bot not configured' },
                { status: 500 }
            )
        }

        // Получаем звезды для отображения
        const stars = '⭐'.repeat(rating) + '☆'.repeat(5 - rating)

        const reviewText = `
⭐ YANGI FIKR ⭐
━━━━━━━━━━━━━━━━
👤 Ism: ${name}
📅 Sana: ${date}
⭐ Baho: ${rating}/5 ${stars}
━━━━━━━━━━━━━━━━
💬 Fikr:
${review}
━━━━━━━━━━━━━━━━
    `

        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`

        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: reviewText,
                parse_mode: 'HTML',
            }),
        })

        const data = await response.json()

        if (!data.ok) {
            throw new Error(data.description)
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Telegram API error:', error)
        return NextResponse.json(
            { error: 'Failed to send review' },
            { status: 500 }
        )
    }
}