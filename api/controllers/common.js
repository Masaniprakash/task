const { to } = require("../service/util.service")
const { schedule } = require('../models');

module.exports.scheduleData = async ()=>{

    // let getAllScheduleData = await to(schedule.findAll());

    // for (let index = 0; index < getAllScheduleData.length; index++) {
    //     const element = getAllScheduleData[index];

    //     if(!element.completed){
    let element = {
        scheduleTime: "2024-08-16T11:49:04.553Z"
    }

            
            let currentTime = new Date().getTime();
            let scheduleTime = new Date(element.scheduleTime).getTime();

            console.log("currentTime", currentTime);
            console.log("scheduleTime", scheduleTime);

            if(currentTime < scheduleTime){
                console.log("currentTime is greater than scheduleTime");
            }else{
                console.log("currentTime is less than scheduleTime");
            }
            
            //add 30 seconds to schedule time and subtract 30 seconds from schedule time
            // scheduleTime.setSeconds(scheduleTime.getSeconds() + 45);
            if(currentTime > scheduleTime){

            }else{
                scheduleTime.setSeconds(scheduleTime.getSeconds() - 90);
            }

    //     }
        
    // }

}