
/////////////////////////////////////////////////////////////////////////////////////////  реализация запросов и отрисовка результатов
if(!localStorage.getItem("lastCity")){
    getQuery("Минск") 
}
else{
    getQuery(localStorage.getItem("lastCity"))        ////загрузка последнего выбранного города
}


let headerSearch = document.querySelector(".header__search")
let headerInput = document.querySelector(".header__input")


headerSearch.addEventListener("click", function (){
    checkQueryFromInput ()
})

document.querySelector(".header__input").addEventListener("keydown", function (element){  ///ввод через enter
    if (element.keyCode === 13) {
        checkQueryFromInput ()
    }
})


function checkQueryFromInput (){

    if(headerInput.value.trim()===''){    /////// проверка на валидность строки
        alert("Строка пуста")
        headerInput.value=''
        return 0
    }

    let cityName = headerInput.value
    headerInput.value=''

    getQuery(cityName.trim())  // вызов функции которая делает запрос  введенного города
}



async function getQuery(cityName){     //запрос на информацию о введенном городе

    const serverUrl = 'http://api.openweathermap.org/data/2.5';
    const apiKey = 'f660a2fb1e4bad108d6160b7f58c555f';

    const urlNow = `${serverUrl}/weather?q=${cityName}&units=metric&appid=${apiKey}`;
    const urlForecast = `${serverUrl}/forecast?q=${cityName}&units=metric&appid=${apiKey}`;

    try{
     
        let responseNow = await fetch(urlNow)
        let responseForecast = await fetch(urlForecast)

        let jsonNow
        let jsonForecast

        if (responseNow.ok) {                                     /////проверка есть ли ошибка при запросе нынешней погоды

            jsonNow = await responseNow.json()

        } else{
            throw new Error((await responseNow.json()).message);            
        }

        if (responseForecast.ok) {                                     /////проверка есть ли ошибка при запросе детализированной погоды

            jsonForecast = await responseForecast.json()
            
        } else{
            throw new Error((await responseForecast.json()).message);      
        }

        if(responseNow.ok && responseForecast.ok){
            necessaryInformationFromJson(jsonNow, jsonForecast)  

            checkForFavotite(jsonNow.name)

            localStorage.setItem("lastCity", cityName)     ///запись последнего выбранного города
        }  

    } catch (error) {
        alert(error);
     }

   
}   




function necessaryInformationFromJson(jsonNow, jsonForecast){        ////////функция которая извлекает из json нужную инфу

    let cityName = jsonNow.name
    let day = new Date ().toLocaleString (('default','en-US'), { day:'numeric', month: 'long' })
    let temperatureNow =  Math.round (jsonNow.main.temp)
    let feelsLikeNow =  Math.round (jsonNow.main.feels_like)
    let sunrise = new Date (jsonNow.sys.sunrise * 1000).toLocaleString ('default', {hour:'numeric', minute:'numeric'})    ///перевод из секунд в миллисекунды 
    let sunset = new Date (jsonNow.sys.sunset * 1000).toLocaleString ('default', {hour:'numeric', minute:'numeric'})
    let weatherDescriptionNow = jsonNow.weather[0].main
    let weatherIconNow = jsonNow.weather[0].icon

    let objInfoNow = {
        cityName: cityName,
        day: day,
        temperatureNow: temperatureNow,
        feelsLikeNow: feelsLikeNow,
        sunrise: sunrise,
        sunset: sunset,
        weatherDescriptionNow: weatherDescriptionNow,
        weatherIconNow: weatherIconNow
    }

    let arrInfoForecasts = new Array()

    for(let i=0;i<5;i++){

        let dateForecast = new Date (jsonForecast.list[i].dt * 1000)  
        let dayForecast = dateForecast.toLocaleString (('default','en-US'), {day:'numeric', month: 'long'})
        let timeForecast = dateForecast.toLocaleString ('default', {hour:'numeric', minute:'numeric'})
        let temperatureForecast = Math.round (jsonForecast.list[i].main.temp)
        let feelsLikeForecast = Math.round (jsonForecast.list[i].main.feels_like)
        let weatherDescriptionForecast = jsonForecast.list[i].weather[0].main
        let weatherIconForecast = jsonForecast.list[i].weather[0].icon

        let objForecasts = {
            timeForecast: timeForecast,
            dayForecast: dayForecast,
            temperatureForecast: temperatureForecast,
            feelsLikeForecast: feelsLikeForecast,
            weatherDescriptionForecast: weatherDescriptionForecast,
            weatherIconForecast: weatherIconForecast
        }
        arrInfoForecasts.push (objForecasts)
    }


    document.querySelectorAll(".weather-icon").forEach((element) => element.remove())

    pageNowChange(objInfoNow)                    ////////////вызов функций которые отображают данные погоды в введенном городе на каждой из вкладок
    pageDetailsChange(objInfoNow)
    pageForecastChange(arrInfoForecasts)
}


