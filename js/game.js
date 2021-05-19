const container = document.getElementById('game-container');

class Game{
    
    constructor(){
        const API_URL = "https://ponyweb.ml/v1/";
        const MAX_PONIES = 10;
        this.allPoniesInfo = []

        this.firstMovement = false;
        this.corrects = [];
        this.movements = [];

        this.poniesIds = this.generateRanIds(MAX_PONIES);

        this.suffleArray(this.poniesIds);

        this.getPonies(`${API_URL}character/all?limit=10`);

        this.clickCard = this.clickCard.bind(this);
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
            card.id = pony.id;

            const front = document.createElement('div');
            front.classList.add('card-front');
            front.textContent = pony.id;
            
            const back = document.createElement('div');
            back.classList.add('card-back');
            back.style.backgroundImage = `url('${pony.image[0]}')`
            //back.innerHTML = `<img class="card-back-img" src="${pony.image[0]}"> </img>`;

            card.appendChild(front);
            card.appendChild(back);

            container.appendChild(card);
        });
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
                
                this.movements.push(e.target.parentNode);

                this.firstMovement = true;
                
                //e.target.parentNode.classList.toggle("rotate");
                
                this.toggleCard(this.movements[this.movements.length-1]);

            }else if(this.firstMovement) {
                
                this.movements.push(e.target.parentNode);

                this.toggleCard(this.movements[this.movements.length-1]);


                if(this.movements[this.movements.length-1] === this.movements[this.movements.length-2]) {
                    console.log("same");
                    //this.firstMovement = false;
                }

                if(this.movements[this.movements.length-1] !== this.movements[this.movements.length-2]) {

                    if(this.movements[this.movements.length-1].id === this.movements[this.movements.length-2].id) {
                        console.log("Right")
                        this.firstMovement = false;

                        //e.target.parentNode.classList.toggle("rotate");

                        this.corrects.push(e.target.parentNode.id);

                    }

                    else if (this.movements[this.movements.length-1].id !== this.movements[this.movements.length-2].id){
                        console.log("Wrong");
                        this.firstMovement = false;

                        //e.target.parentNode.classList.toggle("rotate");
                        
                        // this.firstSelect.node.classList.toggle('rotate');
                        // this.secondSelect.node.classList.toggle('rotate');

                        this.removeEvents();

                        setTimeout(()=>{
                            this.toggleCard(this.movements[this.movements.length-1]);
                            this.toggleCard(this.movements[this.movements.length-2]);

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