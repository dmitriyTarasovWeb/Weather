
    for(let i = localStorage.length - 1; i >= 0; i--){

        if(localStorage.key(i) !== "lastCity"){
        
            let li = document.createElement('li');
            li.className = "right__item";
            let htmlCurrentCity=`<button id="${localStorage.key(i)}" class="favorite-city">${localStorage.key(i)}</button><button class="delete-button"></button>`;
            li.innerHTML = htmlCurrentCity
            document.querySelector(".right__bottom-town-list").append(li);

        }
    }