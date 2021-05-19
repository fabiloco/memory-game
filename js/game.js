const container = document.getElementById('game-container');
const playAgainBtn = document.getElementById('playAgainBtn');
const gameMovements = document.getElementById('game-movements');

class Game{
    
    constructor(){
        this.API_URL = "https://ponyweb.ml/v1/";
        this.MAX_PONIES = 10;
        this.cardContainer = document.createElement('div');

        this.init();

        this.playAgain();
    }

    init(){
        this.allPoniesInfo = []

        this.firstSelect = {node:undefined, id:0};
        this.secondSelect = {node:undefined, id:0};

        this.firstMovement = false;
        this.corrects = [];
        this.movements = 0;

        this.poniesIds = this.generateRanIds(this.MAX_PONIES);

        this.suffleArray(this.poniesIds);

        this.getPonies(`${this.API_URL}character/all?limit=${this.MAX_PONIES}`);

        this.clickCard = this.clickCard.bind(this);
    }

    playAgain(){
        playAgainBtn.addEventListener('click', (e) => {
            this.deleteCards();
            this.init();
        });
    }

    generateRanIds(max){
        return new Array(max).fill(0).map((n) => Math.floor(Math.random() * 20));
    }

    suffleArray(array){
        array.sort(() => Math.random() - 0.5);
    }

    deleteCards(){
        this.cardContainer.parentNode.innerHTML= "";
    }

    renderCards(ponies, container){
        ponies.forEach(pony => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.id = pony.id;

            const front = document.createElement('div');
            front.classList.add('card-front');
            
            // Show id
            //front.textContent = pony.id;
            front.textContent = "?";
            
            const back = document.createElement('div');
            back.classList.add('card-back');
            back.style.backgroundImage = `url('${pony.image[0]}')`
            //back.innerHTML = `<img class="card-back-img" src="${pony.image[0]}"> </img>`;

            card.appendChild(front);
            card.appendChild(back);

            container.appendChild(card);
        });
    }

    refreshMovements(movements){
        gameMovements.textContent = `Movements: ${movements}`
    }

    toggleCard(obj){
        if(!obj.classList.contains("rotate")){
            obj.classList.add("rotate");
        }else if(obj.classList.contains("rotate")) {
            obj.classList.remove("rotate");
        }
    }

    clickCard(e){
        if(e.target.parentNode.classList.contains("card") && !this.corrects.includes(e.target.parentNode.id)){
                
            if(!this.firstMovement) {
                this.firstSelect.node = e.target.parentNode;
                this.firstSelect.id = e.target.parentNode.id;
                this.firstMovement = true;
                this.toggleCard(this.firstSelect.node);
                this.movements++;
                this.refreshMovements(this.movements);
                console.log(this.movements);

            }else if(this.firstMovement) {
                this.secondSelect.node = e.target.parentNode;
                this.secondSelect.id = e.target.parentNode.id;

                if(this.firstSelect.node === this.secondSelect.node) {
                    console.log("same");
                }

                if(this.firstSelect.node !== this.secondSelect.node) {
                    this.movements++;
                    this.refreshMovements(this.movements);
                    console.log(this.movements);

                    if(this.firstSelect.id === this.secondSelect.id) {
                        console.log("Right")
                        this.firstMovement = false;
                        this.toggleCard(this.secondSelect.node);
                        this.corrects.push(e.target.parentNode.id);
                    }

                    else if (this.firstSelect.id !== this.secondSelect.id){
                        console.log("Wrong");
                        this.firstMovement = false;
                        this.toggleCard(this.secondSelect.node);
                        this.removeEvents();

                        setTimeout(()=>{
                            this.toggleCard(this.firstSelect.node);
                            this.toggleCard(this.secondSelect.node);
                            this.addEvents();
                        }, 500);
                    }
                }
            }
        }
    }


    addEvents() {
        window.addEventListener('click', this.clickCard);
    }

    removeEvents() {
        window.removeEventListener('click', this.clickCard);
    }

    getPonies(url) {
        fetch(url)
            .then(res => res.json())
            .then(allPonies => {
                this.allPoniesInfo = allPonies.data;
                this.allPoniesInfo = this.allPoniesInfo.concat(allPonies.data);

                this.suffleArray(this.allPoniesInfo);

                console.log(this.allPoniesInfo);

                this.cardContainer.classList.add('cards');
                this.cardContainer.id = "cards";

                this.renderCards(this.allPoniesInfo, this.cardContainer);

                container.appendChild(this.cardContainer);

                this.addEvents();
            });
    }
}

document.addEventListener('DOMContentLoaded', e => {
    game = new Game();
});