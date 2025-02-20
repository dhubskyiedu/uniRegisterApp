const express = require("express")
const dbops = require("./dbops")
const app = express()
const parser = require("body-parser")

app.use(parser.json())
app.use(parser.urlencoded({extended: false}))

app.listen(3000, () => {
    console.log("Server is listening on port 3000")
})

// USERS
app.post("/api/user", async (req, res) => {
    uname = req.body.uname
    passwd = req.body.passwd
    email = req.body.email
    fname = req.body.fname
    lname = req.body.lname
    alevel = req.body.alevel
    result = false
    try{
        await dbops.createUser(
            req.body.uname,
            req.body.passwd,
            req.body.email,
            req.body.fname,
            req.body.lname,
            req.body.alevel
        )
        result = true
    }catch(e){
        if(e == 1){
            res.status(400).send("User already exists")
        }else if(e == 2){
            res.status(400).send("Exceeded maximum size or incomplete input")
        }else{
            res.sendStatus(500)
        }
    }
    if(result){
        res.sendStatus(204)
    }
})
app.get("/api/user/:uname", async (req, res) => {
    try{
        user = await dbops.getUser(req.params.uname)
        if(user){
            res.status(200).send(user)
        }else{
            res.status(404).send("Not found")
        }
    }catch(e){
        res.sendStatus(500)
    }
})
app.delete("/api/user", async (req, res) => {
    try{
        await dbops.deleteUser(req.body.uname)
        res.sendStatus(204)
    }catch(e){
        res.sendStatus(500)
    }
})
app.put("/api/user", async (req, res) => {
    try{
        await dbops.alterUser(req.body)
        res.sendStatus(204)
    }catch(e){
        res.sendStatus(500)
    }
})

// COURSES
app.post("/api/course", async (req, res) => {
    courseID = req.body.courseid;
    courseName = req.body.name;
    courseDesc = req.body.description;
    try{
        result = await dbops.createCourse(courseID, courseName, courseDesc)
        res.sendStatus(204)
    }catch(e){
        if(e == 1){
            res.status(400).send("Course already exists")
        }else if(e == 2){
            res.status(400).send("Exceeded maximum size or incomplete input")
        }else{
            res.sendStatus(500)
        }
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
    dbops.deleteCourse(req.body.courseid)
    .then((result) => {
        res.sendStatus(204)
    })
    .catch((err) => {
        res.sendStatus(500)
    })
})
app.put("/api/course", async (req, res) => {
    dbops.alterCourse(req.body)
    .then((result) => {
        res.sendStatus(204)
    })
    .catch((err) => {
        res.sendStatus(500)
    })
})

// Groups
app.post("/api/group", async (req, res) => {
    groupID = req.body.groupid
    courseID = req.body.courseid
    dbops.createGroup(groupID, courseID)
    .then((result) => {
        res.sendStatus(204)
    })
    .catch((err) => {
        if(err == 1){
            res.status(400).send("Group already exists")
        }else if(err == 2){
            res.status(400).send("Exceeded maximum size or incomplete input")
        }else{
            res.sendStatus(500)
        }
    })
})
app.get("/api/group/:id", async (req, res) => {
    try{
        result = await dbops.getGroup(req.params.id)
        if(result){
            res.status(200).send(result)
        }else{
            res.status(404).send("Not found")
        }
    }catch(e){
        res.sendStatus(500)
    }
})
app.delete("/api/group", async (req, res) => {
    dbops.deleteGroup(req.body.groupid)
    .then((result) => {
        res.sendStatus(204)
    })
    .catch((err) => {
        res.sendStatus(500)
    })
})
app.put("/api/group", async (req, res) => {
    dbops.alterGroup(req.body)
    .then((result) => {
        res.sendStatus(204)
    })
    .catch((err) => {
        res.sendStatus(500)
    })
})

// Subjects
app.post("/api/subject", (req, res) => {
    subjectid = req.body.subjectid
    subjectdesc = req.body.description
    subjectname = req.body.name
        dbops.createSubject(subjectid, subjectname, subjectdesc)
        .then((result) => {
            res.sendStatus(204)
        })
        .catch((err) => {
            if(err == 1){
                res.status(400).send("Group already exists")
            }else if(err == 2){
                res.status(400).send("Exceeded maximum size or incomplete input")
            }else{
                res.sendStatus(500)
            }
        })
})
app.get("/api/subject/:id", (req, res) => {
    dbops.getSubject(req.params.id)
    .then((result) => {
        if(result){
            res.status(200).send(result)
        }else{
            res.status(404).send("Not found")
        }
    })
    .catch((err) => {
        res.sendStatus(500)
    })
})
app.delete("/api/subject", (req, res) => {
    dbops.deleteSubject(req.body.subjectid)
    .then((result) => {
        res.sendStatus(204)
    })
    .catch((err) => {
        res.sendStatus(500)
    })
})
app.put("/api/subject", (req, res) => {
    dbops.alterSubject(req.body)
    .then((result) => {
        res.sendStatus(204)
    })
    .catch((err) => {
        res.sendStatus(500)
    })
})

//          I NEED TO REFINE THE CODE ABOVE AND SET STANDARDS PRIOR TO COMMENCING