import { UserInfo, UserInfoContext, User } from "../../interfaces/businessLogic";
import { getStudents } from "../../functions/info";
import { useEffect, useState, useContext } from "react";
import { alterUser } from "../../functions/auth";

export default function Account(){
    const userInfo = useContext(UserInfoContext);
    const [username, setUsername] = useState(userInfo?.userInfo.username);
    const [firstName, setFirstName] = useState(userInfo?.userInfo.firstName);
    const [lastName, setLastName] = useState(userInfo?.userInfo.lastName);
    const alterUserFunc = async () => {
        const newUserDetails: User = {
            password: "",
            username: username || "",
            firstName: firstName || "",
            lastName: lastName || "",
            role: "",
            email: ""
        }
        const result = await alterUser(newUserDetails);
        if(!result){
            const newUserInfo = userInfo?.userInfo;
            if(newUserInfo){
                newUserInfo.username = username || newUserInfo.username;
                newUserInfo.firstName = firstName || newUserInfo.firstName;
                newUserInfo.lastName = lastName || newUserInfo.lastName;
                userInfo?.setUserInfo(newUserInfo);
            }
            alert("Success!");
        }else{
            alert("Error");
        }
    }
    return(
        <div className="flex items-center justify-center text-2xl text-black flex flex-col justify-center items-center p-10">
            <div className="space-y-4">
                <div className="flex justify-between bg-gray-100 p-4">
                    <span>Username:&nbsp;</span>
                    <span><input className="w-70 text-gray-500 italic border-2 border-dashed border-black" type="text" value={username} onChange={(e) => setUsername(e.target.value)} readOnly/></span>
                </div>
                <div className="flex justify-between bg-gray-100 p-4">
                    <span>First name:&nbsp;</span>
                    <span><input className="w-70 border-2 border-dashed regular" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}/></span>
                </div>
                <div className="flex justify-between bg-gray-100 p-4">
                    <span>Last name:&nbsp;</span>
                    <span><input className="w-70 border-2 border-dashed" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}/></span>
                </div>
                <div className="flex justify-between bg-gray-100 p-4">
                    <span>
                        <button 
                            className="bg-blue-500 text-white p-3 rounded hover:bg-blue-200 hover:text-black hover:cursor-pointer transition"
                            onClick={alterUserFunc}>Save details
                        </button>
                    </span>    
                    <span>
                        <button 
                            className="bg-blue-500 text-white p-3 rounded hover:bg-blue-200 hover:text-black hover:cursor-pointer transition"
                            onClick={() => {}}>Change password
                        </button>
                    </span>
                </div>
            </div>
        </div>
    );
}