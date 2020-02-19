function cell() {                                                                       //Ячейка со свойствами
    this.count_around_mine = 0;
    this.is_open =  false;
    this.is_mine = false;
    this.el = document.createElement("td");
};


class UserInterface {
    field = [];
    mine = [];
    count_open_cells = 0;
    count_flag_on_mine = 0;

    clearField(){
        document.querySelector("table").remove();
        this.field = [];
        this.mine = [];
        this.count_open_cells = 0;
        this.count_flag_on_mine = 0;
        this.fillField();
        this.createField();
    }

    fillField() {                                                                       //Наполняем массив ячейками со свойствами
        for (let i = 0; i < levelDifficulty.height; i++){
            let tmp = [];
            for (let j = 0; j < levelDifficulty.width; j++){
                tmp.push(new cell());
            }
            this.field.push(tmp);
        }
        for (let i = 0; i < levelDifficulty.count_mine;){                               //Расстановка мин
            let x = parseInt(Math.random()*levelDifficulty.width);
            let y = parseInt(Math.random()*levelDifficulty.height);
            if(!this.field[x][y].is_mine){
                this.field[x][y].is_mine = true;
                this.field[x][y].count_around_mine = 0;
                this.mine.push({x,y});
                this.count_mine_around(x,y);
                i++;
            }
        }
        console.log(this.field);
    }

    count_mine_around(x,y) {                                                             //Подсчет количества мин вокруг мины
        let x_start = x > 0 ? x - 1: x;
        let y_start = y > 0 ? y - 1: y;
        let x_end = x < levelDifficulty.width - 1 ? x + 1: x;
        let y_end = y < levelDifficulty.height - 1 ? y + 1: y;
        for ( let i = x_start; i <= x_end; i++){
            for (let j = y_start; j <= y_end; j++){
                if(!(this.field[i][j].is_mine) && !(this.field[i][j].is_open)) this.field[i][j].count_around_mine++;
            }
        } 
    }

    createField (){                                                                         //Создание игрового поля
        let div = document.querySelector(".field_sapper");
        let table = document.createElement("table");
        for (let i = 0; i < levelDifficulty.height; i++){
            let tr = document.createElement("tr");
            for (let j = 0; j < levelDifficulty.width; j++){
                tr.appendChild(this.field[j][i].el);
            }
            table.appendChild(tr);
        }
        div.appendChild(table);
    }
    
    recurse_open(e){                                                                      //Рекурсивное открытие безопасных ячеек
        let x = e.target.cellIndex;
        let y = e.target.parentNode.rowIndex;
        let stack = [{x, y}];
        if(!this.field[x][y].is_mine){
            while(stack.length > 0) {
                const {x , y} = stack.pop();
                let x_left = x > 0 ? x - 1: x;
                let x_right = x >= 0 && x < levelDifficulty.width - 1 ? x + 1: x;
                let y_up = y > 0 ? y - 1: y;
                let y_down = y >= 0 && y < levelDifficulty.height - 1 ? y + 1: y;
                if((!this.field[x][y].is_mine) && (this.field[x][y].count_around_mine >= 0) && !(this.field[x][y].is_open)) {
                    this.field[x][y].is_open = true;
                    this.count_open_cells++;
                    if(!(this.field[x][y].count_around_mine === 0)) 
                    this.field[x][y].el.innerHTML = this.field[x][y].count_around_mine;
                    this.field[x][y].el.classList.add("open");
                    if(this.field[x][y].count_around_mine === 0) {
                        if(!(this.field[x][y_up].is_mine) && !(this.field[x][y_up].is_open)) stack.push({x: x, y: y_up});
                        if(!(this.field[x][y_down].is_mine) && !(this.field[x][y_down].is_open)) stack.push({x: x, y: y_down});
                        if(!(this.field[x_left][y].is_mine) && !(this.field[x_left][y].is_open)) stack.push({x: x_left, y: y});
                        if(!(this.field[x_right][y].is_mine) && !(this.field[x_right][y].is_open)) stack.push({x: x_right, y: y});
                    }
                }
            }
        }
        if(this.field[x][y].is_mine){

            if(!this.field[x][y].el.querySelector("div")) {
                let div = document.createElement("div");
                div.classList.add("bomb");
                this.field[x][y].el.appendChild(div);

                for (let i = 0; i < this.mine.length; i++){
                    if(!this.field[this.mine[i].x][this.mine[i].y].el.querySelector("div")){
                        let div = document.createElement("div");
                        div.classList.add("bomb");
                        this.field[this.mine[i].x][this.mine[i].y].el.appendChild(div);
                        this.field[this.mine[i].x][this.mine[i].y].el.classList.add('bomb_not_found');
                    }
                }
                if(confirm("Вы проиграли, хотели бы продолжить?"))  this.clearField();

            }

        }
        if((this.count_open_cells == (levelDifficulty.height * levelDifficulty.width - levelDifficulty.count_mine)) && (this.count_flag_on_mine == levelDifficulty.count_mine)){
            if(confirm("Вы выйграли, хотели бы продолжить?")) this.clearField();
        }
    }

