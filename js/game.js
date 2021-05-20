const container = document.getElementById('game-container');
const playAgainBtn = document.getElementById('playAgainBtn');
const gameMovements = document.getElementById('game-movements');
const gameTime = document.getElementById('game-time');
const loading = document.getElementById('loading');

class Game{
    
    constructor(){
        this.API_URL = "https://ponyweb.ml/v1/";
        this.MAX_PONIES = 20;

        loading.style.display = "flex";

        this.init = this.init.bind(this);

        setTimeout(this.init, 2000);
        //this.init();

        this.playAgain();
    }

    init(){
        this.cardContainer = document.createElement('div');

        this.allPoniesInfo = []

        this.firstSelect = {node:undefined, id:0};
        this.secondSelect = {node:undefined, id:0};

        this.gameStart = false;
        this.firstMovement = false;
        this.corrects = [];
        this.movements = 0;

        this.poniesIds = this.generateRanIds(this.MAX_PONIES);

        this.suffleArray(this.poniesIds);

        this.getPonies(`${this.API_URL}character/all?limit=${this.MAX_PONIES}`);

        this.clickCard = this.clickCard.bind(this);
        this.clock = this.clock.bind(this);

        // Clock
        this.hour = 0;
        this.minutes = 0;
        this.seconds = 0;
        this.decimals = 0;
        this.time = "";
        this.stop = true;
    }

    playAgain(){
        playAgainBtn.addEventListener('click', (e) => {
            this.removeEvents();
            this.stopTime();
            this.time = '00:00';
            this.refreshMovements(0);
            this.showClock();
            document.getElementById('game-time').textContent = "Time: 00:00";
            this.deleteCards();
            loading.style.display = "flex";
            setTimeout(this.init, 2000);
        });
    }

    generateRanIds(max){
        return new Array(max).fill(0).map((n) => Math.floor(Math.random() * 20));
    }

    suffleArray(array){
        array.sort(() => Math.random() - 0.5);
    }

    deleteCards(){
        console.log(container);
        console.log(container.getElementsByClassName('cards'));
        container.removeChild(container.getElementsByClassName('cards')[0]);
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
            if(!this.gameStart){
                this.startClock();
                this.gameStart = true;
            }
            
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
                        console.log(this.corrects.length);
                        if(this.corrects.length === this.MAX_PONIES) {
                            this.win();
                        }
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
        console.log("Removing events");
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

                loading.style.display = "none";
            });
    }

    win() {
        this.stopTime();
        Swal.fire({
            title: 'Congrats!',
            text: `You have completed the memory game in ${this.time} and with ${this.movements} movements.` ,
            icon: 'success',
            confirmButtonText: 'Cool'
          })
    }

    startClock(){
        if(this.stop == true){
            this.stop = false;
            this.clock();
        }
    }

    clock(){
        if(this.stop == false) {
            this.decimals++;
            if(this.decimals > 9) {
                this.decimals = 0;
                this.seconds++;
            }
            if(this.seconds > 59) {
                this.seconds = 0;
                this.minutes++;
            }
            if(this.minutes > 59) {
                this.minutes = 0;
                this.hour++;
            }

            this.showClock();
            setTimeout(this.clock, 100);
        }
    }

    showClock(){
        if(this.hour < 10) {
            this.time = '';
        } else {
            this.time = this.hour;
        }
        if(this.minutes < 10) this.time = this.time + '0';
        this.time = this.time + this.minutes + ':';
    
        if(this.seconds < 10) this.time = this.time + '0';
        this.time = this.time + this.seconds;

        document.getElementById('game-time').textContent = "Time: "+this.time;
    }

    stopTime() {
        this.stop = true;
    }

    restartTime() {
        if(this.stop === false) {
            this.stop = true;
        }

        this.hour = this.minutes = this.seconds = this.decimals = 0;
        this.time = '';
        this.showClock();
    }

}

document.addEventListener('DOMContentLoaded', e => {
    game = new Game();
});