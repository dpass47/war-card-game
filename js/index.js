const newDeckBtn = document.querySelector(".new-deck-btn");
const drawCardBtn = document.querySelector(".draw-card-btn");
const imageContainer = document.querySelector(".image-container");
const gameScoreText = document.querySelector(".game-score-text");
const playerScoreHtml = document.querySelector(".player-score");
const computerScoreHtml = document.querySelector(".computer-score");
const remainingCards = document.querySelector(".remaining-cards");
const cardValues = {
	1: 1,
	2: 2,
	3: 3,
	4: 4,
	5: 5,
	6: 6,
	7: 7,
	8: 8,
	9: 9,
	10: 10,
	ACE: 14,
	KING: 13,
	QUEEN: 12,
	JACK: 11,
};

let deckID;
let computerCard;
let playerCard;
let computerCardData;
let playerCardData;
let playerScore = 0;
let computerScore = 0;

function resetData() {
	playerScore = 0;
	computerScore = 0;
	gameScoreText.innerHTML = `Game of War`;
	imageContainer.innerHTML = `<p class="card-placeholder"></p><p class="card-placeholder"></p>`;
	drawCardBtn.disabled = false;
	drawCardBtn.classList.remove("disabled");
}

async function getNewDeck() {
	const res = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle");
	const data = await res.json();
	deckID = data.deck_id;
	remainingCards.innerHTML = `Cards remaining: ${data.remaining}`;
	resetData();
	updateScore();
}

getNewDeck();

async function drawCard() {
	const res = await fetch(
		`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=2`
	);
	const data = await res.json();
	remainingCards.innerHTML = `Cards remaining: ${data.remaining}`;
	imageContainer.innerHTML = `<img src="${data.cards[0].image}"><img src="${data.cards[1].image}">`;
	computerCardData = data.cards[0];
	playerCardData = data.cards[1];
	gameScoreText.innerHTML = `${determineCardWinner()}`;
	updateScore();
	if (data.remaining === 0) {
		drawCardBtn.disabled = true;
		drawCardBtn.classList.add("disabled");
		gameScoreText.innerHTML = `${determineWinner()}`;
	}
}

function determineCardWinner() {
	playerCard = cardValues[playerCardData.value];
	computerCard = cardValues[computerCardData.value];

	if (playerCard === computerCard) {
		return "War!";
	} else if (playerCard > computerCard) {
		playerScore++;
		return "You win!";
	} else {
		computerScore++;
		return "Computer wins!";
	}
}

function determineWinner() {
	if (playerScore > computerScore) {
		return "You have won! Congratulations 🥳";
	} else if (playerScore === computerScore) {
		return "We have a tie! Play again?";
	} else {
		return "Computer has won! Try again!";
	}
}

function updateScore() {
	computerScoreHtml.innerHTML = `Computer: ${computerScore}`;
	playerScoreHtml.innerHTML = `Me : ${playerScore}`;
}

newDeckBtn.addEventListener("click", getNewDeck);
drawCardBtn.addEventListener("click", drawCard);