    full_open(e){
        const x = e.target.cellIndex;
        const y = e.target.parentNode.rowIndex;
        let count_flag_around_point = 0;
        const x_start = x > 0 ? x - 1: x;
        const y_start = y > 0 ? y - 1:y;
        const x_end = x < levelDifficulty.width - 1 ? x + 1: x;
        const y_end = y < levelDifficulty.height - 1 ? y + 1: y;
        let flag = false;

        for ( let i = x_start; i <= x_end; i++){
            for (let j = y_start; j <= y_end; j++){
                 if(this.field[i][j].el.querySelector(".lock")){
                    count_flag_around_point++;
                 }
            }
        }

        if (count_flag_around_point == this.field[x][y].count_around_mine){
            for ( let i = x_start; i <= x_end; i++){
                for (let j = y_start; j <= y_end; j++){
                    if(this.field[i][j].is_mine) {
                        flag = true
                        if(this.field[i][j].el.querySelector(".lock")) this.field[i][j].el.querySelector(".lock").remove();
                    }


                    if(!this.field[i][j].is_open){
                        if(!(this.field[i][j].count_around_mine === 0)) {
                            if(this.field[i][j].el.querySelector(".lock")){
                                this.field[i][j].el.innerHTML = this.field[i][j].count_around_mine;
                                this.field[i][j].is_open = true;
                                this.field[i][j].el.classList.add("miss_lock");
                            }
                            else{
                                this.field[i][j].el.innerHTML = this.field[i][j].count_around_mine;
                                this.field[i][j].is_open = true;
                                this.field[i][j].el.classList.add("open");
                            }
                        
                        }
                        else{
                            this.field[i][j].el.classList.add("open");
                            this.field[i][j].is_open = true;
                        }
                        
                    }
            }
        }

        if(flag){
            for (let i = 0; i < this.mine.length; i++){
                let div = document.createElement("div");
                div.classList.add("bomb");
                this.field[this.mine[i].x][this.mine[i].y].el.appendChild(div);
                this.field[this.mine[i].x][this.mine[i].y].el.classList.add('bomb_not_found');
            }
            if(confirm("Вы проиграли, хотели бы продолжить?"))  this.clearField();  
        }
    }
}

    cell_lock(e){                                                                           //Установка флажка
        let x = e.target.cellIndex;
        let y = e.target.parentNode.rowIndex;
        let div = document.createElement("div");
        if(this.field[x][y].is_open) return;
        else if(!(this.field[x][y].el.querySelector(".lock"))) {
            div.classList.add("lock") 
            this.field[x][y].el.appendChild(div);
        }
        else this.field[x][y].el.querySelector(".lock").remove();
       
        if(this.field[x][y].is_mine) this.count_flag_on_mine++;

        document.oncontextmenu = off_context_menu;
    }
    
};

function off_context_menu() {return false}

class LevelDifficulty{                                                                      //Уровень сложности

    level = null;
    width = 0;
    height = 0;
    count_mine = 0;

    constructor(level) {
        this.updateLevel(level);
    }
    updateLevel(level) {
        this.level = level;
        this[level]();
    }
    easy () {
        this.width = 10;
        this.height = 10;
        this.count_mine = 20;
    }
    midle () {
        this.width = 15;
        this.height = 15;
        this.count_mine = 30;
    }
    hard () {    
        this.width = 20;
        this.height = 20;
        this.count_mine = 40;
    }
};

document.onreadystatechange = function () {
    if (document.readyState == "interactive") {
        const form = document.querySelector('form.menu_sapper');
        const level = form.level.value;

        form.addEventListener('change', () => {
            levelDifficulty.updateLevel(form.level.value);
            userInterface.clearField();
        })

        let div = document.querySelector(".field_sapper")

        userInterface = new UserInterface();
        levelDifficulty = new LevelDifficulty(level);

        userInterface.fillField();
        userInterface.createField();



        div.addEventListener("click", function(e){
            if(e.target.matches("td")) userInterface.recurse_open(e);
        });
        div.addEventListener("dblclick", function(e){
            let x = e.target.cellIndex;
            let y = e.target.parentNode.rowIndex;
            if(userInterface.field[x][y].count_around_mine > 0) userInterface.full_open(e);
        });
        div.addEventListener("contextmenu", function(e){
            if(e.target.matches("td")) userInterface.cell_lock(e);
        });
    
    }
};


Time = function (){
 let timer = document.querySelector(".timer");
 let hour = 0;
 let minute = 0;
 let second = 0;
 
}