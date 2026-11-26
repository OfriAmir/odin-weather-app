import "./style.css";
import display from "./displayController.js"

const displayController = display()
console.log(displayController.params)


async function getWeather(url){
    const response = await fetch(url)
    const weatherData = response.json()
    return weatherData
}


function createQueryUrl(location, date1, date2, ...rest){
    const basicUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"
    let returnedUrl = `${basicUrl}${location}`
    if (date1) {
        returnedUrl = returnedUrl + "/" + date1
        if (date2){
            returnedUrl = returnedUrl + "/" + date2
        }
    }
    returnedUrl = returnedUrl + "?"
    rest.forEach(para => {
        returnedUrl = returnedUrl + "&" + para
    });
    return returnedUrl
}

function getDefaultConditionsObj(target) {
    return {
        datetime: target.datetime,
        temp: target.temp,
        precipprob: target.precipprob,
        icon: target.icon,
    }
}
function getDesirableWeatherData(weatherData){
    const location = weatherData.address
    const currentConditions = getDefaultConditionsObj(weatherData.currentConditions)
    let days = []
    for (let day of weatherData.days) {
        let dayData = getDefaultConditionsObj(day)
        if (day.hours) {
            dayData.hours = []
            for (let hour of day.hours) {
                const hourData = getDefaultConditionsObj(hour)
                dayData.hours.push(hourData)
            }
        }
        days.push(dayData)
    }

    return {location, currentConditions, days}
}

async function mainFlow(){
    const queryUrl = createQueryUrl("London", null, null, "unitGroup=metric", "includes=hours,days")
    const weatherData = await getWeather(queryUrl)
    const desirableData = getDesirableWeatherData(weatherData)
    console.log(desirableData)
}

// mainFlow()