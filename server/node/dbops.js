const sqlite = require("sqlite3")
const db = new sqlite.Database("./data.db", sqlite.OPEN_READWRITE, (err) => {
    if(err){
        console.log(err.message)
    }else{
        console.log("Success")
    }
})

// USERS
async function createUser(uname, passwd, email, fname, lname, alevel){
    return new Promise((resolve, reject) => {
        // data verification
        valid = uname && passwd // data is not null
        valid &&= email && alevel
        valid &&= fname && lname
        valid &&= uname.length <= 255 && passwd.length <= 255
        valid &&= email.length <= 255 && alevel.length <= 255
        valid &&= fname.length <= 255 && lname.length <= 255
        if(valid){
            // db operation
            db.run(`INSERT INTO Users(username, email, fName, lName, accessL) VALUES (?, ?, ?, ?, ?);`,
            [uname, email, fname, lname, alevel], (err) => {
                if(err){
                    if(err.message.split(":")[0] == "SQLITE_CONSTRAINT"){
                        reject(1) // error code 1 - user exists
                    }else{
                        reject()
                    }
                }else{
                    db.run(`INSERT INTO Auth VALUES (?, ?);`,
                        [uname, passwd], (err) => {
                            if(err){
                                if(err.message.split(":")[0] == "SQLITE_CONSTRAINT"){
                                    reject(1) // error code 1 - user exists
                                }else{
                                    reject()
                                }
                            }else{
                                resolve()
                            }
                        }
                    )
                }
            }
            )
        }else{
            reject(2) // error code 2 - too lengthy inputs
        }
    })
}

async function getUser(uname){
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM Users WHERE username = ?;`,
            [uname], (err, rows) => {
                if(err){
                    reject()
                }else{
                    resolve(rows)
                }
            }
        )
    })
}

async function deleteUser(uname){
    return new Promise((resolve, reject) => {
        db.run(`DELETE FROM Users WHERE username = ?;`,
            [uname], (err) => {
                if(err){
                    reject()
                }
            }
        )
        db.run(`DELETE FROM Auth WHERE username = ?;`,
            [uname], (err) => {
                if(err){
                    reject()
                }
            }
        )
        resolve()
    })
}

async function alterUser(info){
    return new Promise((resolve, reject) => {
        sql = `UPDATE Users SET `
        props = []
        for(prop in info){
            //console.log("Prop: "+prop+", val: "+info[prop])
            if(prop != "username"){
                if(prop == "password"){
                    db.run(`UPDATE Auth SET password = ? WHERE username = ?;`,
                        [info.password], (err) => {
                            if(err){
                                reject()
                            }
                        }
                    )
                }else{
                    sql += prop + ` = ?, `
                    props.push(info[prop])
                }
            }
        }
        props.push(info.username)
        sql = sql.slice(0, sql.length-2)
        sql += ` WHERE username = ?;`
        db.run(sql, props, (err) => {
            if(err){
                console.log(err)
                reject()
            }else{
                resolve()
            }
        })
    })
}

// COURSES
async function createCourse(id, name, desc){
    return new Promise((resolve, reject) => {
        valid = id && name
        valid &&= desc
        valid &&= id.length <= 255 && name.length <= 255
        valid &&= desc.length <= 255
        if(valid){
            db.run(`INSERT INTO Courses VALUES (?, ?, ?);`,
            [id, name, desc], (err) => {
                if(err){
                    if(err.message.split(":")[0] == "SQLITE_CONSTRAINT"){
                        reject(1) // error code 1 - course exists
                    }else{
                        reject()
                    }
                }else{
                    resolve()
                }
            }
            )
        }else{
            reject(2) // error code 2 - invalid input
        }
    })
}

async function getCourse(id){
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM Courses WHERE courseID = ?;`,
            [id], (err, rows) => {
                if(err){
                    reject()
                }else{
                    resolve(rows)
                }
            }
        )
    })
}

async function deleteCourse(id){
    return new Promise((resolve, reject) => {
        db.run(`DELETE FROM Courses WHERE courseID = ?;`,
            [id], (err) => {
                if(err){
                    reject()
                }else{
                    resolve()
                }
            }
        )
    })
}

