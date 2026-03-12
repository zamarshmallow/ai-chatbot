const input = document.getElementById("messageInput")
const sendBtn = document.getElementById("sendBtn")
const messages = document.getElementById("messages")

async function sendMessage(){

const text = input.value.trim()

if(!text) return

messages.innerHTML += `<div class="message user">${text}</div>`

input.value=""

const thinking = document.createElement("div")
thinking.className="message bot"
thinking.innerText="Thinking..."
messages.appendChild(thinking)

messages.scrollTop = messages.scrollHeight

try{

const response = await fetch("/api/chat",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
message:text
})
})

const data = await response.json()

thinking.innerText = data.reply || "No response"

}catch(err){

thinking.innerText="Server error"

}

}

sendBtn.addEventListener("click", sendMessage)

input.addEventListener("keydown", function(e){

if(e.key==="Enter" && !e.shiftKey){
e.preventDefault()
sendMessage()
}

})

function newChat(){
messages.innerHTML=""
}
