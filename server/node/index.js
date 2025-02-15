const express = require("express")
const dbops = require("./dbops")
const app = express()
const parser = require("body-parser")

app.use(parser.json())
app.use(parser.urlencoded({extended: false}))

app.listen(3000, () => {
    console.log("Server is listening on port 3000")
})

app.get("/", (req, res) => {
    res.send("it works!")
    dbops.x()
})

app.post("/createUser", (req, res) => {
    //console.log("YES")
    uname = req.body.uname
    passwd = req.body.passwd
    email = req.body.email
    fname = req.body.fname
    lname = req.body.lname
    alevel = req.body.alevel
    if(uname != null && passwd != null){
        if(email != null && alevel != null){
            if(fname != null && lname != null){
                if(dbops.createUser(
                    req.body.uname,
                    req.body.passwd,
                    req.body.email,
                    req.body.fname,
                    req.body.lname,
                    req.body.alevel
                )){
                    res.status(200).send("Success")
                    return
                }
            }
        }
    }
    res.status(400).send("Error")
})

app.get("/getUser/:uname", async (req, res) => {
    user = await dbops.getUser(req.params.uname)
    if(user){
        res.status(200).send(user)
    }else{
        res.status(400).send("No found")
    }
})