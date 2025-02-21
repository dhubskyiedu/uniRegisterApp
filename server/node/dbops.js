const sqlite = require("sqlite3")
const db = new sqlite.Database("./data.db", sqlite.OPEN_READWRITE, (err) => {
    if(err){
        console.log(err.message)
    }else{
        console.log("Success")
    }
})

// info is a 2d array: 
/* 
[
    [tableName1, [param1, val1, max size], [param2, val2, max size], ...],
    [tableName2, [param1, val1, max size], [param2, val2, max size], ...],
    ...
]
*/
async function createOne(info){ // params is a 2d array: [[param1, val1, max size], [param2, val2, max size], ...]
    return new Promise((resolve, reject) => {
        // data verification
        isNull = null // stores defect param
        sizeAbnormal = null // stores defect param
        normalSize = null
        for(i of info){
            for(j in i){
                if(j>=1){
                    if(!i[j][1]){
                        isNull = i[j][0]
                        break
                    }else{
                        if(i[j][1].length > i[j][2]){
                            sizeAbnormal = i[j][0]
                            normalSize = i[j][2]
                            break
                        }
                    }
                }
            }
        }

        // FIXING 1

        if(!isNull && !sizeAbnormal){

            // FIXING 2

            for(i in info){
                tableName = info[i][0]
                // params EQUALS TO info[i][1:]
                paramStr = `(`
                valueStr = `(`
                values = []
                /*for(i of params){
                    paramStr += i[0]+`, `
                    valueStr += `?, `
                    values.push(i[1])
                }*/
                for(j in info[i]){
                    if(j >= 1){
                        paramStr += info[i][j][0]+`, `
                        valueStr += `?, `
                        values.push(info[i][j][1])
                    }
                }
                paramStr = paramStr.slice(0, paramStr.length-2)
                paramStr += `)`
                valueStr = valueStr.slice(0, valueStr.length-2)
                valueStr += `)`
                sql = `INSERT INTO `+tableName+` `+paramStr+` VALUES `+valueStr+`;`
                db.run(sql,
                    values, (err) => {
                        if(err){
                            if(err.message.split(":")[0] == "SQLITE_CONSTRAINT"){
                                reject([3]) // error code 3
                            }else if(err.message.split(":")[0] == "SQLITE_BUSY"){
                                reject([4])
                            }else{
                                reject(err)
                            }
                        }else{
                            resolve()
                        }
                })
            }

            
        }else if(isNull){
            reject([1, isNull]) // error code 1: Required data is absent
        }else{
            reject([2, sizeAbnormal, normalSize]) // error code 2: Exceeding maximum size
        }
        })
}

async function getOne(tableName, idName, id){
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM `+tableName+` WHERE `+idName+` = ?;`,
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

async function getCourses(info){
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM Courses;`,
            [], (err, rows) => {
                if(err){
                    reject()
                }else{
                    if(info != null){
                        result = []
                        infoArr = info.split(",")
                        for(i of rows){
                            obj = new Object()
                            for(j of infoArr){
                                obj[j] = i[j]
                            }
                            result.push(obj)
                        }
                        resolve(result)
                    }else{
                        resolve(rows)
                    }
                    
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


async function getAll(tableName, info){
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM `+tableName+`;`,
            [], (err, rows) => {
                if(err){
                    reject()
                }else{
                    if(info){
                        result = []
                        infoArr = info.split(",")
                        for(i of rows){
                            obj = new Object()
                            for(j of infoArr){
                                obj[j] = i[j]
                            }
                            result.push(obj)
                        }
                        resolve(result)
                    }else{
                        resolve(rows)
                    }
                    
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
    deleteUser,
    alterUser,
    deleteCourse,
    alterCourse,
    deleteGroup,
    alterGroup,
    deleteSubject,
    alterSubject,
    getAll,
    getOne,
    createOne
}