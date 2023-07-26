let navButtons=document.querySelectorAll(".btn-nav")

navButtons.forEach(navButton => navButton.addEventListener("click", function(){

    document.querySelector(".btn-nav-active").classList.remove("btn-nav-active")
    this.classList.add("btn-nav-active")

    document.querySelector(".display-show").classList.remove("display-show")

    if(this.id==="one")document.querySelector("#first-container").classList.add("display-show")
    if(this.id==="two") document.querySelector("#second-container").classList.add("display-show")
    if(this.id==="three") document.querySelector("#third-container").classList.add("display-show")
}))