async function sendMessage(){

const input = document.getElementById("messageInput")
const text = input.value.trim()

if(!text) return

messagesDiv.innerHTML += `<div class="message user">${text}</div>`

input.value=""

// SAVE USER MESSAGE
await supabase.from("messages").insert({
  chat_id: currentChat,
  role:"user",
  content:text
})

// AI RESPONSE
const res = await fetch("/api/chat",{
  method:"POST",
  headers:{ "Content-Type":"application/json" },
  body: JSON.stringify({ message:text })
})

const data = await res.json()

messagesDiv.innerHTML += `<div class="message bot">${data.reply}</div>`

// SAVE AI MESSAGE
await supabase.from("messages").insert({
  chat_id: currentChat,
  role:"bot",
  content:data.reply
})

// AUTO NAME CHAT (ONLY FIRST MESSAGE)
const { data: messagesCheck } = await supabase
  .from("messages")
  .select("*")
  .eq("chat_id", currentChat)

if(messagesCheck.length === 2){ // user + AI
  await supabase
    .from("chats")
    .update({ title: data.title })
    .eq("id", currentChat)
}

// RELOAD SIDEBAR
loadChats()

}