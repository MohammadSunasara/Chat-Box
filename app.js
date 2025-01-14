const express=require("express")
const path=require("path")
const { Socket } = require("socket.io")
const app=express()


const server=app.listen(3000,()=>{console.log("server is running")})
const io=require('socket.io')(server)

app.use(express.static(path.join(__dirname,"public")))
let socketConnected=new Set()

io.on('connection',onConnected)

function onConnected(socket){
    console.log(socket.id)
    socketConnected.add(socket.id)
    io.emit('clients-total',socketConnected.size)

    socket.on('disconnect',()=>{
        console.log('sokect removed',socket.id)
        socketConnected.delete(socket.id)
    io.emit('clients-total',socketConnected.size)
    })

    socket.on('message',(data)=>{
        console.log(data)
        socket.broadcast.emit('chat-message',data)
    })
    socket.on('feedback',(data)=>{
        console.log(data)
        socket.broadcast.emit('feedback',data)
    })
}
