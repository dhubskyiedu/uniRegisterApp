const sqlite = require("sqlite3")
const db = new sqlite.Database("./data.db", sqlite.OPEN_READWRITE, (err) => {
    if(err){
        console.log(err.message)
    }else{
        console.log("Success")
    }
})

const createUser = (uname, passwd, email, fname, lname, alevel) => {
    db.run(`INSERT INTO Users(username, email, fName, lName, accessL) VALUES (?, ?, ?, ?, ?);`,
        [uname, email, fname, lname, alevel], (err) => {
            if(err){
                return false
            }
        }
    )
    db.run(`INSERT INTO Auth VALUES (?, ?);`,
        [uname, passwd], (err) => {
            if(err){
                return false
            }
        }
    )
    return true
}

async function getUser(uname){
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM Users WHERE username = ?;`,
            [uname], (err, rows) => {
                if(err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            }
        )
    })
}

module.exports = {
    createUser,
    getUser
}