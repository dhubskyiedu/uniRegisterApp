const sqlite = require("sqlite3")
const db = new sqlite.Database("../../database/data.db", sqlite.OPEN_READWRITE, (err) => {
    if(err){
        console.log(err.message)
    }else{
        console.log("Success")
    }
})

/* 
info is a 2d array: 
[
    [tableName1, [param1, val1, max size], [param2, val2, max size], ...],
    [tableName2, [param1, val1, max size], [param2, val2, max size], ...],
    ...
]
*/
async function createOne(info){
    return new Promise((resolve, reject) => {
        // data verification
        isNull = null // stores defect param
        sizeAbnormal = null // stores defect param
        normalSize = null // stores max size
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
        if(!isNull && !sizeAbnormal){
            for(i in info){
                tableName = info[i][0]
                paramStr = `(`
                valueStr = `(`
                values = []
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
                                reject([3]) // error code 3: Record already exists
                            }else if(err.message.split(":")[0] == "SQLITE_BUSY"){
                                reject([4]) // error code 4: Database unavailable
                            }else{
                                reject(err) // other errors
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

async function deleteOne(tableName, idName, id){
    return new Promise((resolve, reject) => {
        db.run(`DELETE FROM `+tableName+` WHERE `+idName+` = ?;`,
            [id], (err, rows) => {
                if(err){
                    reject()
                }else{
                    resolve()
                }
            }
        )
    })
}

/*
info is a 2d array:
[
    [prop1, val1], [prop2, val2], ...
]
*/
async function alterOne(tableName, idName, info){
    return new Promise((resolve, reject) => {
        sql = `UPDATE `+tableName+` SET `
        vals = []
        changed = false
        id = null
        for(i in info){
            if(info[i][0] != idName && info[i][1]){
                sql += info[i][0] + ` = ?, `
                vals.push(info[i][1])
                changed = true
            }else if(info[i][0] == idName){
                id = info[i][1]
            }
        }
        vals.push(id)
        if(changed){
            sql = sql.slice(0, sql.length-2)
            sql += ` WHERE `+idName+` = ?;`
            db.run(sql, vals, (err) => {
                if(err){
                    reject(err)
                }else{
                    resolve()
                }
            })
        }else{
            resolve()
        }
    })
}

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

module.exports = {
    getOne,
    getAll,
    createOne,
    deleteOne,
    alterOne
}