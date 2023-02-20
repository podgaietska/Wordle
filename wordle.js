var height = 4; //num of guesses
var width = 4; //length of word

var row = 0; //current attempt num
var col = 0; //current letter 

var gameWon = false;
let mode = "light";
let word;
let wordHint;
let dictionary;

window.onload = function(){
    GetNewWords();
    initialize();
}

function GetNewWords() {
    fetch("https://api.masoudkf.com/v1/wordle", {
    headers: {
    "x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv",
    },
})
    .then((response) => {
        return response.json();
    })
    .then((res) => {
        dictionary = res.dictionary;
        let randomIndex = Math.floor(Math.random() * dictionary.length);
        word = dictionary[randomIndex].word.toUpperCase();
        wordHint = dictionary[randomIndex].hint;
    })
}

function initialize(){
    //create game board
    for (let r = 0; r<height; r++){
        for (let c = 0; c<width; c++){
            //<span id="0-0" class="tile"></span>
            let tile = document.createElement("span");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.innerText = "";
            document.getElementById("board").appendChild(tile);
        }
    }

    document.addEventListener("keyup", (e)=>{
        if("KeyA" <= e.code && e.code <= "KeyZ"){  //if user presses a key
            if (col < width){
                let currentTile = document.getElementById(row.toString() + "-" + col.toString());
                if (currentTile.innerText == ""){
                    currentTile.innerText = e.code[3];
                    col++;
                }
            }
        }
        else if (e.code == "Backspace"){  //if user presses backspace
            if (col > 0  && col <= width){
                col--;
            }
            let currentTile = document.getElementById(row.toString() + "-" + col.toString());
            currentTile.innerText = "";
        }

        else if (e.code == "Enter"){  //if user presses enter
            if (col == width){  //if user has completed word, 
                update();
                row ++;
                col = 0;
            }           
            else {
                alert("You must complete the word.");
            }
            }

        if (!gameWon && row == height){
            endGameLose();
        }
    })

}

function update(){
    let correct = 0;
    let letterCount = {};
    for (let i=0; i<word.length; i++){
        if (letterCount[word[i]] == undefined){
            letterCount[word[i]] = 1;
        }
        else{
            letterCount[word[i]]++;
        }
    }

    for (let c = 0; c<width; c++){
        let currentTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currentTile.innerText;

        if (letter == word[c]){
            currentTile.classList.add("correct");
            correct++;
            letterCount[letter] --;
        }
        if (correct == width){
            gameWon = true;
            let victoryText = document.getElementById("reveal-word-victory");
            victoryText.innerText = "You guessed the word " + word + " correctly!";
            victoryText.style.padding = "20px";
            let victoryMessage = document.getElementById("game-won-container");
            victoryMessage.style.display = "block";
            endGameWin();
        }
    }

    for (let c = 0; c<width; c++){
        let currentTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currentTile.innerText;

        if (!currentTile.classList.contains("correct")){
            if(word.includes(letter) && letterCount[letter] > 0){
                currentTile.classList.add("present");
                letterCount[letter] --;
            }
            else{
                currentTile.classList.add("absent");
            }
        }
        }   
    }

function displayHint(){
    let text = document.getElementById("hint");
    text.innerText = "Hint: " + wordHint;
    text.style.padding = "20px";
    let hint = document.getElementById("hint-container");
    let displaySetting = hint.style.display;
    if (displaySetting == "none"){
        hint.style.display = "block";
    }
    else {
        hint.style.display = "none";
    }
}

function endGameWin(){
    let hintMessage = document.getElementById("hint-container");
    let board = document.getElementById("board-container");
    let congrats = document.getElementById("congrats-container");
    board.style.display = "none";
    hintMessage.style.display = "none";
    congrats.style.display = "block";  
    }

function endGameLose(){
    let hintMessage = document.getElementById("hint-container");
    let loseMessage = document.getElementById("game-over-container");
    text = document.getElementById("reveal-word-loss")
    text.innerText = "You missed the word " + word + " and lost the game!";
    text.style.padding = "20px";
    loseMessage.style.display = "block";
    hintMessage.style.display = "none";
    }

function startOver() {
    if (gameWon){
        gameWon = false;
        let board = document.getElementById("board-container");
        let congrats = document.getElementById("congrats-container");
        board.style.display = "block";
        congrats.style.display = "none";
    }

    let randomIndex = Math.floor(Math.random() * dictionary.length);
    word = dictionary[randomIndex].word.toUpperCase();
    wordHint = dictionary[randomIndex].hint;

    for (let r = 0; r<height; r++){
        for (let c = 0; c<width; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.classList.remove("correct");
            tile.classList.remove("present");
            tile.classList.remove("absent");
            tile.innerText = "";
        }
    }

    if (row != 0 || col != 0){
        row = 0;
        column = 0;
    }

    let loseMessage = document.getElementById("game-over-container");
    loseMessage.style.display = "none";
    let victoryMessage = document.getElementById("game-won-container");
    victoryMessage.style.display = "none";
}

function displayRules(){
    let rules = document.getElementById("how-to-play-container");
    let displaySetting = rules.style.display;
    if (displaySetting == "none"){
        rules.style.display = "block";
    }
    else {
        rules.style.display = "none";
    }
}

function switchMode() {
    let elements = document.getElementsByClassName("el");
    tiles = document.getElementsByClassName("tile");

    if (mode == "light"){
        mode = "dark";
        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.add("dark-mode");
        }      
        for (let i = 0; i < tiles.length; i++) {
            tiles[i].classList.add("dark-mode");
        }
    }
    else{
        mode = "light";
        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.remove("dark-mode");
        }  
        for (let i = 0; i < tiles.length; i++) {
            tiles[i].classList.remove("dark-mode");
        } 
    }
}
