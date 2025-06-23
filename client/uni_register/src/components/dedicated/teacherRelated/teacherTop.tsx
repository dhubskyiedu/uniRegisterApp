import { useState } from 'react';
import TopNav from '../../reusable/top';
import TeacherStudents from './teacherStudents';
import Account from '../account';

type TeacherTopProps = {

}

export default function TeacherTop(props: TeacherTopProps){
    const [shownMenu, setShownMenu] = useState<string>();
    return(
        <div className="">
          <TopNav 
            header="UniRegister | Teacher" 
            sections={
              [
                {name: "Classes", func: () => alert("To be implemented")},
                {name: "Timetable", func: () => alert(shownMenu)},
                {name: "Students", func: () => setShownMenu("students")},
                {name: "Mail", func: () => alert("To be implemented")},
              ]
            }
            accountFunc={() => setShownMenu("account")}
          ></TopNav>
          {(() => {
            if (shownMenu === "students") return <TeacherStudents></TeacherStudents>;
            if (shownMenu === "account") return <Account></Account>;
            return "Unknown Role";
          })()}
        </div>
    );
}
