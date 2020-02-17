
let level = function(name){ return name; };


let cell= {
    count_around_mine: 0,
    is_open: false,
    is_mine: false,
    el: document.createElement("td")
};



class UserInterface {

    UserInterface(){
        count_open_cells = 0;
        field = [];
    }

    fillField() {
        let field = [];
        for (let i = 0; i < levelDifficulty.level.height; i++){
            alert(levelDifficulty.level.height);

            let tmp = [];
            for (j = 0; j < levelDifficulty.level.widht; j++){
                tmp.push(cell);
            }
            field.push(tmp);
        }
    };

    createField (){
        let div = document.querySelector(".field_sapper");
        let table = document.createElement("table");
        for (let i = 0; i < levelDifficulty.level.height; i++){
            let tr = document.createElement("tr");
            for (let j = 0; j < levelDifficulty.level.widht; j++){
                tr.appendChild(field[i][j].el);
            }
            table.appendChild(tr);
        }
        div.appendChild(table);
        
    };
};

const sapper = {

    game: function(){

    }
};



class LevelDifficulty{

    LevelDifficulty(){

    }
    easy () {
        widht: 10;
        height: 10;
        count_mine: 20;
    }
    midle () {
        widht: 15;
        height: 15;
        count_mine: 30;
    }
    hard () {    
        widht: 20;
        height: 20;
        count_mine: 40;
    }
};



window.onload = function(){
    



userInterface = new UserInterface();
levelDifficulty = new LevelDifficulty();
alert(levelDifficulty.easy.widht);
  
};