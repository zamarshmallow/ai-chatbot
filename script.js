const input = document.getElementById("messageInput")
const messages = document.getElementById("messages")

/* conversation memory */
let conversation = [
{
role: "system",
content: "You are 20AI, an intelligent assistant that helps entrepreneurs, developers, and businesses."
}
]

async function sendMessage(){

const text = input.value.trim()

if(!text) return

/* show user message */

messages.innerHTML += `
<div class="message user">
${text}
</div>
`

input.value = ""

/* thinking indicator */

const thinking = document.createElement("div")
thinking.className = "message bot"
thinking.innerText = "Thinking..."
messages.appendChild(thinking)

messages.scrollTop = messages.scrollHeight

/* add user message to memory */

conversation.push({
role: "user",
content: text
})

/* remove invalid messages */

const cleanMessages = conversation.filter(
m => m.content && typeof m.content === "string"
)

/* limit memory size */

const limitedMessages = cleanMessages.slice(-20)

try{

const response = await fetch("/api/chat",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
messages: limitedMessages
})
})

const data = await response.json()

const reply = data.reply || "No response"

/* update thinking bubble */

thinking.innerText = reply

/* store AI reply */

conversation.push({
role: "assistant",
content: reply
})

messages.scrollTop = messages.scrollHeight

}catch(error){

thinking.innerText = "Server error"

}

}


/* ENTER KEY SUPPORT */

input.addEventListener("keydown", function(event){

if(event.key === "Enter" && !event.shiftKey){

event.preventDefault()
sendMessage()

}

})


/* NEW CHAT */

function newChat(){

messages.innerHTML = ""

conversation = [
{
role:"system",
content:"You are 20AI, an intelligent assistant helping entrepreneurs and developers."
}
]

}
