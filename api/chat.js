export default async function handler(req, res) {

if (req.method !== "POST") {
return res.status(405).json({ error: "Method not allowed" })
}

try {

const { message } = req.body

const response = await fetch("https://api.openai.com/v1/chat/completions", {
method: "POST",
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
},
body: JSON.stringify({
model: "gpt-4o-mini",
messages: [
{ role: "system", content: "You are a helpful AI assistant." },
{ role: "user", content: message }
],
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
reply: data.choices[0].message.content
})

} catch (error) {

return res.status(500).json({
reply: "Server error: " + error.message
})

}

}
