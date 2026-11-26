export default function displayController() {
    let refs = {
        body: document.querySelector("body"),
        dialog: document.querySelector(".change-param-dialog"),
        changeParamBtn: document.querySelector(".change-param-btn"),
    }

    const eventController = (function() {
        console.log(refs.changeParamBtn)
        refs.changeParamBtn.addEventListener("click", () => {
            refs.dialog.showModal()
            console.log(refs.changeParamBtn)
        })
    })() 
}