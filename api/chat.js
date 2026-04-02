export default async function handler(req, res) {

if (req.method !== "POST") {
  return res.status(405).json({ error: "Method not allowed" })
}

try {

const { message } = req.body
const userMessage = message?.trim()

if (!userMessage) {
  return res.status(400).json({ reply: "Empty message" })
}

// AI RESPONSE
const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
  },
  body: JSON.stringify({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful AI assistant." },
      { role: "user", content: userMessage }
    ]
  })
})

const aiData = await aiRes.json()

if(!aiData.choices){
return res.status(500).json({ reply:"OpenAI error", title:"New Chat" })
}

const reply = aiData.choices[0].message.content

// TITLE
const titleRes = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
  },
  body: JSON.stringify({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Generate a short chat title (max 4 words)." },
      { role: "user", content: userMessage }
    ]
  })
})

const titleData = await titleRes.json()

const title =
titleData?.choices?.[0]?.message?.content?.replace(/["']/g,"").trim() || "New Chat"

return res.status(200).json({ reply, title })

} catch (err) {

return res.status(500).json({ reply:"Server error", title:"New Chat" })

}

}
