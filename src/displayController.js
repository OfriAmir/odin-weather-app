import { getWeather } from "./data.js"

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

    let refs = {
        body: document.querySelector("body"),
        dialog: document.querySelector(".change-param-dialog"),
        changeParamBtn: document.querySelector(".change-param-btn"),
        getWeatherBtn: document.querySelector(".get-weather-btn")

    }

    refs.dialog.form = refs.dialog.querySelector(".change-param-form")
    refs.dialog.locationInput = document.getElementById("location")
    refs.dialog.includeDatesInput = document.getElementById("include-dates")
    refs.dialog.date1Input = document.getElementById("date1")
    refs.dialog.unitsInputs = [...document.querySelectorAll("#unit-system-fieldset input")]
    refs.dialog.additionalConditionsInputs = [...document.querySelectorAll("#additional-conditions-fieldset input")]
    refs.dialog.cancelBtn = refs.dialog.querySelector("button[type=button]")
    refs.dialog.SubmitBtn = refs.dialog.querySelector("button[type=cancel]")
    
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
    })() 
    return {params}
}