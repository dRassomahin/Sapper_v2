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
        document.querySelector(".count_flag").innerHTML = levelDifficulty.count_flag;

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
                time.stop();
                setTimeout(() => this.lose(), 300);
                
        }
       
    }
    this.check_on_win();
}

    check_on_win(){
        if((this.count_open_cells == (levelDifficulty.height * levelDifficulty.width - levelDifficulty.count_mine)) && (this.count_flag_on_mine == levelDifficulty.count_mine)){
            time.stop();
            setTimeout(() => this.win(), 300);
        }
    }

    around_open(e){
        const x = e.target.cellIndex;
        const y = e.target.parentNode.rowIndex;
        let count_flag_around_point = 0;
        const x_start = x > 0 ? x - 1: x;
        const y_start = y > 0 ? y - 1:y;
        const x_end = x < levelDifficulty.width - 1 ? x + 1: x;
        const y_end = y < levelDifficulty.height - 1 ? y + 1: y;

        for( let i = x_start; i <= x_end; i++){
            for ( let j = y_start; j <= y_end; j++){
                if (this.field[i][j].el.querySelector(".lock")) count_flag_around_point++;
            }
        }

        if (count_flag_around_point == this.field[x][y].count_around_mine){
            for( let i = x_start; i <= x_end; i++){
                for ( let j = y_start; j <= y_end; j++){
                    if(!this.field[i][j].is_open && !this.field[i][j].is_mine && !this.field[i][j].el.querySelector(".lock")){
                        if(!(this.field[i][j].count_around_mine == 0)){
                            this.count_open_cells++;
                            this.field[i][j].is_open = true;
                            this.field[i][j].el.innerHTML = this.field[i][j].count_around_mine;
                            this.field[i][j].el.classList.add("open");
                        }
                        else {
                            this.count_open_cells++;
                            this.field[i][j].is_open = true;
                            this.field[i][j].el.classList.add("open");
                        }
                    }
                    if(!this.field[i][j].is_open && this.field[i][j].is_mine && !this.field[i][j].el.querySelector(".lock")) {
                        this.field[i][j].is_open = true;
                        for (let i = 0; i < this.mine.length; i++){
                            let div = document.createElement("div");
                            div.classList.add("bomb");
                            if(this.field[this.mine[i].x][this.mine[i].y].el.querySelector(".lock")) this.field[this.mine[i].x][this.mine[i].y].el.querySelector(".lock").remove();
                            this.field[this.mine[i].x][this.mine[i].y].el.appendChild(div);
                            this.field[this.mine[i].x][this.mine[i].y].el.classList.add('bomb_not_found');
                        }
                        time.stop();
                        setTimeout(() => this.lose(), 300);
                    }
                    
                }
            }
        }
        this.check_on_win();
    }

    cell_lock(e){                                                                           //Установка флажка
        let x = e.target.cellIndex;
        let y = e.target.parentNode.rowIndex;
        let div = document.createElement("div");
        if(this.field[x][y].is_open) return;
        else if(!(this.field[x][y].el.querySelector(".lock"))) {
            div.classList.add("lock") 
            this.field[x][y].el.appendChild(div);
            document.querySelector(".count_flag").innerHTML = --levelDifficulty.count_flag;
        }
        else {
            this.field[x][y].el.querySelector(".lock").remove();
            this.count_flag_on_mine--;
            document.querySelector(".count_flag").innerHTML = ++levelDifficulty.count_flag;
        }
       
        if(this.field[x][y].is_mine) this.count_flag_on_mine++;


        document.oncontextmenu = off_context_menu;

        this.check_on_win();
    }

    win (){
        if(confirm("Вы выиграли, хотите продолжить?")) this.clearField();
    }
    lose(){
        if(confirm("Вы проиграли, хотите продолжить?")) this.clearField();
    }
    
};

function off_context_menu() {return false}

class LevelDifficulty{                                                                      //Уровень сложности

    level = null;
    width = 0;
    height = 0;
    count_mine = 0;
    count_flag = 0

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
        this.count_mine = 10;
        this.count_flag = 10;
    }
    midle () {
        this.width = 15;
        this.height = 15;
        this.count_mine = 20;
        this.count_flag = 20;
    }
    hard () {    
        this.width = 20;
        this.height = 20;
        this.count_mine = 30;
        this.count_flag = 30;
    }
};

document.onreadystatechange = function () {



    
    if (document.readyState == "interactive") {
        const form = document.querySelector('form.menu_sapper');
        const level = form.level.value;

        form.addEventListener('change', () => {
            levelDifficulty.updateLevel(form.level.value);
            userInterface.clearField();
            time.stop();
            time.start(0);
        })

        let div = document.querySelector(".field_sapper")

        userInterface = new UserInterface();
        levelDifficulty = new LevelDifficulty(level);
        time = new Time();
        userInterface.fillField();
        userInterface.createField();



        div.addEventListener("click", function(e){
            if(e.target.matches("td")) userInterface.recurse_open(e);
        });
        div.addEventListener("dblclick", function(e){
            let x = e.target.cellIndex;
            let y = e.target.parentNode.rowIndex;
            if(userInterface.field[x][y].count_around_mine > 0) userInterface.around_open(e);
        });
        div.addEventListener("contextmenu", function(e){
            if(e.target.matches("td")) userInterface.cell_lock(e);
        });



        document.querySelector('#StartGame').addEventListener('click', function(event) { 
            document.querySelector(".background_sapper").hidden = false;
            document.querySelector(".count_flag").innerHTML = levelDifficulty.count_flag;
            time.stop();
            time.start(0);
        }); 

    }
};


class Time {
    timeout = null;
    hour = 0;
    minute = 0;
    second = 0;

    constructor() {
        this.tick = this.tick.bind(this);
    }

    tick() {
        if (this.second == 60){
            this.second = 0;
            this.minute++;
        }
        if (this.minute == 60){
            this.minute = 0;
            this.hour++;
        };
        document.querySelector(".timer").innerHTML = this.hour + ":" + this.minute + ":" + this.second++;
        this.timeout = setTimeout(this.tick, 1000); 
    }

    start(second) {
        this.hour = 0;
        this.minute = 0;
        this.second = second;
        this.tick();
    }

    stop() {
        clearTimeout(this.timeout);
    }
}
