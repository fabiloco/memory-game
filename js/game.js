const container = document.getElementById('game-container');

class Game{
    
    constructor(){
        const API_URL = "https://ponyweb.ml/v1/";
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

    renderCards(ponies, container){
        ponies.forEach(pony => {
            const card = document.createElement('div');
            card.classList.add('card');

            const front = document.createElement('div');
            front.classList.add('card-front');
            
            const back = document.createElement('div');
            back.classList.add('card-back');
            back.style.backgroundImage = `url('${pony.image[0]}')`
            //back.innerHTML = `<img class="card-back-img" src="${pony.image[0]}"> </img>`;

            card.appendChild(front);
            card.appendChild(back);

            container.appendChild(card);
        });
    }

    addEvents(){
        window.addEventListener('click', e => {
            console.log(e.target);
            if(e.target.parentNode.classList.contains("card")){
                e.target.parentNode.classList.toggle("rotate");
                console.log(e.target);
                console.log(e.target.parentNode);
            }
        });
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
                cardContainer.id = "cards";

                this.renderCards(this.allPoniesInfo, cardContainer);

                container.appendChild(cardContainer);

                this.addEvents();
            });
    }
}

document.addEventListener('DOMContentLoaded', e => {
    game = new Game();
});