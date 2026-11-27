async function getWeatherDataFromAPI(url){
    const response = await fetch(url)
    const weatherData = response.json()
    return weatherData
}


function createQueryUrl(location, date1, ...rest){
    const basicUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"
    let returnedUrl = `${basicUrl}${location}`
    if (date1) {
        returnedUrl = returnedUrl + "/" + date1
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
        icon: target.icon,
    }
}
function filterDesirableWeatherData(weatherData, additionalConditions = []){
    const location = weatherData.address
    let currentConditions = getDefaultConditionsObj(weatherData.currentConditions)
    for (let condition of additionalConditions){
        if (Object.hasOwn(weatherData.currentConditions, condition)){
            currentConditions[condition] = weatherData.currentConditions[condition]
        }
    }
    let days = []
    for (let day of weatherData.days) {
        let dayData = getDefaultConditionsObj(day)
        for (let condition of additionalConditions){
            if (Object.hasOwn(day, condition)){
                dayData[condition] = day[condition]
            }
        }        
        if (day.hours) {
            dayData.hours = []
            for (let hour of day.hours) {
                const hourData = getDefaultConditionsObj(hour)
                for (let condition of additionalConditions){
                    if (Object.hasOwn(hour, condition)){
                        hourData[condition] = hour[condition]
                    }
                }                 
                dayData.hours.push(hourData)
            }
        }
        days.push(dayData)
    }

    return {location, currentConditions, days}
}

async function getWeather(obj){
    const queryUrl = createQueryUrl(obj.location, obj.date1, `unitGroup=${obj.unitSystem}`, "includes=hours,days")
    const weatherData = await getWeatherDataFromAPI(queryUrl)
    console.log(weatherData)
    const desirableData = filterDesirableWeatherData(weatherData, obj.additionalConditions)
    console.log(desirableData)
}

export {getWeather}