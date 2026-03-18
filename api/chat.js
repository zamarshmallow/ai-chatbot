export default async function handler(req, res) {

if (req.method !== "POST") {
  return res.status(405).json({ error: "Method not allowed" })
}

try {

const { message } = req.body

// SAFETY CHECK
const userMessage =
  typeof message === "string" ? message.trim() : ""

if (!userMessage) {
  return res.status(400).json({ reply: "Empty message" })
}

/* =========================
   MAIN AI RESPONSE
========================= */

const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
  },
  body: JSON.stringify({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a helpful AI assistant."
      },
      {
        role: "user",
        content: userMessage
      }
    ],
    temperature: 0.7
  })
})

const aiData = await aiResponse.json()

const aiReply =
  aiData?.choices?.[0]?.message?.content || "No response"


/* =========================
   CHAT TITLE GENERATION
========================= */

const titleResponse = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
  },
  body: JSON.stringify({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Generate a short chat title (max 4 words). No quotes."
      },
      {
        role: "user",
        content: userMessage
      }
    ],
    temperature: 0.5
  })
})

const titleData = await titleResponse.json()

let chatTitle =
  titleData?.choices?.[0]?.message?.content || "New Chat"

// CLEAN TITLE
chatTitle = chatTitle.replace(/["']/g, "").trim()


/* =========================
   RESPONSE BACK TO FRONTEND
========================= */

return res.status(200).json({
  reply: aiReply,
  title: chatTitle
})

} catch (error) {

return res.status(500).json({
  reply: "Server error"
})

}

}