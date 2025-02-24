const express = require("express")
const http = require("http")
const path = require("path")
const app = express()

const socketio = require("socket.io")

const server = http.createServer(app)

const io = socketio(server)

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))

io.on("connection", function(socket){
    console.log("User connected:", socket.id)

    socket.on("send-location", (data) => {
        // Broadcast the location to all connected clients
        io.emit("receive-location", { id: socket.id, ...data })
    })

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id)
        // Notify all clients that a user has disconnected
        io.emit("user-disconnected", socket.id)
    })
})

app.get('/', (req, res) => {
    res.render("index")
})

server.listen(3000, () => {
    console.log("Server is running on port 3000")
})
