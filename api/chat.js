export default async function handler(req,res){

if(req.method !== "POST"){
return res.status(405).json({error:"Method not allowed"})
}

try{

const message =
typeof req.body.message === "string"
? req.body.message.trim()
: ""

if(!message){
return res.status(400).json({reply:"Empty message"})
}

const messages = [
{
role:"system",
content:"You are 20AI, a helpful assistant."
},
{
role:"user",
content:message
}
]

const response = await fetch("https://api.openai.com/v1/chat/completions",{
method:"POST",
headers:{
"Content-Type":"application/json",
"Authorization":`Bearer ${process.env.OPENAI_API_KEY}`
},
body:JSON.stringify({
model:"gpt-4o-mini",
messages
})
})

const data = await response.json()

if(!response.ok){
return res.status(500).json({
reply:"OpenAI error: "+JSON.stringify(data)
})
}

res.status(200).json({
reply:data.choices?.[0]?.message?.content || "No response"
})

}catch(err){

res.status(500).json({
reply:"Server error"
})

}

}
