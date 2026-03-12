export default async function handler(req, res) {

if (req.method !== "POST") {
return res.status(405).json({ error: "Method not allowed" })
}

try {

const { messages } = req.body

// ensure messages exist
if (!messages || !Array.isArray(messages)) {
return res.status(400).json({ reply: "Invalid message format" })
}

// remove invalid messages
const cleanMessages = messages
.filter(m => m && typeof m.content === "string" && m.content.trim() !== "")
.map(m => ({
role: m.role,
content: m.content.trim()
}))

// ensure system prompt exists
if (cleanMessages.length === 0) {
cleanMessages.push({
role: "system",
content: "You are 20AI, an intelligent assistant helping entrepreneurs and developers."
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
messages: cleanMessages,
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
reply: data.choices?.[0]?.message?.content || "No response"
})

} catch (error) {

return res.status(500).json({
reply: "Server error: " + error.message
})

}

}