async function alterCourse(info){
    return new Promise((resolve, reject) => {
        sql = `UPDATE Courses SET `
        props = []
        for(prop in info){
            if(prop != "courseid"){
                sql += prop + ` = ?, `
                props.push(info[prop])
            }
        }
        props.push(info.courseid)
        sql = sql.slice(0, sql.length-2)
        sql += ` WHERE courseID = ?;`
        db.run(sql, props, (err) => {
            if(err){
                reject()
            }else{
                resolve()
            }
        })
    })
}

// GROUPS
async function createGroup(groupID, courseID){
    return new Promise((resolve, reject) => {
        valid = groupID && courseID
        valid &&= groupID.length <= 255 && courseID.length <= 255
        if(!valid){
            reject(2) // error code 2 - invalid input
        }else{
            db.run(`INSERT INTO Groups VALUES (?, ?);`,
            [groupID, courseID], (err) => {
                if(err){
                    if(err.message.split(":")[0] == "SQLITE_CONSTRAINT"){
                        reject(1) // error code 1 - group exists
                    }else{
                        reject()
                    }
                }else{
                    resolve()
                }
            }
            )
        }
    })
}
async function getGroup(id){
    return new Promise((resolve, reject) => {
        if(id == null){
            reject()
        }else{
            db.get(`SELECT * FROM Groups WHERE groupID = ?;`,
                [id], (err, rows) => {
                    if(err){
                        reject()
                    }else{
                        resolve(rows)
                    }
                }
            )
        }
    })
}
async function deleteGroup(id){
    return new Promise((resolve, reject) => {
        if(id == null){
            reject()
        }else{
            db.run(`DELETE FROM Groups WHERE groupID = ?;`,
                [id], (err) => {
                    if(err){
                        reject()
                    }else{
                        resolve()
                    }
                }
            )
        }
    })
}
async function alterGroup(info){
    return new Promise((resolve, reject) => {
        sql = `UPDATE Groups SET `
        props = []
        for(prop in info){
            if(prop != "groupid"){
                sql += prop + ` = ?, `
                props.push(info[prop])
            }
        }
        props.push(info.groupid)
        sql = sql.slice(0, sql.length-2)
        sql += ` WHERE groupID = ?;`
        db.run(sql, props, (err) => {
            if(err){
                reject()
            }else{
                resolve()
            }
        })
    })
}

// SUBJECTS
async function createSubject(id, name, desc){
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO Subjects VALUES (?, ?, ?);`,
            [id, name, desc], (err) => {
                if(err){
                    reject()
                }else{
                    resolve()
                }
            }
        )
    })
}
async function getSubject(id){
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM Subjects WHERE subjectID = ?;`,
            [id], (err, rows) => {
                if(err){
                    reject()
                }else{
                    resolve(rows)
                }
            }
        )
    })
}
async function deleteSubject(id){
    return new Promise((resolve, reject) => {
        db.run(`DELETE FROM Subjects WHERE subjectID = ?;`,
            [id], (err) => {
                if(err){
                    reject()
                }else{
                    resolve()
                }
            }
        )
    })
}
async function alterSubject(info){
    return new Promise((resolve, reject) => {
        sql = `UPDATE Subjects SET `
        props = []
        for(prop in info){
            if(prop != "subjectid"){
                sql += prop + ` = ?, `
                props.push(info[prop])
            }
        }
        props.push(info.subjectid)
        sql = sql.slice(0, sql.length-2)
        sql += ` WHERE subjectID = ?;`
        db.run(sql, props, (err) => {
            if(err){
                reject()
            }else{
                resolve()
            }
        })
    })
}

module.exports = {
    createUser,
    getUser,
    deleteUser,
    alterUser,
    createCourse,
    getCourse,
    deleteCourse,
    alterCourse,
    createGroup,
    getGroup,
    deleteGroup,
    alterGroup,
    createSubject,
    getSubject,
    deleteSubject,
    alterSubject
}