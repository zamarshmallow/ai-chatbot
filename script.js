const input = document.getElementById("messageInput")
const sendBtn = document.getElementById("sendBtn")
const messages = document.getElementById("messages")

const chatList = document.querySelector(".sidebar")

let chats = JSON.parse(localStorage.getItem("chats")) || {}
let currentChat = null


/* SAVE CHATS */

function saveChats(){
localStorage.setItem("chats", JSON.stringify(chats))
}


/* CREATE NEW CHAT */

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


/* DELETE CHAT */

function deleteChat(id){

if(!confirm("Delete this chat?")) return

delete chats[id]

if(currentChat === id){
currentChat = null
messages.innerHTML = ""
}

saveChats()
renderChats()

}


/* SEND MESSAGE */

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
body: JSON.stringify({ message: text })
})

const data = await response.json()

thinking.innerText = data.reply || "No response"

chats[currentChat].messages.push({
role: "bot",
content: data.reply
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


/* RENDER CHAT LIST */

function renderChats(){

document.querySelectorAll(".chat-item").forEach(el => el.remove())

Object.keys(chats).forEach(id => {

const item = document.createElement("div")
item.className = "chat-item"

const title = document.createElement("span")
title.innerText = chats[id].title

title.onclick = () => {
currentChat = id
renderMessages()
}

const deleteBtn = document.createElement("span")
deleteBtn.innerText = "🗑"
deleteBtn.className = "delete-chat"

deleteBtn.onclick = (e) => {
e.stopPropagation()
deleteChat(id)
}

item.appendChild(title)
item.appendChild(deleteBtn)

chatList.appendChild(item)

})

}


/* RENDER MESSAGES */

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


/* BUTTON EVENT */

sendBtn.addEventListener("click", sendMessage)


/* ENTER KEY */

input.addEventListener("keydown", function(e){

if(e.key === "Enter" && !e.shiftKey){
e.preventDefault()
sendMessage()
}

})


/* INITIAL LOAD */

renderChats()
