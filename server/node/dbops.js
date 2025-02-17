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
    console.log(info)
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
                console.log("ERROR")
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
    alterUser
}