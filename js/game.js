const container = document.getElementById('game-container');

class Game{
    
    constructor(){
        const API_URL = "http://ponyweb.ml/v1/";
        const MAX_PONIES = 10;
        this.allPoniesInfo = []

        this.poniesIds = this.generateRanIds(MAX_PONIES);

        this.suffleArray(this.poniesIds);

        this.getPonies(`${API_URL}character/all?limit=10`);
    }

    generateRanIds(max){
        return new Array(max).fill(0).map((n) => Math.floor(Math.random() * 20));
    }

    suffleArray(array){
        array.sort(() => Math.random() - 0.5);
    }

    getPonies(url){
        fetch(url)
            .then(res => res.json())
            .then(allPonies => {
                this.allPoniesInfo = allPonies.data;
                this.allPoniesInfo = this.allPoniesInfo.concat(allPonies.data);

                this.suffleArray(this.allPoniesInfo);

                console.log(this.allPoniesInfo);

                const cardContainer = document.createElement('div');
                cardContainer.classList.add('cards');

                this.allPoniesInfo.forEach(pony => {
                    let card = document.createElement('div');
                    card.classList.add('card');
                    card.innerHTML = `<img class="card-img" src="${pony.image[0]}"> </img>`;
                    cardContainer.appendChild(card);
                });

                container.appendChild(cardContainer);
            });
    }
}

document.addEventListener('DOMContentLoaded', e => {
    game = new Game();
});