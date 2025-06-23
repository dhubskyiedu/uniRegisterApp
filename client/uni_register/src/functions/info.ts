import { User, UserInfo, UserCreds } from "../interfaces/businessLogic";

const SERVERPORT = 3001;

export async function getStudents(): Promise<number | UserInfo[]>{
    try{
        let url = "http://localhost:"+SERVERPORT+"/api/users";
        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });
        if(response.status == 200){
            const result = await response.json(); // success
            const refinedResult = [];
            for(let i = 0; i<result.length; i++){
                const refinedUser = result[i];
                refinedUser.firstName = refinedUser.fName;
                refinedUser.lastName = refinedUser.lName;
                refinedResult.push(refinedUser);
            }
            return refinedResult;
        }else if(response.status == 403){
            return 1; // unauthorized
        }else{
            return 2; // server error
        }
    }catch(error: any){
        return 2; // server error
    }
}