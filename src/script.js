const usernameContainer = document.querySelector(".username")
const usernameElement = document.getElementById("user");
const submitButton = document.querySelector("input[type='submit']");
const cardsContainer = document.querySelector(".cards");
const nameElement = document.querySelector(".name span")
const movesElement = document.querySelector(".moves-number")
const timeElement = document.querySelector(".time-number")
const startButton = document.querySelector(".start-game")
const againButton = document.querySelector(".end-game")
const resultContainer = document.querySelector(".result")


const imageArray = ["bear", "bird", "cow", "crab", "deer", "penguin", "delphine", "lion","bear", "bird", "cow", "crab", "deer", "penguin", "delphine", "lion"];
const sortedArray = sortArrayRandomly(imageArray);

let counter = 0;
let moves = 0;
let correctAnswers = 0;
let compare = [];

let delay = 500;

let gameResultEmoji = document.querySelector(".result .emoji");
let gameResultgame = document.querySelector(".result .game span");
let gameResultscore = document.querySelector(".result .score span");
let emojies = ["😲","😉","😕","😩"];



timeElement.innerHTML = "00:00";
movesElement.innerHTML = moves;
nameElement.innerHTML = localStorage.getItem("name");
createCards(imageArray.length);

if (nameElement.innerHTML === "") {
    usernameContainer.style.display = "flex";
}

submitButton.addEventListener("click",(e)=>{
    e.preventDefault();
    if (usernameElement.value === "" || usernameElement.value === null) {
        nameElement.innerHTML = "user"
    } else {
        nameElement.innerHTML = usernameElement.value;
    }
    localStorage.setItem("name",nameElement.innerHTML);
    usernameContainer.style.display = "none";
})

startButton.addEventListener("click",()=>{
    setTimeout(() => {
        startButton.classList.add("not-active");
        againButton.classList.add("active");
    }, delay);
    
    setTimeout(() => {
        makeAllcardsVisible();
    }, delay);

    appendRandomImages();

    cardsContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("front")) {
            // if we selected two cards we cant select more 
            if (compare.length < 2) {
                e.target.parentElement.classList.add("active");
            }
            if (e.target.parentElement.classList.contains("active")) {
                compare.push(e.target);
                
                if (compare.length === 2) {
                    
                    // compare the two selected cards
                    if (compare[0].classList[1] !== compare[1].classList[1]) {
                        // show wrong moves and append it 
                        movesElement.innerHTML = ++moves;
                        setTimeout(()=>{
                            playAudio("lose");
                        },delay / 2)
                        setTimeout(() => {
                            compare.forEach(e=>{
                                e.parentElement.classList.remove("active");
                            })
                            compare.length = 0;
                        }, delay);
                    } else if  (compare[0].classList[1] === compare[1].classList[1]) {
                        correctAnswers++;
                        setTimeout(() => {
                            playAudio("correct")
                        }, delay / 2);
                        setTimeout(() => {
                            compare.forEach(e=>{
                                e.parentElement.classList.add("active");
                            })
                            compare.length = 0;
                        }, delay);
                    }
                    if (moves >= 12) {
                        // make all cards unclickable
                        document.querySelectorAll(".cards .card").forEach(card=>{
                            card.style.pointerEvents = "none";
                        })
                        setTimeout(() => {
                            showResultAndAudio("gameover",emojies[3],"lost","worse");
                        }, delay * 3);
                    }
                }
            }
        }
        win(correctAnswers);
    })
    timer(correctAnswers);
    
    againButton.addEventListener("click",()=>{
        location.reload();
    })
})


// create all the cards
function createCards(numberOfImages) {
    for (let i = 0; i < (numberOfImages); i++) {
        let card = document.createElement("div");
        card.className = "card";
        
        let cardFront = document.createElement("div");
        cardFront.className = "front";
        cardFront.innerHTML = "?";
        card.appendChild(cardFront)
        
        let cardBack = document.createElement("div");
        cardBack.className = "back";
        card.appendChild(cardBack)

        cardsContainer.appendChild(card);
    }
}

// when we start the game we will show all the cards for a second
function makeAllcardsVisible() {
    for (const card of cardsContainer.children) {
        card.classList.add("active");
        setTimeout(() => {
            card.classList.remove("active");
        }, delay);
    }
}

// appen images to the card's back
function appendRandomImages() {
    const backCard = document.querySelectorAll(".back");
    backCard.forEach((element,index)=>{
        element.style.backgroundImage = `url(/images/${sortedArray[index]}.png)`;
        element.previousSibling.classList.add(sortedArray[index]);
    })
}

// sort the array randomly
function sortArrayRandomly(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// make a timer
function timer() {
    let seconds = 0;
    let minutes = 1;

    let time = setInterval(() => {
        if (seconds === 0 && minutes > 0) {
            seconds = 59;
            minutes--;
        }
        if (seconds === 0 && minutes === 0) {
            clearInterval(time);
            showResultAndAudio("gameover",emojies[3],"loose","you dont have any");
        }
        if (resultContainer.style.display === "flex") {
            clearInterval(time);
        }
        timeElement.innerHTML = `${padZero(minutes)}:${padZero(seconds)}`
        seconds--;

    }, 1000);

    function padZero(num) {
        return num < 10 ? `0${num}` : num;
    }
}

// play all audios
function playAudio(type) {
    document.getElementById(type).play();
}

// check if the gamer is win :
function win(answers) {
    if (answers === 8) {
        setTimeout(() => {
            if (moves < 4) {
                showResultAndAudio("win",emojies[0],"win","perfect");
            } else if (moves >= 4 && moves < 8) {
                showResultAndAudio("win",emojies[1],"win","good");
            } else if (moves >= 8 && moves < 12) {
                showResultAndAudio("win",emojies[2],"win","bad");
            }
        }, delay * 2);
    }
}

function showResultAndAudio(type,emojiNum,game,score) {
    resultContainer.style.display = "flex";
    gameResultEmoji.innerHTML = emojiNum;
    gameResultgame.innerHTML = game;
    gameResultscore.innerHTML = score;
    playAudio(type)
    let i = 3;
    setTimeout(() => {
        let inter = setInterval(() => {
            document.querySelector(".result .counter").textContent = i;
            document.querySelector(".result .counter").style.visibility = "visible";
            console.log(i)
            if (i === 0) {
                clearInterval(inter);
                location.reload();
            }
            i--;
        }, delay * 2);
    }, delay * 10);
}