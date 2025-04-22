// Password validation
/*
    Outcome codes:
    0 - success
    2 - less than 12 symbols
    3 - low complexity (small, capital letters, numbers required)
*/
export function validatePassword(password: string): number{
    if(password.length < 12){
        return 2;
    }
    const regExSmall = /[a-z]/
    const regExCapital = /[A-Z]/
    const regExNumbers = /[0-9]/
    if(!(regExSmall.test(password) && regExCapital.test(password) && regExNumbers.test(password))){
        return 3;
    }
    return 4;
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
    Outcomes: 
    0 - username available
    1 - username unavailable
    2 - technical error
*/

export async function validateUsername(username: string): Promise<number>{
    try{
        const response = await fetch("/api/user/"+username);
        if(response.status == 200){
            return 1;
        }else if(response.status == 404){
            return 0;
        }else{
            return 2;
        }
    }catch(error){
        return 2;
    }
}