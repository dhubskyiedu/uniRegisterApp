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



app.use(parser.json());
app.use(parser.urlencoded({extended: false}));
app.use((err, req, res, next) => {
    if(err instanceof SyntaxError){
        res.status(400).send("Invalid input");
    }else{
        next();
    }
})

app.use(cors({
    origin: frontend,
    credentials: true
}));

app.listen(PORT, () => {
    console.log("Server is listening on port 3000");
});



// USERS
app.post("/api/user", async (req, res) => {
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
            ["Users", 
                ["username", uname, 32], 
                ["email", email, 32],
                ["fName", fname, 32],
                ["lName", lname, 32],
            ],
            ["Auth", 
                ["username", uname, 32],
                ["password", passwd, 32], 
                ["accessL", alevel, 2]
            ]
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

app.get("/api/user/validateuname/:uname", async (req, res) => {
    const origin = req.headers.origin;
    console.log("A")
    if(origin !== frontend){
        return res.status(403).json({"error": "access denied: unauthorized frontend"});
    }
    console.log("B")
    res.set("Access-Control-Allow-Origin", frontend);
    console.log("C")
    try{
        const dbUser = await dbops.getOne("Users", "username", req.params.uname);
        console.log("D")
        if(dbUser){
            console.log("E")
            res.status(409).json({"error": "user exists"});
        }else{
            console.log("F")
            res.sendStatus(200);
            console.log("X")
        }
    }catch(error){
        console.log(error)
        return res.sendStatus(500);
    }
})

app.post("/api/user/verify", async(req, res) => {
    try{
        user = await dbops.getOne("Auth", "username", req.body.uname ? req.body.uname: "");
        if(user){
            if(req.body.passwd == user.password){
                const token = jwt.sign(user.username, process.env.ACCESS_SECRET);
                console.log("MLP")
                return res.cookie('jwtToken', token, {
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

app.get("/api/user/:uname", async (req, res) => {
    const origin = req.headers.origin;
    const token = req.cookies.jwtToken;
    if(!token){
        console.log("QWERTY")
        return res.status(401).json({"error": "invalid request: no jwt cookie"});
    }
    if(origin !== frontend){
        console.log("ZAQ")
        return res.status(403).json({"error": "access denied: unauthorized frontend"});
    }
    try{
        const cookieUsername = jwt.verify(token, process.env.ACCESS_SECRET);
        const dbUser = await dbops.getOne("Users", "username", req.params.uname);
        const dbAuth = await dbops.getOne("Auth", "username", req.params.uname);
        dbUser.accessL = dbAuth.accessL;
        if(dbUser){
            if(cookieUsername === dbUser.username){
                console.log("USER IS "+JSON.stringify(user));
                res.status(200).json(dbUser);
            }else{
                res.status(403).json({"error": "access denied: unauthorized user"});
            }
        }else{
            res.status(404).json({"error": "not found"});
        }
    }catch(error){
        return res.sendStatus(500);
    }
})

app.get("/api/users", async (req, res) => {
    const origin = req.headers.origin;
    const token = req.cookies.jwtToken;
    if(!token){
        return res.status(401).json({"error": "invalid request: no jwt cookie"});
    }
    if(origin !== frontend){
        return res.status(403).json({"error": "access denied: unauthorized frontend"});
    }
    res.set("Access-Control-Allow-Origin", frontend);
    try{
        const cookieUsername = jwt.verify(token, process.env.ACCESS_SECRET);
        const dbUser = await dbops.getOne("Users", "username", cookieUsername);
        if(dbUser){
            if(dbUser.accessL == 0){
                res.status(403).json({"error": "unauthorized access"});
            }else{
                dbops.getAll("Users", req.query.info)
                    .then(async (result) => {
                        const finalResult = [];
                        for(let i = 0; i<result.length; i++){
                            const roledUser = result[i];
                            try{
                                const auth = await dbops.getOne("Auth", "username", roledUser.username);
                                roledUser.accessL = auth.accessL;
                            }catch(error){
                                continue;
                            }
                            switch(roledUser.accessL){
                                case 0:
                                    roledUser.role = "student";
                                    break;
                                case 1:
                                    roledUser.role = "teacher";
                                    break;
                                case 2:
                                    roledUser.role = "admin";
                                    break;
                                default:
                                    roledUser.role = "other";
                                    break;
                            }
                            finalResult.push(roledUser);
                        }
                        res.status(200).send(finalResult);
                    })
                    .catch((err) => {
                        res.sendStatus(500);
                    })
            }
        }else{
            res.status(403).json({"error": "unauthorized access"});
        }
    }catch(error){
        return res.sendStatus(500);
    }
})

app.delete("/api/user", async (req, res) => {
    try{
        //await dbops.deleteUser(req.body.uname)
        await dbops.deleteOne("Users", "username", req.body.username)
        await dbops.deleteOne("Auth", "username", req.body.username)
        res.sendStatus(204);
    }catch(e){
        res.sendStatus(500);
    }
})

app.put("/api/user", async (req, res) => {
    console.log("YES")
    const userChangeArr = [];
    const authChangeArr = [];
    if(!req.body.username){
        return res.status(400).json({"error": "username not included into the request"});
    }
    userChangeArr.push(["username", req.body.username]);
    authChangeArr.push(["username", req.body.username]);
    if(req.body.email){
        userChangeArr.push(["email", req.body.email]);
    }
    if(req.body.fName){
        userChangeArr.push(["fName", req.body.fName]);
    }
    if(req.body.lName){
        userChangeArr.push(["lName", req.body.lName]);
    }
    if(req.body.password){
        authChangeArr.push(["password", req.body.password]);
    }
    if(req.body.accessL){
        authChangeArr.push(["accessL", req.body.accessL]);
    }
    try{
        if(userChangeArr.length > 1){
            console.log(userChangeArr);
            await dbops.alterOne("Users", "username", userChangeArr);
        }
        if(authChangeArr.length > 1){
            await dbops.alterOne("Auth", "username", authChangeArr);
        }
        return res.sendStatus(204);
    }catch(e){
        return res.sendStatus(500);
    }
})



app.post("/api/user/validate", async(req, res) => {
    try{
        user = await dbops.getOne("Auth", "username", req.body.uname ? req.body.uname: "");
        if(user){
            if(req.body.passwd == user.password){
                const token = jwt.sign(user.username, process.env.ACCESS_SECRET);
                res.sendStatus(200);
            }else{
                res.status(403).json({error: "wrong password"});
            }
        }else{
            res.status(404).json({error: "non-existent username"});
        }
    }catch(e){
        res.sendStatus(500);
    }
})

app.post("/api/user/logout", async(req, res) => {
    res.cookie('jwtToken', "", {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
        expires: new Date(0)
    }).sendStatus(200);
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