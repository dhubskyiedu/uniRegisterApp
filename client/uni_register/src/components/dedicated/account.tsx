import { UserInfo, UserInfoContext } from "../../interfaces/businessLogic";
import { getStudents } from "../../functions/info";
import { useEffect, useState, useContext } from "react";

export default function Account(){
    const [studentsLst, setStudentsLst] = useState<UserInfo[]>();
    const userInfo = useContext(UserInfoContext);
    const [username, setUsername] = useState(userInfo?.username);
    const [firstName, setFirstName] = useState(userInfo?.firstName);
    const [lastName, setLastName] = useState(userInfo?.lastName);
    return(
        <div className="flex items-center justify-center text-2xl text-black flex flex-col justify-center items-center p-10">
            <div className="space-y-4" onClick={() => alert(JSON.stringify(userInfo))}>
                <div className="flex justify-between bg-gray-100 p-4">
                    <span>Username: </span>
                    <span><input className="border-2 border-dashed" type="text" value={username} onChange={(e) => setUsername(e.target.value)}/></span>
                </div>
                <div className="flex justify-between bg-gray-100 p-4">
                    <span>First name: </span>
                    <span><input className="border-2 border-dashed" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}/></span>
                </div>
                <div className="flex justify-between bg-gray-100 p-4">
                    <span>Last name: </span>
                    <span><input className="border-2 border-dashed" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}/></span>
                </div>
            </div>
        </div>
    );
}