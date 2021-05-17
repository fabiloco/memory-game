const API_URL = "http://ponyweb.ml/v1/";
const container = document.getElementById('container');

class Game{
    
    constructor(){
        

        //getPonies(`${API_URL}characters/all/`);
    }

    getPonies(url){
        fetch(url)
            .then(res => res.json())
            .then(allPonies => {
                console.table(allPonies.data[0]);
                const cardContainer = document.createElement('div');
                cardContainer.innerHTML = `<img src="${allPonies.data[4].image[0]}"></img>`;
                container.appendChild(cardContainer);
                
            });
    }
}

document.addEventListener('DOMContentLoaded', e => {
    game = new Game();
    console.log(`${API_URL}character/all`);
    game.getPonies(`${API_URL}character/all`);
});