export default async function handler(req, res) {

if (req.method !== "POST") {
return res.status(405).json({ error: "Method not allowed" })
}

try {

const body = req.body || {}

let messages = body.messages || []

// ensure messages is an array
if (!Array.isArray(messages)) {
messages = []
}

// sanitize every message
const safeMessages = messages
.filter(m => m && typeof m === "object")
.map(m => ({
role: m.role === "assistant" ? "assistant" : m.role === "system" ? "system" : "user",
content: typeof m.content === "string" ? m.content.trim() : ""
}))
.filter(m => m.content.length > 0)

// always ensure a system prompt exists
if (!safeMessages.find(m => m.role === "system")) {
safeMessages.unshift({
role: "system",
content: "You are 20AI, a helpful assistant for entrepreneurs, developers and businesses."
})
}

// if user somehow sends nothing
if (safeMessages.length === 1) {
safeMessages.push({
role: "user",
content: "Hello"
})
}

const response = await fetch("https://api.openai.com/v1/chat/completions", {
method: "POST",
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
},
body: JSON.stringify({
model: "gpt-4o-mini",
messages: safeMessages,
temperature: 0.7
})
})

const data = await response.json()

if (!response.ok) {
return res.status(500).json({
reply: "OpenAI error: " + JSON.stringify(data)
})
}

return res.status(200).json({
reply: data?.choices?.[0]?.message?.content || "No response"
})

} catch (error) {

return res.status(500).json({
reply: "Server error: " + error.message
})

}

}
