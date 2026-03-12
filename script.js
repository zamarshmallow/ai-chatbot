const input = document.getElementById("messageInput")
const sendBtn = document.getElementById("sendBtn")
const messages = document.getElementById("messages")
const chatList = document.getElementById("chatList")

let chats = JSON.parse(localStorage.getItem("chats")) || {}
let currentChat = null

function saveChats(){
localStorage.setItem("chats", JSON.stringify(chats))
}

function newChat(){

const id = Date.now().toString()

chats[id] = {
title: "New Chat",
messages: []
}

currentChat = id

saveChats()
renderChats()
renderMessages()

}

async function sendMessage(){

const text = input.value.trim()

if(!text) return

if(!currentChat) newChat()

messages.innerHTML += `<div class="message user">${text}</div>`

input.value = ""

const thinking = document.createElement("div")
thinking.className = "message bot"
thinking.innerText = "Thinking..."
messages.appendChild(thinking)

messages.scrollTop = messages.scrollHeight

chats[currentChat].messages.push({
role: "user",
content: text
})

try{

const response = await fetch("/api/chat",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({message:text})
})

const data = await response.json()

thinking.innerText = data.reply

chats[currentChat].messages.push({
role:"bot",
content:data.reply
})

if(chats[currentChat].messages.length === 1){
chats[currentChat].title = text.slice(0,30)
}

saveChats()
renderChats()

}catch(err){

thinking.innerText = "Server error"

}

}

function renderChats(){

chatList.innerHTML = ""

Object.keys(chats).forEach(id => {

const item = document.createElement("div")
item.className = "chat-item"

if(id === currentChat){
item.classList.add("active")
}

const title = document.createElement("span")
title.innerText = chats[id].title

title.onclick = () => {
currentChat = id
renderChats()
renderMessages()
}

const deleteBtn = document.createElement("span")
deleteBtn.innerText = "✕"
deleteBtn.className = "delete-chat"

deleteBtn.onclick = (e)=>{
e.stopPropagation()
delete chats[id]
saveChats()
renderChats()
messages.innerHTML = ""
}

item.appendChild(title)
item.appendChild(deleteBtn)

chatList.appendChild(item)

})

}

function renderMessages(){

messages.innerHTML = ""

if(!currentChat) return

chats[currentChat].messages.forEach(m => {

messages.innerHTML += `
<div class="message ${m.role}">
${m.content}
</div>
`

})

messages.scrollTop = messages.scrollHeight

}

input.addEventListener("input", ()=>{
input.style.height="auto"
input.style.height=input.scrollHeight+"px"
})

sendBtn.addEventListener("click", sendMessage)

input.addEventListener("keydown", function(e){

if(e.key==="Enter" && !e.shiftKey){
e.preventDefault()
sendMessage()
}

})

renderChats()
