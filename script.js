console.log("JS STARTED")

let supabaseClient = null

try {
  if (window.supabase) {
    supabaseClient = supabase.createClient(
      "YOUR_SUPABASE_URL",
      "YOUR_SUPABASE_ANON_KEY"
    )
    console.log("Supabase loaded")
  } else {
    console.error("Supabase NOT loaded")
  }
} catch (e) {
  console.error("Supabase error:", e)
}

function sendMessage(){
  console.log("SEND FUNCTION TRIGGERED")

  const input = document.getElementById("messageInput")

  if(!input){
    alert("Input not found")
    return
  }

  const text = input.value.trim()

  if(!text){
    alert("Empty message")
    return
  }

  alert("Message: " + text)
}

// FORCE BUTTON CONNECTION
window.onload = () => {

  console.log("WINDOW LOADED")

  const btn = document.getElementById("sendBtn")

  if(btn){
    btn.addEventListener("click", sendMessage)
    console.log("Button connected successfully")
  } else {
    console.error("sendBtn NOT found")
  }

}
