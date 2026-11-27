import { getWeather } from "./data.js"
// const images = import.meta.webpackContext("./images", {
//   recursive: true,
//   regExp: /^\.\/.*$/,
//   mode: "sync",
// });

// console.log(images.keys())
import menuDownSVG from "./images/menu-down.svg"
import menuUpSVG from "./images/menu-up.svg"
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
    
    // function displayWeather() {

    // }

    const eventController = (function() {
        refs.changeParamBtn.addEventListener("click", () => {
            refs.dialog.showModal()
        })

        refs.dialog.cancelBtn.addEventListener("click", () => {
            refs.dialog.close()
        })

        refs.dialog.form.addEventListener("submit", (e) => {
            e.preventDefault()
            setCachesFromChangeParamsForm()
            weather = getWeather(params)

        })

        refs.getWeatherBtn.addEventListener("click", () => {
            weather = getWeather(params)
            console.log(weather)
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
                refs.weatherCards[0].menuBtn.style.backgroundImage = `url(${menuUpSVG})`
                refs.extensionDivs[0].removeAttribute("hidden")
            } else if (menusCache.day1Menu.self === "opened"){
                menusCache.day1Menu.self = "closed"
                refs.weatherCards[0].menuBtn.style.backgroundImage = `url(${menuDownSVG})`
                refs.extensionDivs[0].setAttribute("hidden", "")
            }
        })

        refs.weatherCards[1].menuBtn.addEventListener("click", () => {
            if (menusCache.day2Menu.self === "closed"){
                menusCache.day2Menu.self = "opened"
                refs.weatherCards[1].menuBtn.style.backgroundImage = `url(${menuUpSVG})`
                refs.extensionDivs[1].removeAttribute("hidden")
            } else if (menusCache.day2Menu.self === "opened"){
                menusCache.day2Menu.self = "closed"
                refs.weatherCards[1].menuBtn.style.backgroundImage = `url(${menuDownSVG})`
                refs.extensionDivs[1].setAttribute("hidden", "")
            }
        })
    })() 
    return {params}
}