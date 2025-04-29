import { useState } from "react";
import { validatePassword, validateEmail, validateUsername, createUser, userAuth } from "../functions/auth";
import { UserInfo, UserCreds } from "../interfaces/businessLogic";
export default function Home() {
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
            let user: UserInfo | undefined = await userAuth(creds);
            if(user){
                if(user.role == "student"){
                    location.replace("/student");
                }else if(user.role == "teacher"){
                    location.replace("/teacher");
                }else if(user.role == "admin"){
                    location.replace("/admin");
                }
            }else{
                let res: string[] = [...emptyFields];
                res.push("wrongCreds");
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
                    {emptyFields.includes("unameVal1") ? <span className="text-red-500"><br/><hr/>Username exists</span>:<></>}
                    {emptyFields.includes("unameVal2") ? <span className="text-red-500"><br/><hr/>Server error</span>:<></>}
                    <br/>
                    <input type="text" className="border-2 border-dashed" onChange={renewUsername}/>
                </label><br/>
                <label>
                    {emptyFields.includes("password") ? <span className="text-red-500">Password</span> : <span>Password </span>}
                    {emptyFields.includes("passVal1") ? <span className="text-red-500"><br/><hr/>Type the password</span>:<></>}
                    {emptyFields.includes("passVal2") ? <span className="text-red-500"><br/><hr/>Must be more than<br/>12 characters</span>:<></>}
                    {emptyFields.includes("passVal3") ? <span className="text-red-500"><br/><hr/>Must include<br/><em>small letters</em> AND<br/><em>capital letters</em> AND<br/><em>numbers</em></span>:<></>}
                    <br/>
                    <input type="password" className="border-2 border-dashed" onChange={renewPassword}/><br/>
                    {emptyFields.includes("wrongCreds") ? <span className="text-red-500">Wrong credentials</span> : <></>}
                </label><br/>
                <br/>
            </form>
            <button onClick={() => signIn()} className="bg-sky-500 text-white p-5 m-2 w-70 rounded-xl hover:bg-pink-500">
                Sign in
            </button>
        </div>
    );
}