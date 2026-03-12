const input = document.getElementById("messageInput")
const messagesDiv = document.getElementById("messages")

async function sendMessage(){

if(!input) return

const text = input.value.trim()

if(!text){
console.log("No message typed")
return
}

messagesDiv.innerHTML += `<div class="message user">${text}</div>`

input.value=""

const thinking = document.createElement("div")
thinking.className="message bot"
thinking.innerText="Thinking..."
messagesDiv.appendChild(thinking)

messagesDiv.scrollTop = messagesDiv.scrollHeight

try{

const res = await fetch("/api/chat",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
message:text
})
})

const data = await res.json()

thinking.innerText = data.reply || "No response"

}catch(err){

thinking.innerText="Server error"

}

}

input.addEventListener("keydown",function(e){

if(e.key==="Enter" && !e.shiftKey){
e.preventDefault()
sendMessage()
}

})
