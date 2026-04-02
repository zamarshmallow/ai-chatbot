const supabaseClient = supabase.createClient(
"YOUR_SUPABASE_URL",
"YOUR_SUPABASE_ANON_KEY"
)

let currentChat = null

const messagesDiv = document.getElementById("messages")
const chatList = document.getElementById("chatList")

// AUTH
async function checkUser(){

const { data } = await supabaseClient.auth.getUser()

if(!data.user){

const email = prompt("Email")
const password = prompt("Password")

await supabaseClient.auth.signUp({ email, password })
await supabaseClient.auth.signInWithPassword({ email, password })

}

loadChats()

}

checkUser()

function logout(){
supabaseClient.auth.signOut()
location.reload()
}

// NEW CHAT
async function newChat(){

const user = (await supabaseClient.auth.getUser()).data.user

const { data } = await supabaseClient
.from("chats")
.insert([{ user_id: user.id, title: "New Chat" }])
.select()

currentChat = data[0].id

loadChats()
loadMessages()

}

// LOAD CHATS
async function loadChats(){

const user = (await supabaseClient.auth.getUser()).data.user

const { data } = await supabaseClient
.from("chats")
.select("*")
.eq("user_id", user.id)
.order("created_at", { ascending: false })

chatList.innerHTML = ""

data.forEach(chat => {

const item = document.createElement("div")
item.className = "chat-item"
item.innerText = chat.title

item.onclick = () => {
currentChat = chat.id
loadMessages()
}

chatList.appendChild(item)

})

}

// LOAD MESSAGES
async function loadMessages(){

if(!currentChat) return

const { data } = await supabaseClient
.from("messages")
.select("*")
.eq("chat_id", currentChat)
.order("created_at")

messagesDiv.innerHTML = ""

data.forEach(m => {

messagesDiv.innerHTML += `
<div class="message ${m.role}">
${m.content}
</div>
`

})

}

// SEND MESSAGE
async function sendMessage(){

console.log("SEND CLICKED")

const input = document.getElementById("messageInput")
const text = input.value.trim()

if(!text) return

messagesDiv.innerHTML += `<div class="message user">${text}</div>`

input.value = ""

// SAVE USER MESSAGE
await supabaseClient.from("messages").insert({
chat_id: currentChat,
role:"user",
content:text
})

// CALL API
const res = await fetch("/api/chat",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body: JSON.stringify({ message:text })
})

const data = await res.json()

messagesDiv.innerHTML += `<div class="message bot">${data.reply}</div>`

// SAVE AI MESSAGE
await supabaseClient.from("messages").insert({
chat_id: currentChat,
role:"bot",
content:data.reply
})

// AUTO TITLE
const { data: messagesCheck } = await supabaseClient
.from("messages")
.select("*")
.eq("chat_id", currentChat)

if(messagesCheck.length === 2){
await supabaseClient
.from("chats")
.update({ title: data.title })
.eq("id", currentChat)
}

loadChats()

}

// FORCE BUTTON CONNECTION (CRITICAL FIX)
window.onload = () => {

const btn = document.getElementById("sendBtn")

if(btn){
btn.addEventListener("click", sendMessage)
console.log("Button connected")
}else{
console.error("sendBtn NOT FOUND")
}

}
