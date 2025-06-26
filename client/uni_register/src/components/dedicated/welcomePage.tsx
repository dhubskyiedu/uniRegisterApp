import { UserInfoContext } from "../../interfaces/businessLogic";
import { useContext, useEffect, useState } from "react";

const axios = require('axios');
export default function WelcomePage(){
    const [temp, setTemp] = useState(undefined);
    const userInfo = useContext(UserInfoContext);
    const now = new Date();
    const time = now.toLocaleTimeString();
    useEffect(() => {
        getWeather().then(
            (result) => {
                setTemp(result);
            }
        ).catch(
            (error) => {
                setTemp(undefined);
            }
        );
    }, []);
    async function getWeather() {
        let lat, lon, weather;
        // getting rough coordinates of the user
        try {
            const response = await axios.get('https://ipwho.is/');
            const {latitude, longitude} = response.data;
            lat = latitude;
            lon = longitude;
        }catch(err){
            return undefined;
        }
        // getting the weather there
        try{
            const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
            weather = response.data.current_weather.temperature;
            return weather;
        }catch(err){
            return undefined;
        }
    }
    return(
        <div className="text-center bg-blue-200 p-10 w-70 rounded-2xl hover:bg-pink-200 transition">
            <h1>Good {time.split(" ")[1] == "AM" ? "morning" : "afternoon"}, {userInfo?.userInfo.firstName}!</h1>
            <p>The weather today is <b>{temp}</b></p>
            {(() => {
                if(temp){
                    if (temp < 0) return <p>Such a frosty morning!</p>;
                    else if (temp < 10) return <p>Do you enjoy temperate fall days?</p>;
                    else if (temp < 20) return <p>A typical Aussie day</p>;
                    else if (temp < 25) return <p>A great time to stroll in the nature!</p>;
                    else return <p>You should pick a suncream!</p>;
                }
            })()}
        </div>
    );
}