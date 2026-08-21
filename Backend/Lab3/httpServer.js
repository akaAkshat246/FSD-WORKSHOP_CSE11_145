import http from "http"
//function create server
const server = http.createServer((req,res)=>{
     //res.write("Hello World")
     //res.end()
    const url = req.url
    const method = req.method
    if(url == "/msg" && method =="GET"){
            res.write("Hello World")
            res.end()

    }
})
var port = 3000
server.listen(3000,()=>{
    console.log(`Server is running on port: ${port}`)
})
