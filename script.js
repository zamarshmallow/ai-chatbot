async function sendMessage(){

const input = document.getElementById("message")
const chat = document.getElementById("chat")

const text = input.value.trim()

if(!text) return

chat.innerHTML += `<div class="message user">You: ${text}</div>`

input.value=""

try{

const response = await fetch("/api/chat",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({message:text})
})

const data = await response.json()

chat.innerHTML += `<div class="message bot">AI: ${data.reply}</div>`

chat.scrollTop = chat.scrollHeight

}catch(error){

chat.innerHTML += `<div class="message bot">Error contacting AI</div>`

}

}
