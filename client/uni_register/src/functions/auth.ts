import { User, UserInfo, UserCreds } from "../interfaces/businessLogic";

const SERVERPORT = 3001;

// Password validation
/*
    Outcome codes:
    0 - success
    2 - less than 8 symbols
    3 - low complexity (small, capital letters, numbers required)
*/
export function validatePassword(password: string): number{
    if(password.length < 8){
        return 2;
    }
    const regExSmall = /[a-z]/
    const regExCapital = /[A-Z]/
    const regExNumbers = /[0-9]/
    if(!(regExSmall.test(password) && regExCapital.test(password) && regExNumbers.test(password))){
        return 3;
    }
    return 0;
}

// email validation
/*
    Outcome codes:
    0 - success
    2 - not an email
*/
export function validateEmail(email: string): number{
    if(email.length < 3 || !email.includes("@")){
        return 2;
    }
    return 0;
}

// username validation
/*
    Outcome codes: 
    0 - username available
    1 - username unavailable
    2 - technical error
*/
export async function validateUsername(username: string): Promise<number>{
    try{
        let url = "http://localhost:"+SERVERPORT+"/api/user/"+username;
        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });
        if(response.status == 200){
            return 1;
        }else if(response.status == 404){
            return 0;
        }else{
            return 2;
        }
    }catch(error: any){
        return 2;
    }
}

// user creation
/*
    Outcome codes:
    0 - success
    1 - failure
*/
export async function createUser(user: User){
    let alevel: string = "";
    switch(user.role){
        case "student":
            alevel = "0";
        break;
        case "teacher":
            alevel = "1";
        break;
        case "admin":
            alevel = "2";
        break;
    }
    if(alevel != "0" && alevel != "1" && alevel != "2"){
        return 1;
    }
    try{
        const response = await fetch("http://localhost:"+SERVERPORT+"/api/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: user.username,
                password: user.password,
                email: user.email,
                fName: user.firstName,
                lName: user.lastName,
                alevel: alevel
            })
        })
        response.text().then((resp) => alert(resp))
        if(response.status == 204){
            return 0;
        }else{
            alert(response.status);
            return 1;
        }
    }catch(error){
        alert(error)
        return 1;
    }
}

// User authentication
export async function userAuth(user: UserCreds): Promise<number>{
    try{
        const response = await fetch("http://localhost:"+SERVERPORT+"/api/user/verify", {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                uname: user.username,
                passwd: user.password,
            })
        })
        if(response.status == 404){
            return 2; // username does not exist
        }
        if(response.status == 403){
            return 1; // wrong password
        }
        if(response.status == 500){
            return 3; // server error
        }
        if(response.status == 200){
            return 0;
        }
        return 3; // other server error
    }catch(error){
        return 3; // technical error
    }

}

export async function userValPasswd(user: UserCreds): Promise<number>{
    try{
        const response = await fetch("http://localhost:"+SERVERPORT+"/api/user/validate", {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                uname: user.username,
                passwd: user.password,
            })
        })
        if(response.status == 404){
            return 2; // username does not exist
        }
        if(response.status == 403){
            return 1; // wrong password
        }
        if(response.status == 500){
            return 3; // server error
        }
        if(response.status == 200){
            return 0;
        }
        return 3; // other server error
    }catch(error){
        return 3; // technical error
    }

}

export async function userLogOut(): Promise<boolean>{
    try{
        const result = await fetch("http://localhost:"+SERVERPORT+"/api/user/logout", {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            }
        })
        if(result){
            if(result.ok){
                return true;
            }
        }
        return false;
    }catch(error){
        return false;
    }
}

export async function getUserInfo(username: string): Promise<UserInfo | number>{
    try{
        const response = await fetch("http://localhost:"+SERVERPORT+"/api/user/"+username, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        })
        if(response.status == 404){
            return 1; // no username found
        }else if(response.status == 500){
            return 3; // server error
        }
        let rawData = await response.json();
        let role: string = "NA";
        switch(rawData.accessL){
            case 0:
                role = "student";
            break;
            case 1:
                role = "teacher";
            break;
            case 2:
                role = "admin";
            break;
        }
        let foundUser: UserInfo = {
            username: rawData.username,
            email: rawData.email,
            firstName: rawData.fName,
            lastName: rawData.lName,
            role: role,
            groupID: rawData.groupID ? rawData.groupID : undefined
        }
        return foundUser;
    }catch(error2){
        return 3; // server error
    }
}

export async function alterUser(user: User){
    try{
        let accessL: number | undefined = undefined;
        switch(user.role){
            case "student":
                accessL = 0;
                break;
            case "teacher":
                accessL = 1;
                break;
            case "admin":
                accessL = 2;
                break;
        }
        const response = await fetch("http://localhost:"+SERVERPORT+"/api/user", {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "fName": user.firstName,
                "lName": user.lastName,
                "username": user.username,
                "password": user.password,
                "accessL": accessL,
                "email": user.email
            })
        })
        if(response.ok){
            return 0; // success
        }else if(response.status == 400){
            return 1; // no username provided
        }
    }catch(error){
        return 2; // server error
    }
}