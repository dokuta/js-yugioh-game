// game states
const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playerSides: {
        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards"),
    },
    actions: {
        button: document.getElementById("next-duel"),
    }
};

// cards enum (easier access)
const pathImages = "./src/assets/icons/";
const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1],
    },
];

// getting random cards by id
async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);

    return cardData[randomIndex].id;
}

// getting card images
async function createCardImage(idCard, fieldSide) {
    // creating the img tag
    const cardImage = document.createElement("img");

    // setting attributes and class
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", idCard);
    cardImage.classList.add("card");

    // setting cards in the field
    if (fieldSide === playerSides.player1) {

        // showing hovering cards on the left
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(idCard);
        });

        // click listener
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });

    }

    return cardImage;
}

// setting player's and cpu's cards in field
async function setCardsField(cardId) {
    // cleaning the field
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    await showHiddenCardFieldsImages(true);

    await hiddenCardDetails();

    await drawCardsInField(cardId, computerCardId);

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

// drawing cards in the field
async function drawCardsInField(cardId, computerCardId) {
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

// reseting images
async function showHiddenCardFieldsImages(value) {
    if (value === true) {
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }

    if (value === false) {
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

// reseting texts
async function hiddenCardDetails() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
}

// updating button
async function drawButton(text) {
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
}

// updating score
async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

// duel function
async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "draw";
    let playerCard = cardData[playerCardId];

    if (playerCard.WinOf.includes(computerCardId)) {
        duelResults = "win";
        state.score.playerScore++;
    }

    if (playerCard.LoseOf.includes(computerCardId)) {
        duelResults = "lose";
        state.score.computerScore++;
    }

    await playAudio(duelResults);

    return duelResults;
}

// removing the images
async function removeAllCardsImages() {
    // getting the states at the same time
    let { computerBOX, player1BOX } = state.playerSides;

    // computer cards
    let imgElements = computerBOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    // player cards
    imgElements = player1BOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

// drawing selected cards
async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attribute: " + cardData[index].type;
}

// drawing the cards
async function drawCards(cardNumbers, fieldSide) {

    for (let i = 0; i < cardNumbers; i++) {
        // drawing random cards
        const idCard = await getRandomCardId();
        const cardImage = await createCardImage(idCard, fieldSide);

        // showing card image
        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

// restarting the duel
async function resetDuel() {
    // reseting the visuals
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

// playing the sounds
async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);

    try {
        audio.play();
    } catch { }
}

// starting the game
function init() {
    showHiddenCardFieldsImages(false);

    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.play();
}

init();