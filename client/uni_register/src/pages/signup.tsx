import Link from "next/link";
import { useState } from "react";
import { validatePassword, validateEmail, validateUsername, createUser } from "../functions/auth";
import { User } from "../interfaces/businessLogic";
export default function Home() {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");

    const [emptyFields, setEmptyFields] = useState<string[]>([]);

    const renewEmail = (event: any) => {
        setEmail(event.target.value);
    }
    const renewFirstName = (event: any) => {
        setFirstName(event.target.value);
    }
    const renewLastName = (event: any) => {
        setLastName(event.target.value);
    }
    const renewUsername = (event: any) => {
        setUsername(event.target.value);
    }
    const renewPassword = (event: any) => {
        setPassword(event.target.value);
    }
    const renewRole = (event: any) => {
        setRole(event.target.value);
    }

    const checkEmptyFields = async (): Promise<boolean> => {
        let res: string[] = [];
        if(!email){
            res.push("email");
        }
        if(!firstName){
            res.push("firstName");
        }
        if(!lastName){
            res.push("lastName");
        }
        if(!username){
            res.push("username");
        }
        if(!password){
            res.push("password");
        }
        if(!role){
            res.push("role");
        }
        let passwordOk: boolean = false;
        let emailOk: boolean = false;
        let usernameOk: number = 2;
        if(password){
            switch(validatePassword(password)){
                case 0:
                    passwordOk = true;
                break;
                case 1:
                    res.push("password");
                    res.push("passVal1");
                break;
                case 2:
                    res.push("password");
                    res.push("passVal2");
                break;
                case 3:
                    res.push("password");
                    res.push("passVal3");
                break;
            }
        }
        if(email){
            switch(validateEmail(email)){
                case 0:
                    emailOk = true;
                break;
                case 1:
                    res.push("email");
                    res.push("emVal1");
                break;
                case 2:
                    res.push("email");
                    res.push("emVal2");
                break;
            }
        }
        if(username){
            usernameOk = await validateUsername(username);
            if(usernameOk == 1){
                res.push("unameVal1");
            }
            if(usernameOk == 2){
                res.push("unameVal2");
            }
        }
        setEmptyFields(res);
        return res.length == 0 && passwordOk && emailOk && usernameOk == 0;
    }
    const signUp = async () => {
        let successEntries: boolean = await checkEmptyFields();
        if(successEntries){
            let user: User = {
                username: username,
                password: password,
                firstName: firstName,
                lastName: lastName,
                role: role,
                email: email
            }
            let successRegister = await createUser(user);
            if(successRegister == 0){
                alert("Success");
            }else{
                alert(successRegister);
            }
        }
    }
    return (
        <div className="text-2xl text-black flex flex-col justify-center items-center p-10">
            <h1 className="text-8xl text-sky-500 text-center">Sign up</h1>
            <form className="mt-10">
                <label>
                    {emptyFields.includes("email") ? <span className="text-red-500">Email</span> : <span>Email</span>}
                    {emptyFields.includes("emVal1") ? <span className="text-red-500"><br/><hr/>Type the email</span>:<></>}
                    {emptyFields.includes("emVal2") ? <span className="text-red-500"><br/><hr/>It is not an email</span>:<></>}
                    <br/>
                    <input type="text" className="border-2 border-dashed" onChange={renewEmail}/>
                </label><br/>
                <label>
                    {emptyFields.includes("firstName") ? <span className="text-red-500">First name</span> : <span>First name</span>}<br/>
                    <input type="text" className="border-2 border-dashed" onChange={renewFirstName}/>
                </label><br/>
                <label>
                    {emptyFields.includes("lastName") ? <span className="text-red-500">Last name</span> : <span>Last name</span>}<br/>
                    <input type="text" className="border-2 border-dashed" onChange={renewLastName}/>
                </label><br/>
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
                    <input type="password" className="border-2 border-dashed" onChange={renewPassword}/>
                </label><br/>
                <label>
                    {emptyFields.includes("role") ? <span className="text-red-500">Sign up as: </span> : <span>Sign up as: </span>}<br/>
                    <select id="role" name="role" onChange={renewRole}>
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                    </select>
                </label><br/>
                <br/>
            </form>
            <button onClick={() => signUp()} className="bg-sky-500 text-white p-5 m-2 w-70 rounded-xl hover:bg-pink-500">
                Sign up
            </button>
        </div>
    );
}