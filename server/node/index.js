const express = require("express")
const dbops = require("./dbops")
const app = express()
const parser = require("body-parser")

app.use(parser.json())
app.use(parser.urlencoded({extended: false}))
app.use((err, req, res, next) => {
    if(err instanceof SyntaxError){
        res.status(400).send("Invalid input")
    }else{
        next()
    }
})

app.listen(3000, () => {
    console.log("Server is listening on port 3000")
})

// USERS
app.post("/api/user", async (req, res) => {
    uname = req.body.username
    passwd = req.body.password
    email = req.body.email
    fname = req.body.fName
    lname = req.body.lName
    alevel = req.body.alevel
    result = false
    try{
        await dbops.createOne([
            ["Users", ["username", uname, 32], 
            //["password", passwd, 255],
            ["email", email, 32],
            ["fName", fname, 32],
            ["lName", lname, 32],
            ["accessL", alevel, 2]],
            ["Auth", ["username", uname, 32],
            ["password", passwd, 32]]
        ])
        result = true
    }catch(e){
        if(e[0] == 1){
            res.status(400).send("Incomplete input ("+e[1]+")")
        }else if(e[0] == 2){
            res.status(400).send("Exceeded maximum size ("+e[1]+"). Maximum size: "+e[2])
        }else if(e[0] == 3){
            res.status(400).send("User already exists")
        }else if(e[0] == 4){
            res.status(503).send("Database maintenance")
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
        user = await dbops.getOne("Users", "username", req.params.uname)
        if(user){
            res.status(200).send(user)
        }else{
            res.status(404).send("Not found")
        }
    }catch(e){
        res.sendStatus(500)
    }
})
app.get("/api/users", async (req, res) => {
    dbops.getAll("Users", req.query.info)
    .then((result) => {
        res.status(200).send(result)
    })
    .catch((err) => {
        res.sendStatus(500)
    })
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
    courseID = req.body.courseID;
    courseName = req.body.name;
    courseDesc = req.body.description;
    try{
        //result = await dbops.createCourse(courseID, courseName, courseDesc)
        result = await dbops.createOne([
            ["Courses", ["courseID", courseID, 4], ["name", courseName, 32], ["description", courseDesc, 255]]
        ])
        res.sendStatus(204)
    }catch(e){
        if(e[0] == 1){
            res.status(400).send("Incomplete input ("+e[1]+")")
        }else if(e[0] == 2){
            res.status(400).send("Exceeded maximum size ("+e[1]+"). Maximum size: "+e[2])
        }else if(e[0] == 3){
            res.status(400).send("Course already exists")
        }else if(e[0] == 4){
            res.status(503).send("Database maintenance")
        }else{
            res.sendStatus(500)
        }
    }
})
app.get("/api/course/:id", async (req, res) => {
    course = await dbops.getOne("Courses", "courseID", req.params.id)
    if(course){
        res.status(200).send(course)
    }else{
        res.status(404).send("Not found")
    }
})
app.get("/api/courses", async (req, res) => {
    dbops.getAll("Courses", req.query.info)
    .then((result) => {
        res.status(200).send(result)
    })
    .catch((err) => {
        res.sendStatus(500)
    })
})
app.delete("/api/course", async (req, res) => {
    dbops.deleteCourse(req.body.courseID)
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
    groupID = req.body.groupID
    courseID = req.body.courseID
    dbops.createOne([
        ["Groups", ["groupID", groupID, 4], ["courseID", courseID, 4]]
    ])
    .then((result) => {
        res.sendStatus(204)
    })
    .catch((e) => {
        if(e[0] == 1){
            res.status(400).send("Incomplete input ("+e[1]+")")
        }else if(e[0] == 2){
            res.status(400).send("Exceeded maximum size ("+e[1]+"). Maximum size: "+e[2])
        }else if(e[0] == 3){
            res.status(400).send("Group already exists")
        }else if(e[0] == 4){
            res.status(503).send("Database maintenance")
        }else{
            res.sendStatus(500)
        }
    })
})
app.get("/api/group/:id", async (req, res) => {
    try{
        result = await dbops.getOne("Groups", "groupID", req.params.id)
        if(result){
            res.status(200).send(result)
        }else{
            res.status(404).send("Not found")
        }
    }catch(e){
        res.sendStatus(500)
    }
})
app.get("/api/groups", async (req, res) => {
    dbops.getAll("Groups", req.query.info)
    .then((result) => {
        res.status(200).send(result)
    })
    .catch((err) => {
        res.sendStatus(500)
    })
})
app.delete("/api/group", async (req, res) => {
    dbops.deleteGroup(req.body.groupID)
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
    subjectid = req.body.subjectID
    subjectdesc = req.body.description
    subjectname = req.body.name
        dbops.createOne([
            ["Subjects", ["subjectID", subjectid, 4], ["name", subjectname, 32], ["description", subjectdesc, 255]]
        ])
        .then((result) => {
            res.sendStatus(204)
        })
        .catch((e) => {
            if(e[0] == 1){
                res.status(400).send("Incomplete input ("+e[1]+")")
            }else if(e[0] == 2){
                res.status(400).send("Exceeded maximum size ("+e[1]+"). Maximum size: "+e[2])
            }else if(e[0] == 3){
                res.status(400).send("Subject already exists")
            }else if(e[0] == 4){
                res.status(503).send("Database maintenance")
            }else{
                res.sendStatus(500)
            }
        })
})
app.get("/api/subject/:id", (req, res) => {
    dbops.getOne("Subjects", "subjectID", req.params.id)
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
app.get("/api/subjects", async (req, res) => {
    dbops.getAll("Subjects", req.query.info)
    .then((result) => {
        res.status(200).send(result)
    })
    .catch((err) => {
        res.sendStatus(500)
    })
})
app.delete("/api/subject", (req, res) => {
    dbops.deleteSubject(req.body.subjectID)
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

app.use((req, res) => {
    res.status(404).send("Not implemented")
})
//          I NEED TO REFINE THE CODE ABOVE AND SET STANDARDS PRIOR TO COMMENCING