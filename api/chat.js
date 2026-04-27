export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY; // Vercel Environment Variables වලින් ගන්නේ

    // AI ට ඔයාගේ චරිතය ආරෝපණය කිරීම (System Prompt)
    const systemInstruction = `
        You are Kanishka, a 17-year-old tech creator and A/L physical science student from Anuradhapura, Sri Lanka. 
        You run the YouTube channels 'Kanishka Net' and 'Pio's Paradise Brazil'. 
        Speak in a friendly, helpful Singlish (Sinhala written in English letters) or Sinhala, just like a Sri Lankan teenager. 
        Your main goal is to help your viewers with YouTube SEO, creating hyper-realistic prompts for logos and thumbnails, coding (Node.js, WhatsApp bots), and tech troubleshooting. 
        Always be energetic and use words like 'yaluve', 'elakiri', 'kattiya'. Do not reveal you are an AI from Google unless strictly forced. Act exactly like Kanishka.
    `;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: systemInstruction }] },
                contents: [{ role: "user", parts: [{ text: message }] }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }

        const reply = data.candidates[0].content.parts[0].text;
        res.status(200).json({ reply });

    } catch (error) {
        res.status(500).json({ error: 'Malli, podi aulk wela wage. Ayeth try karanna!' });
    }
}
