const express = require("express");
const cors = require('cors');
const dbops = require("./dbops");
const app = express();
const parser = require("body-parser");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
require("dotenv").config();

const PORT = 3001;
const frontend = 'http://localhost:3000';
app.use(cookieParser());
app.use(cors({
    origin: frontend, // your React app's URL
    credentials: true
}))

app.use(parser.json());
app.use(parser.urlencoded({extended: false}));
app.use((err, req, res, next) => {
    if(err instanceof SyntaxError){
        res.status(400).send("Invalid input");
    }else{
        next();
    }
})

app.listen(PORT, () => {
    console.log("Server is listening on port 3000");
})



// USERS
app.post("/api/user", async (req, res) => {
    res.set("Access-Control-Allow-Origin", frontend);
    uname = req.body.username
    passwd = req.body.password
    email = req.body.email
    fname = req.body.fName
    lname = req.body.lName
    alevel = req.body.alevel
    result = false
    console.log(req.body);
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

function authToken(req, res, next){
    const origin = req.headers.origin;
    const token = req.cookies.jwtToken;
    if(!token){
        return res.sendStatus(401);
    }
    if(origin !== frontend){
        return res.sendStatus(403);
    }
    jwt.verify(token, process.env.ACCESS_SECRET, (error, user) => {
        if(error){
            return res.sendStatus(403);
        }
        next();
    });
}

app.get("/api/user/:uname", authToken, async (req, res) => {
    res.set("Access-Control-Allow-Origin", frontend);
    try{
        user = await dbops.getOne("Users", "username", req.params.uname)
        if(user){
            res.status(200).json(user);
        }else{
            res.status(404).json({"error": "not found"});
        }
    }catch(e){
        res.sendStatus(500)
    }
})
app.get("/api/users", async (req, res) => {
    res.set("Access-Control-Allow-Origin", frontend);
    dbops.getAll("Users", req.query.info)
    .then((result) => {
        res.status(200).send(result)
    })
    .catch((err) => {
        res.sendStatus(500)
    })
})
app.delete("/api/user", async (req, res) => {
    res.set("Access-Control-Allow-Origin", frontend);
    try{
        //await dbops.deleteUser(req.body.uname)
        await dbops.deleteOne("Users", "username", req.body.username)
        await dbops.deleteOne("Auth", "username", req.body.username)
        res.sendStatus(204)
    }catch(e){
        res.sendStatus(500)
    }
})
app.put("/api/user", async (req, res) => {
    res.set("Access-Control-Allow-Origin", frontend);
    try{
        await dbops.alterOne("Users", "username", [
            ["username", req.body.username],
            ["accessL", req.body.accessL],
            ["email", req.body.email],
            ["fName", req.body.fName],
            ["lName", req.body.lName]
        ])
        await dbops.alterOne("Auth", "username", [
            ["username", req.body.username],
            ["password", req.body.password]
        ])
        res.sendStatus(204)
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
})



app.post("/api/user/verify", async(req, res) => {
    res.set("Access-Control-Allow-Origin", frontend);
    try{
        user = await dbops.getOne("Auth", "username", req.body.uname ? req.body.uname: "");
        if(user){
            if(req.body.passwd == user.password){
                const token = jwt.sign(user.password, process.env.ACCESS_SECRET);
                res.cookie('jwtToken', token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'Strict',
                    maxAge: 24 * 60 * 60 * 1000
                }).sendStatus(200);
            }else{
                res.status(403).json({error: "wrong password"});
            }
        }else{
            res.status(404).json({error: "non-existent username"});
        }
    }catch(e){
        console.log(e)
        res.sendStatus(500);
    }
})

// COURSES
app.post("/api/course", async (req, res) => {
    res.set("Access-Control-Allow-Origin", frontend);
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
    res.set("Access-Control-Allow-Origin", frontend);
    course = await dbops.getOne("Courses", "courseID", req.params.id)
    if(course){
        res.status(200).send(course)
    }else{
        res.status(404).send("Not found")
    }
})
app.get("/api/courses", async (req, res) => {
    res.set("Access-Control-Allow-Origin", frontend);
    dbops.getAll("Courses", req.query.info)
    .then((result) => {
        res.status(200).send(result)
    })
    .catch((err) => {
        res.sendStatus(500)
    })
})
app.delete("/api/course", async (req, res) => {
    res.set("Access-Control-Allow-Origin", frontend);
    //dbops.deleteCourse(req.body.courseID)
    dbops.deleteOne("Courses", "courseID", req.body.courseID)
    .then((result) => {
        res.sendStatus(204)
    })
    .catch((err) => {
        res.sendStatus(500)
    })
})
app.put("/api/course", async (req, res) => {
    res.set("Access-Control-Allow-Origin", frontend);
    //dbops.alterCourse(req.body)
    dbops.alterOne("Courses", "courseID", [
        ["courseID", req.body.courseID],
        ["name", req.body.name],
        ["description", req.body.description]
    ])
    .then((result) => {
        res.sendStatus(204)
    })
    .catch((err) => {
        res.sendStatus(500)
    })
})

// Groups
app.post("/api/group", async (req, res) => {
    res.set("Access-Control-Allow-Origin", frontend);
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
    res.set("Access-Control-Allow-Origin", frontend);
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
    res.set("Access-Control-Allow-Origin", frontend);
    dbops.getAll("Groups", req.query.info)
    .then((result) => {
        res.status(200).send(result)
    })
    .catch((err) => {
        res.sendStatus(500)
    })
})
app.delete("/api/group", async (req, res) => {
    res.set("Access-Control-Allow-Origin", frontend);
    //dbops.deleteGroup(req.body.groupID)
    dbops.deleteOne("Groups", "groupID", req.body.groupID)
    .then((result) => {
        res.sendStatus(204)
    })
    .catch((err) => {
        res.sendStatus(500)
    })
})
app.put("/api/group", async (req, res) => {
    res.set("Access-Control-Allow-Origin", frontend);
    //dbops.alterGroup(req.body)
    dbops.alterOne("Groups", "groupID", [
        ["groupID", req.body.groupID],
        ["courseID", req.body.courseID]
    ])
    .then((result) => {
        res.sendStatus(204)
    })
    .catch((err) => {
        res.sendStatus(500)
    })
})

// Subjects
app.post("/api/subject", (req, res) => {
    res.set("Access-Control-Allow-Origin", frontend);
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
    res.set("Access-Control-Allow-Origin", frontend);
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
    res.set("Access-Control-Allow-Origin", frontend);
    dbops.getAll("Subjects", req.query.info)
    .then((result) => {
        res.status(200).send(result)
    })
    .catch((err) => {
        res.sendStatus(500)
    })
})
app.delete("/api/subject", (req, res) => {
    res.set("Access-Control-Allow-Origin", frontend);
    //dbops.deleteSubject(req.body.subjectID)
    dbops.deleteOne("Subjects", "subjectID", req.body.subjectID)
    .then((result) => {
        res.sendStatus(204)
    })
    .catch((err) => {
        res.sendStatus(500)
    })
})
app.put("/api/subject", (req, res) => {
    res.set("Access-Control-Allow-Origin", frontend);
    //dbops.alterSubject(req.body)
    dbops.alterOne("Subjects", "subjectID", [
        ["subjectID", req.body.subjectID],
        ["name", req.body.name],
        ["description", req.body.description]
    ])
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