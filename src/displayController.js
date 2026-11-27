import { getWeather } from "./data.js"
// const images = import.meta.webpackContext("./images", {
//   recursive: true,
//   regExp: /^\.\/.*$/,
//   mode: "sync",
// });

// console.log(images.keys())
import menuDownImg from "./images/menu-down.svg"
import menuUpImg from "./images/menu-up.svg"
import rainImg from "./images/rain.png"
import cloudySunnyImg from "./images/cloudy-sunny.png"

export default function displayController() {
    const params = (() => {
        let location = "New York"
        let IncludeDate = false
        let date1 = null
        let unitSystem = "metric"
        let additionalConditions = ["precipprob"]
        return {location, IncludeDate, date1, unitSystem, additionalConditions, }
    })()
    let weather = null
    let menusCache = {
        day1Menu: {
            self: "closed",
            hoursMenus: []
        },
        day2Menu: {
            self: "closed",
            hoursMenus: []
        }
    }
    for (let i=0; i<24; i++){
        menusCache.day1Menu.hoursMenus.push("closed")
        menusCache.day2Menu.hoursMenus.push("closed")
    }

    let refs = {
        body: document.querySelector("body"),
        dialog: document.querySelector(".change-param-dialog"),
        changeParamBtn: document.querySelector(".change-param-btn"),
        getWeatherBtn: document.querySelector(".get-weather-btn"),
        weatherCards: [...document.querySelectorAll(".weather-card")],
        extensionDivs: [...document.querySelectorAll(".extension-div")]
    }

    refs.dialog.form = refs.dialog.querySelector(".change-param-form")
    refs.dialog.locationInput = document.getElementById("location")
    refs.dialog.includeDatesInput = document.getElementById("include-dates")
    refs.dialog.date1Input = document.getElementById("date1")
    refs.dialog.unitsInputs = [...document.querySelectorAll("#unit-system-fieldset input")]
    refs.dialog.additionalConditionsInputs = [...document.querySelectorAll("#additional-conditions-fieldset input")]
    refs.dialog.cancelBtn = refs.dialog.querySelector("button[type=button]")
    refs.dialog.SubmitBtn = refs.dialog.querySelector("button[type=cancel]")
    
    refs.weatherCards[0].menuBtn = refs.weatherCards[0].querySelector(".menu-icon")
    refs.weatherCards[1].menuBtn = refs.weatherCards[1].querySelector(".menu-icon")
    for (let card of refs.weatherCards){
        card["date"] = card.querySelector(".date");
        card["temp"] = card.querySelector(".temp");
        card["weatherIcon"] = card.querySelector(".weather-icon");
        card["additionalConditionsUl"] = card.querySelector(".additional-conditions-ul")
        card["additionalConditionsLis"] = [];
    }






    function setCachesFromChangeParamsForm () {
        params.location = refs.dialog.locationInput.value
        params.IncludeDate = refs.dialog.includeDatesInput.checked
        params.date1 = refs.dialog.date1Input.value
        params.unitSystem = refs.dialog.unitsInputs.find(radioBtn => radioBtn.checked).value
        params.additionalConditions = refs.dialog.additionalConditionsInputs.reduce((valuesArr, checkBox) => {
            if (checkBox.checked){
                valuesArr.push(checkBox.value)
            }
            return valuesArr
        }, [])
    }
    
    function displayWeather() {
        refs.weatherCards.forEach((card, index) => {
            console.log(card.date)
            card.date.textContent = weather.days[index].datetime
            card.temp.textContent = weather.days[index].temp
            const icon = weather.days[index].icon
            if (icon === "rain"){
                card.weatherIcon.style.backgroundImage = `url(${rainImg})`
            } else if (icon === "partly-cloudy-day") {
                card.weatherIcon.style.backgroundImage = `url(${cloudySunnyImg})`
            }
            const lis = [...card.additionalConditionsUl.children]
            console.log(lis)
            if (lis) {
                lis.forEach(li => li.remove())
            }
            const allConditionsKeys = Object.keys(weather.days[index])
            const additionalConditionsKeys = allConditionsKeys.filter(key => {
                if (!(key === "datetime" || key === "temp" || key === "icon" || key === "hours")){
                    return true
                }
            })
            additionalConditionsKeys.forEach(key => {
                const li = document.createElement("li")
                li.classList.add("additional-condition")
                li.textContent = weather.days[index][key]
                card.additionalConditionsUl.appendChild(li)
            })
        })
    }







    const eventController = (function() {
        refs.changeParamBtn.addEventListener("click", () => {
            refs.dialog.showModal()
        })

        refs.dialog.cancelBtn.addEventListener("click", () => {
            refs.dialog.close()
        })

        refs.dialog.form.addEventListener("submit", async (e) => {
            e.preventDefault()
            setCachesFromChangeParamsForm()
            weather = await getWeather(params)
            displayWeather()

        })

        refs.getWeatherBtn.addEventListener("click", async () => {
            weather = await getWeather(params)
            displayWeather()
        })

        refs.dialog.includeDatesInput.addEventListener("change", () => {
            if (refs.dialog.includeDatesInput.checked) {                
                refs.dialog.date1Input.removeAttribute("disabled")
                refs.dialog.date2Input.removeAttribute("disabled")

            } else {
                refs.dialog.date1Input.setAttribute("disabled", "")
                refs.dialog.date1Input.value = ""
                refs.dialog.date2Input.setAttribute("disabled", "")
                refs.dialog.date2Input.value = ""
            }
        })

        refs.weatherCards[0].menuBtn.addEventListener("click", () => {
            if (menusCache.day1Menu.self === "closed"){
                menusCache.day1Menu.self = "opened"
                refs.weatherCards[0].menuBtn.style.backgroundImage = `url(${menuUpImg})`
                refs.extensionDivs[0].removeAttribute("hidden")
            } else if (menusCache.day1Menu.self === "opened"){
                menusCache.day1Menu.self = "closed"
                refs.weatherCards[0].menuBtn.style.backgroundImage = `url(${menuDownImg})`
                refs.extensionDivs[0].setAttribute("hidden", "")
            }
        })

        refs.weatherCards[1].menuBtn.addEventListener("click", () => {
            if (menusCache.day2Menu.self === "closed"){
                menusCache.day2Menu.self = "opened"
                refs.weatherCards[1].menuBtn.style.backgroundImage = `url(${menuUpImg})`
                refs.extensionDivs[1].removeAttribute("hidden")
            } else if (menusCache.day2Menu.self === "opened"){
                menusCache.day2Menu.self = "closed"
                refs.weatherCards[1].menuBtn.style.backgroundImage = `url(${menuDownImg})`
                refs.extensionDivs[1].setAttribute("hidden", "")
            }
        })
    })() 
    return {params}
}