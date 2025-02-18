const sqlite = require("sqlite3")
const db = new sqlite.Database("./data.db", sqlite.OPEN_READWRITE, (err) => {
    if(err){
        console.log(err.message)
    }else{
        console.log("Success")
    }
})

async function createUser(uname, passwd, email, fname, lname, alevel){
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO Users(username, email, fName, lName, accessL) VALUES (?, ?, ?, ?, ?);`,
            [uname, email, fname, lname, alevel], (err) => {
                if(err){
                    reject(false)
                }
            }
        )
        db.run(`INSERT INTO Auth VALUES (?, ?);`,
            [uname, passwd], (err) => {
                if(err){
                    reject(false)
                }
            }
        )
        resolve(true)
    })
}

async function getUser(uname){
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM Users WHERE username = ?;`,
            [uname], (err, rows) => {
                if(err){
                    reject(false)
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
                    reject(false)
                }
            }
        )
        db.run(`DELETE FROM Auth WHERE username = ?;`,
            [uname], (err) => {
                if(err){
                    reject(false)
                }
            }
        )
        resolve(true)
    })
}

async function alterUser(info){
    return new Promise((resolve, reject) => {
        sql = `UPDATE Users SET `
        props = []
        for(prop in info){
            //console.log("Prop: "+prop+", val: "+info[prop])
            if(prop != "uname"){
                sql += prop + ` = ?, `
                props.push(info[prop])
            }
        }
        props.push(info.uname)
        sql = sql.slice(0, sql.length-2)
        sql += ` WHERE username = ?;`
        db.run(sql, props, (err) => {
            if(err != null){
                reject(false)
            }else{
                resolve(true)
            }
        })
    })
}

async function createCourse(id, name, desc){
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO Courses VALUES (?, ?, ?);`,
        [id, name, desc], (err) => {
            if(err != null){
                reject(false)
            }else{
                resolve(true)
            }
        }
        )
    })
}

async function getCourse(id){
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM Courses WHERE courseID = ?;`,
            [id], (err, rows) => {
                if(err != null){
                    reject(false)
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
                if(err != null){
                    reject(false)
                }else{
                    resolve(true)
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
            //console.log("Prop: "+prop+", val: "+info[prop])
            if(prop != "courseid"){
                sql += prop + ` = ?, `
                props.push(info[prop])
            }
        }
        props.push(info.courseid)
        sql = sql.slice(0, sql.length-2)
        sql += ` WHERE courseID = ?;`
        db.run(sql, props, (err) => {
            if(err != null){
                reject(false)
            }else{
                resolve(true)
            }
        })
    })
}

async function createGroup(groupID, courseID){
    return new Promise((resolve, reject) => {
        if(groupID == null || courseID == null){
            reject(false)
        }else{
            db.run(`INSERT INTO Groups VALUES (?, ?);`,
            [groupID, courseID], (err) => {
                if(err != null){
                    reject(false)
                }else{
                    resolve(true)
                }
            }
            )
        }
    })
}
async function getGroup(id){
    return new Promise((resolve, reject) => {
        if(id == null){
            reject(false)
        }else{
            db.get(`SELECT * FROM Groups WHERE groupID = ?;`,
                [id], (err, rows) => {
                    if(err != null){
                        reject(false)
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
            reject(false)
        }else{
            db.run(`DELETE FROM Groups WHERE groupID = ?;`,
                [id], (err) => {
                    if(err != null){
                        reject(false)
                    }else{
                        resolve(true)
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
            if(err != null){
                reject(false)
            }else{
                resolve(true)
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
    alterGroup
}