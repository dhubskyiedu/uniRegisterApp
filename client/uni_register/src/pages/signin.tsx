import { useState } from "react";
import { validatePassword, validateEmail, validateUsername, createUser, userAuth, getUserInfo } from "../functions/auth";
import { UserInfo, UserCreds } from "../interfaces/businessLogic";
export default function SignIn() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [emptyFields, setEmptyFields] = useState<string[]>([]);
    const renewUsername = (event: any) => {
        setUsername(event.target.value);
    }
    const renewPassword = (event: any) => {
        setPassword(event.target.value);
    }

    const checkEmptyFields = () => {
        let res: string[] = [];
        if(!username){
            res.push("username");
        }
        if(!password){
            res.push("password");
        }
        emptyFields.length = 0;
        setEmptyFields(res);
        return res.length == 0;
    }
    const signIn = async () => {
        let successEntries: boolean = checkEmptyFields(); 
        if(successEntries){
            let creds: UserCreds = {
                username:username,
                password: password
            }
            let success: number = await userAuth(creds);
            if(success === 0){
                let user: UserInfo | number = await getUserInfo(creds.username);
                if(typeof(user) != "number"){
                    if(user.role == "student"){
                        location.replace("/student/"+username);
                    }else if(user.role == "teacher"){
                        location.replace("/teacher/"+username);
                    }else if(user.role == "admin"){
                        location.replace("/admin/"+username);
                    }
                }else{
                    
                    let res: string[] = [...emptyFields];
                    res.push("serverErr");
                    setEmptyFields(res);
                }
            }else{
                //alert(success)
                let res: string[] = [...emptyFields];
                if(success === 1){
                    res.push("wrongPasswd");
                }else if(success === 2){
                    res.push("wrongUname");
                }else{
                    res.push("serverErr");
                }
                setEmptyFields(res);
            }
        }
    }
    return (
        <div className="text-2xl text-black flex flex-col justify-center items-center p-10">
            <h1 className="text-8xl text-sky-500 text-center">Sign up</h1>
            <form className="mt-10">
                <label>
                    {emptyFields.includes("username") ? <span className="text-red-500">Username</span> : <span>Username</span>}
                    <br/>
                    <input type="text" className="border-2 border-dashed" onChange={renewUsername}/>
                </label><br/>
                <label>
                    {emptyFields.includes("password") ? <span className="text-red-500">Password</span> : <span>Password </span>}
                    <br/>
                    <input type="password" className="border-2 border-dashed" onChange={renewPassword}/><br/>
                    {emptyFields.includes("wrongPasswd") ? <span className="text-red-500">Wrong password</span> : <></>}
                    {emptyFields.includes("wrongUname") ? <span className="text-red-500">User does not exist</span> : <></>}
                    {emptyFields.includes("serverErr") ? <span className="text-red-500">Server error</span> : <></>}
                </label><br/>
                <br/>
            </form>
            <button onClick={() => signIn()} className="bg-sky-500 text-white p-5 m-2 w-70 rounded-xl hover:bg-pink-500">
                Sign in
            </button>
        </div>
    );
}