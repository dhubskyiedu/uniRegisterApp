import { useState } from 'react';
import TopNav from '../../reusable/top';
import TeacherStudents from './teacherStudents';

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
            accountFunc={() => alert("To be implemented")}
          ></TopNav>
          {(() => {
            if (shownMenu === "students") return <TeacherStudents></TeacherStudents>;
            return "Unknown Role";
          })()}
        </div>
    );
}
