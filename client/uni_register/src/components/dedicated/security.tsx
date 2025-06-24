import { UserInfo, UserInfoContext, User } from "../../interfaces/businessLogic";
import { getStudents } from "../../functions/info";
import { useEffect, useState, useContext } from "react";
import { alterUser, userValPasswd, validateEmail, validatePassword } from "../../functions/auth";

export default function Security(){
    const userInfo = useContext(UserInfoContext);
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newEmail2, setNewEmail2] = useState("");
    const alterPasswordFunc = async () => {
        const passwdOk = validatePassword(password1);
        if(!(!passwdOk && password1 === password2)){
            if(passwdOk == 2){
                alert("The password must be more than 8 symbols!");
                return;
            }else if(passwdOk == 3){ 
                alert("The password must include small, big letters, and numbers!");
                return;
            }else{
                alert("The passwords don't match!");
                return;
            }
        }
        try{
            const res = await userValPasswd({username: userInfo!.userInfo.username, password: oldPassword});
            if(res){
                alert("Wrong current password!");
                return;
            }
        }catch(error){
            alert("Server error!");
            return 5;
        }
        const newUserDetails: User = {
            password: password1,
            username: userInfo?.userInfo.username || "",
            firstName: "",
            lastName: "",
            role: "",
            email: ""
        }
        const result = await alterUser(newUserDetails);
        if(!result){
            alert("Success!");
        }else{
            alert("Error");
        }
    }
    return(
        <div className="flex items-center justify-center text-2xl text-black flex flex-col justify-center items-center p-10">
            <div className="space-y-8">
                {/*Confirm identity*/}
                <div className="space-y-4">
                    <div className="flex justify-between font-bold p-4">
                        <span>Confirm your identity&nbsp;</span>
                    </div>
                    <div className="flex justify-between bg-gray-100 p-4">
                        <span>Old password:&nbsp;</span>
                        <span><input className="w-70 border-2 border-dashed" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}/></span>
                    </div>
                </div>
                {/*Password change*/}
                <div className="space-y-4">
                    <div className="flex justify-between font-bold p-4">
                        <span>Change your password&nbsp;</span>
                    </div>
                    <div className="flex justify-between bg-gray-100 p-4">
                        <span>New password:&nbsp;</span>
                        <span><input className="w-70 border-2 border-dashed regular" type="password" value={password1} onChange={(e) => setPassword1(e.target.value)}/></span>
                    </div>
                    <div className="flex justify-between bg-gray-100 p-4">
                        <span>Re-type new password:&nbsp;</span>
                        <span><input className="w-70 border-2 border-dashed" type="password" value={password2} onChange={(e) => setPassword2(e.target.value)}/></span>
                    </div>
                    <div className="flex justify-between p-4">
                        <span>
                            <button 
                                className="bg-blue-500 text-white p-3 rounded hover:bg-blue-200 hover:text-black hover:cursor-pointer transition"
                                onClick={alterPasswordFunc}>Save details
                            </button>
                        </span>    
                    </div>
                </div>
                {/*Email change*/}
                <div className="space-y-4">
                    <div className="flex justify-between font-bold p-4">
                        <span>Change your email&nbsp;</span>
                    </div>
                    <div className="flex justify-between bg-gray-100 p-4">
                        <span>New email:&nbsp;</span>
                        <span><input className="w-70 border-2 border-dashed" type="text" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}/></span>
                    </div>
                    <div className="flex justify-between bg-gray-100 p-4">
                        <span>Re-type new email:&nbsp;</span>
                        <span><input className="w-70 border-2 border-dashed" type="text" value={newEmail2} onChange={(e) => setNewEmail2(e.target.value)}/></span>
                    </div>
                    <div className="flex justify-between p-4">
                        <span>
                            <button 
                                className="bg-blue-500 text-white p-3 rounded hover:bg-blue-200 hover:text-black hover:cursor-pointer transition"
                                onClick={() => {"alterUserFunc"}}>Save details
                            </button>
                        </span>    
                    </div>
                </div>
                {/*Delete account*/}
                <div className="space-y-4">
                    <div className="flex justify-between font-bold p-4">
                        <span>Delete your account&nbsp;</span>
                    </div>
                    <div className="flex justify-between p-4">
                        <span>
                            <button 
                                className="bg-blue-500 text-white p-3 rounded hover:bg-blue-200 hover:text-black hover:cursor-pointer transition"
                                onClick={() => {"alterUserFunc"}}>Delete account
                            </button>
                        </span>    
                    </div>
                </div>
            </div>
        </div>
    );
}