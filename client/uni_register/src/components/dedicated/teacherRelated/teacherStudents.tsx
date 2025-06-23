import { UserInfo } from "../../../interfaces/businessLogic";
import { getStudents } from "../../../functions/info";
import { useEffect, useState } from "react";

export default function TeacherStudents(){
    const [studentsLst, setStudentsLst] = useState<UserInfo[]>();
    useEffect(() => {
        getStudents().then(
            (result) => {
                if(typeof(result) !== "number"){
                    setStudentsLst(result);
                }
            }
        ).catch();
    }, []);
    return(
        <div>
            <table className="table-fixed w-full border border-collapse border-gray-400">
                <thead>
                    <tr>
                        <th className="border border-black py-2">Username</th>
                        <th className="border border-black py-2">Full name</th>
                        <th className="border border-black py-2">Email</th>
                        <th className="border border-black py-2">Group ID</th>
                    </tr>
                </thead>
                <tbody>
                {
                studentsLst?.filter(user => user.role === "student")
                    .map(student => 
                        <tr>
                            <th className="border border-black py-2">{student.username}</th>
                            <th className="border border-black py-2">{student.firstName+" "+student.lastName}</th>
                            <th className="border border-black py-2">{student.email}</th>
                            <th className="border border-black py-2">{student.groupID ? student.groupID : "NA"}</th>
                            <th className="border border-black py-2"><button className="bg-blue-500 text-white p-3 rounded hover:bg-blue-200 hover:text-black hover:cursor-pointer transition">Edit</button></th>
                        </tr>
                    )
                }
                </tbody> 
            </table>
        </div>
    );
}