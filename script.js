const cards = document.querySelectorAll('.memory-card');
const timerElement = document.getElementById('timer');
const resetButton = document.getElementById('reset-button');
const winMessage = document.getElementById('win-message');
const rankingList = document.getElementById('ranking-list');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchedCards = 0;

let timer;
let seconds = 0;
let ranking = [];

function startTimer() {
    timer = setInterval(() => {
        seconds++;
        timerElement.textContent = seconds;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function resetTimer() {
    clearInterval(timer);
    seconds = 0;
    timerElement.textContent = seconds;
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    if (seconds === 0) startTimer();

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    matchedCards += 2;

    if (matchedCards === cards.length) {
        gameWon();
    }

    resetBoard();
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 16);
        card.style.order = randomPos;
    });
}

function gameWon() {
    stopTimer();
    winMessage.classList.add('show');
    updateRanking(seconds);
}

function updateRanking(newTime) {
    ranking.push(newTime);
    ranking.sort((a, b) => a - b);
    ranking = ranking.slice(0, 3);

    rankingList.innerHTML = '';
    ranking.forEach(time => {
        const li = document.createElement('li');
        li.textContent = `${time} segundos`;
        rankingList.appendChild(li);
    });
}

function resetGame() {
    cards.forEach(card => {
        card.classList.remove('flip');
        card.addEventListener('click', flipCard);
    });

    resetBoard();
    matchedCards = 0;
    shuffle();
    resetTimer();
    winMessage.classList.remove('show');
}

cards.forEach(card => card.addEventListener('click', flipCard));
resetButton.addEventListener('click', resetGame);

shuffle();
