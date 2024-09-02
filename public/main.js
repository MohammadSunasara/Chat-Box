const socket = io();

const clientTotal = document.getElementById("clients-total");
const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input');
const messageInput = document.getElementById('message-input');
const messageForm = document.getElementById('message-form');
const play=new Audio('mixkit-long-pop-2358.wav')


messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
});

socket.on('clients-total', (data) => {
    clientTotal.innerText = `Total Clients: ${data}`;
});

socket.on('chat-message', (data) => {
    play.play()
    sendMessageToUi(false,data)
   
});

function sendMessage() {
    if(messageInput.value ==='') {return}
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        date: new Date() // Fixed capitalization to match usual conventions
    };
    socket.emit('message', data);
    sendMessageToUi(true,data)
    messageInput.value=''
}


function sendMessageToUi(isOwner, data) {
    clearfeed()
   const element = `<li class="${isOwner ? "message-right" : "message-left"}">
       <p class="message">
           ${data.message}
           <span>${data.name} .. </span>
       </p>
   </li>`;
   messageContainer.innerHTML += element;
   scroll()
}

function scroll(){
   messageContainer.scrollTo(0,messageContainer.scrollHeight)
}

messageInput.addEventListener('focus',(e)=>{
  socket.emit('feedback',{
    feedback:`${nameInput.value} is typing`
  })
})
messageInput.addEventListener('keypress',(e)=>{
    socket.emit('feedback',{
        feedback:`${nameInput.value} is typing`
      })
})
messageInput.addEventListener('blur',(e)=>{
    socket.emit('feedback',{
        feedback:''
      })
})

socket.on('feedback',(data)=>{
    clearfeed()
    const element=`<li class="message-feedback">
                <p class="feedback" id="feedback">${data.feedback} </p>
            </li>`
    messageContainer.innerHTML+=element
})

function clearfeed(){
    document.querySelectorAll('li.message-feedback').forEach((e)=>{
        e.parentNode.removeChild(e)
    })
}