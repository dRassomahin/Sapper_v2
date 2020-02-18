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
                this.count_mine_around(x,y);
                this.mine.push({x,y});
                i++;
            }
        }
    }

    count_mine_around(x,y) {                                                             //Подсчет количества мин вокруг мины
        let x_start = x > 0 ? x - 1: x;
        let y_start = y > 0 ? y - 1: y;
        let x_end = x < levelDifficulty.width - 1 ? x + 1: x;
        let y_end = y < levelDifficulty.height - 1 ? y + 1: y;
        for ( let i = x_start; i < x_end; i++){
            for (let j = y_start; j < y_end; j++){
                if(!(this.field[i][j].is_mine)) this.field[i][j].count_around_mine++;
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
        while(stack.length > 0) {
            const {x , y} = stack.pop();
            let x_left = x > 0 ? x - 1: x;
            let x_right = x > 0 && x < levelDifficulty.width - 1 ? x + 1: x;
            let y_up = y > 0 ? y - 1: y;
            let y_down = y > 0 && y < levelDifficulty.height - 1 ? y + 1: y;
            const cell = this.field[x][y];
            console.log(cell)
            if((!cell.is_mine) && (cell.count_around_mine >= 0) && !(cell.is_open)) {
                cell.is_open = true;
                this.count_open_cells++;
                cell.el.innerHTML = cell.count_around_mine;
                cell.el.classList.add("open");
                if(cell.count_around_mine === 0) {
                    if(!(this.field[x][y_up].is_mine) && !(this.field[x][y_up].is_open)) stack.push({x: x, y: y_up});
                    if(!(this.field[x][y_down].is_mine) && !(this.field[x][y_down].is_open)) stack.push({x: x, y: y_down});
                    if(!(this.field[x_left][y].is_mine) && !(this.field[x_left][y].is_open)) stack.push({x: x_left, y: y});
                    if(!(this.field[x_right][y].is_mine) && !(this.field[x_right][y].is_open)) stack.push({x: x_right, y: y});
                }
            }
        }
    }

    cell_lock(e){                                                                           //Установка флажка
        let x = e.target.cellIndex;
        let y = e.target.parentNode.rowIndex;
        var div = document.createElement("div");
        if(this.field[x][y].is_open) return;
        else if(!(this.field[x][y].el.querySelector(".lock"))) {
            div.classList.add("lock") 
            this.field[x][y].el.appendChild(div);
        }
        else this.field[x][y].el.querySelector(".lock").remove();

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
        })

        let div = document.querySelector(".field_sapper")

        userInterface = new UserInterface();
        levelDifficulty = new LevelDifficulty(level);

        userInterface.fillField();
        userInterface.createField();



        div.addEventListener("click", function(e){
            if(e.target.matches("td")) userInterface.recurse_open(e);
        });
        div.addEventListener("contextmenu", function(e){
            if(e.target.matches("td")) userInterface.cell_lock(e);
        });
    
    }
};

