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

// USERS
app.post("/api/user", async (req, res) => {
    uname = req.body.uname
    passwd = req.body.passwd
    email = req.body.email
    fname = req.body.fname
    lname = req.body.lname
    alevel = req.body.alevel
    if(((uname != null && passwd != null) && (email != null && alevel != null)) && (fname != null && lname != null)){
        result = await dbops.createUser(
            req.body.uname,
            req.body.passwd,
            req.body.email,
            req.body.fname,
            req.body.lname,
            req.body.alevel
        )
        if(result){
            res.sendStatus(204)
        }else{
            res.status(500).send("Server error")
        }
    }else{
        res.status(400).send("Wrong input error")
    }
})
app.get("/api/user/:uname", async (req, res) => {
    user = await dbops.getUser(req.params.uname)
    if(user){
        res.status(200).send(user)
    }else{
        res.status(404).send("Not found")
    }
})
app.delete("/api/user", async (req, res) => {
    result = await dbops.deleteUser(req.body.uname)
    if(result){
        res.sendStatus(204)
    }else{
        res.status(500).send("Server error")
    }
})
app.put("/api/user", async (req, res) => {
    try{
        result = await dbops.alterUser(req.body)
    }catch(e){
        result = false
    }
    if(result){
        res.sendStatus(204)
    }else{
        res.status(500).send("Server error")
    }
})

// COURSES
app.post("/api/course", async (req, res) => {
    courseID = req.body.courseid;
    courseName = req.body.name;
    courseDesc = req.body.description;
    if((courseID != null && courseName != null) && courseDesc != null){
        try{
            result = await dbops.createCourse(courseID, courseName, courseDesc)
        }catch(e){
            result = false
        }
        if(result){
            res.sendStatus(204)
        }else{
            res.status(500).send("Server error")
        }
    }else{
        res.status(400).send("Wrong input error")
    }
})
app.get("/api/course/:id", async (req, res) => {
    course = await dbops.getCourse(req.params.id)
    if(course){
        res.status(200).send(course)
    }else{
        res.status(404).send("Not found")
    }
})
app.delete("/api/course", async (req, res) => {
    /*try{
        result = await dbops.deleteCourse(req.body.courseid)
    }catch(e){
        result = false
    }
    if(result){
        res.sendStatus(204)
    }else{
        res.status(500).send("Server error")
    }*/
    dbops.deleteCourse(req.body.courseid)
    .then((result) => {
        res.sendStatus(204)
    })
    .catch((err) => {
        res.status(500).send("Server error")
    })
})
app.put("/api/course", async (req, res) => {
    dbops.alterCourse(req.body)
    .then((result) => {
        res.sendStatus(204)
    })
    .catch((err) => {
        res.status(500).send("Server error")
    })
})

// Groups
app.post("/api/group", async (req, res) => {
    groupID = req.body.id
    courseID = req.body.courseid
    dbops.createGroup(groupID, courseID)
    .then((result) => {
        res.sendStatus(204)
    })
    .catch((err) => {
        res.status(500).send("Server error")
    })
})
app.get("/api/group/:id", async (req, res) => {
    try{
        result = await dbops.getGroup(req.params.id)
        if(result != null){
            res.status(200).send(result)
        }else{
            res.status(404).send("Not found")
        }
    }catch(e){
        res.status(500).send("Server error")
    }
})
app.delete("/api/group", async (req, res) => {
    dbops.deleteGroup(req.body.groupid)
    .then((result) => {
        res.sendStatus(204)
    })
    .catch((err) => {
        res.status(500).send("Server error")
    })
})
app.put("/api/group", async (req, res) => {
    dbops.alterGroup(req.body)
    .then((result) => {
        res.sendStatus(204)
    })
    .catch((err) => {
        res.status(500).send("Server error")
    })
})