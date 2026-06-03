import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const { text } = await request.json()

        const botToken = process.env.TELEGRAM_BOT_TOKEN
        const chatId = process.env.TELEGRAM_CHAT_ID

        if (!botToken || !chatId) {
            return NextResponse.json(
                { error: 'Telegram bot not configured' },
                { status: 500 }
            )
        }

        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`

        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
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
            { error: 'Failed to send message' },
            { status: 500 }
        )
    }
}