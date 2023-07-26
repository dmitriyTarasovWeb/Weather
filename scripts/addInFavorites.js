
let addFavouriteCityButton = document.querySelector(".main-info__add-favorite-town")
addFavouriteCityButton.addEventListener("click", addFavouriteCity)

function addFavouriteCity(){

    
    let svgAddButton = document.querySelector(".svg-add-button")
    let svgPathAddButton = document.querySelector(".svg-add-button__path")

    let currentCity = document.querySelector(".main-info__town-name")
    
    if(document.getElementById(`${currentCity.innerText}`)){

        deleteFavoriteCity(document.getElementById(`${currentCity.innerText}`))
        svgAddButton.style.fill = "rgb(255, 255, 255)"
        svgAddButton.style.filter = "drop-shadow(0px 0px 3px rgb(255, 255, 255))"
        svgPathAddButton.style.stroke = "rgb(255, 255, 255)"

        return 0
    }
    
    
    let li = document.createElement('li');
    li.className = "right__item";
    let htmlCurrentCity=`<button id="${currentCity.innerText}" class="favorite-city">${currentCity.innerText}</button><button class="delete-button"></button>`;

    li.innerHTML = htmlCurrentCity
    document.querySelector(".right__bottom-town-list").append(li);

    svgAddButton.style.fill = "rgb(255, 0, 0)"
    svgAddButton.style.filter = "drop-shadow(0px 0px 3px rgb(255, 0, 0))"
    svgPathAddButton.style.stroke = "rgb(255, 0, 0)"

    localStorage.setItem([currentCity.innerText], currentCity.innerText)
}


document.addEventListener("click", function (element){

    if(element.target.className === "delete-button") {

        let currentCity = document.querySelector(".main-info__town-name").innerText
        let idDelitingCity = element.target.previousSibling.id

        if(idDelitingCity === currentCity || idDelitingCity === undefined){
            svgAddButton.style.fill = "rgb(255, 255, 255)"
            svgAddButton.style.filter = "drop-shadow(0px 0px 3px rgb(255, 255, 255))"
            svgPathAddButton.style.stroke = "rgb(255, 255, 255)"
        }

        deleteFavoriteCity(element.target.previousSibling)
    }

})


function deleteFavoriteCity(element){   

    localStorage.removeItem(element.id)
    element.parentNode.remove()
}