function pageNowChange(objInfoNow){
    
    document.querySelector(".main-info__degree").textContent = objInfoNow.temperatureNow + "°"

    document.querySelectorAll(".main-info__town-name").forEach((elem) => { ///отрисовыывает город сразу на трех страницах
        elem.textContent = objInfoNow.cityName
    })

    let img = document.createElement("img");
        img.src = `https://openweathermap.org/img/wn/${objInfoNow.weatherIconNow}@2x.png`;
        img.className = "weather-icon-now weather-icon"
        document.querySelector(".main-info__absolute-container").append(img);
}

function pageDetailsChange(objInfoNow){

    document.querySelector(".temperature").textContent = objInfoNow.temperatureNow + "°"
    document.querySelector(".feels-like").textContent = objInfoNow.feelsLikeNow + "°"
    document.querySelector(".weather").textContent = objInfoNow.weatherDescriptionNow
    document.querySelector(".sunrise").textContent = objInfoNow.sunrise
    document.querySelector(".sunset").textContent = objInfoNow.sunset
}

function pageForecastChange(arrInfoForecasts){

    for(let i=0; i<5; i++){
        
        let currentForecast = document.getElementById(`${i}`) 

        currentForecast.querySelector(".forecast-day").textContent = arrInfoForecasts[i].dayForecast
        currentForecast.querySelector(".forecast-time").textContent = arrInfoForecasts[i].timeForecast
        currentForecast.querySelector(".forecast-temperature").textContent = arrInfoForecasts[i].temperatureForecast + "°"
        currentForecast.querySelector(".forecast-feels-like").textContent = arrInfoForecasts[i].feelsLikeForecast + "°"
        currentForecast.querySelector(".forecast-weather-description").textContent = arrInfoForecasts[i].weatherDescriptionForecast 

        let img = document.createElement("img");
        img.src = `https://openweathermap.org/img/wn/${arrInfoForecasts[i].weatherIconForecast}@2x.png`;
        img.className = "weather-icon-forecast weather-icon"
        currentForecast.querySelector(".forecast-weather-image").append(img);
    }

}


//////////////////////////////////////////// /////////////проверка на состояние кнопки избранное


const svgAddButton = document.querySelector(".svg-add-button")
const svgPathAddButton = document.querySelector(".svg-add-button__path")

document.addEventListener("click", function (element){      
      
    if(element.target.classList.contains("favorite-city")){
        getQuery(element.target.innerText) 
      
    } 
})


function checkForFavotite(currentCity){

    let allFavoriteCities = document.querySelectorAll(".favorite-city")
    
    svgAddButton.style.fill = "rgb(255, 255, 255)"
    svgAddButton.style.filter = "drop-shadow(0px 0px 3px rgb(255, 255, 255))"
    svgPathAddButton.style.stroke = "rgb(255, 255, 255)"
   
    allFavoriteCities.forEach((elem) => { 

        if (elem.id === currentCity){  
            svgAddButton.style.fill = "rgb(255, 0, 0)"
            svgAddButton.style.filter = "drop-shadow(0px 0px 3px rgb(255, 0, 0))"
            svgPathAddButton.style.stroke = "rgb(255, 0, 0)"
        }  
    })
}

