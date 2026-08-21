const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const messageElement = document.getElementById("message");
const nextRequestButton = document.getElementById("nextRequest");

const GAME_STATES = {
    ASKING: "asking",
    HAPPY: "happy",
    ANGRY: "angry",
    EATING: "eating"
};

let score = 0;
let currentRequest = null;
let currentDialogue = null;
let eatenItem = null;
let draggedItem = null;
let mouseX = 0;
let mouseY = 0;

let eatingFrame = 0;
let eatingAnimationTimer = null;

let gameState = GAME_STATES.ASKING;
let stateTimer = null;

const currentCharacter = characters[0];

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function setGameState(newState) {
    gameState = newState;

    if (stateTimer) {
        clearTimeout(stateTimer);
    }

    draw();
}

function transitionTo(newState) {

    if (
        gameState === GAME_STATES.EATING && newState !== GAME_STATES.EATING
    ) {
        stopEatingAnimation();
    }
    
    gameState = newState;

    if (stateTimer) {
        clearTimeout(stateTimer);
    }

    draw();

    switch (newState) {
        case GAME_STATES.ASKING:
            break;

        case GAME_STATES.HAPPY:
            stateTimer = setTimeout(() => {
                transitionTo(GAME_STATES.EATING);
            }, 500);
            break;

        case GAME_STATES.ANGRY:
            stateTimer = setTimeout(() => {
                showDialogue(currentRequest);
                transitionTo(GAME_STATES.ASKING);
            }, 1500);
            break;

        case GAME_STATES.EATING:
            startEatingAnimation();
            playEatingSound();

            stateTimer = setTimeout(() => {
                stopEatingAnimation();
                eatenItem = null;   
                newRequest();
            }, 2000);
            break;
    }
}

function newRequest() {
    currentRequest = randomItem(
        currentCharacter.dialogue.requests
    );

    showDialogue(currentRequest);

    transitionTo(GAME_STATES.ASKING);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawRestaurant();

    if (currentRequest) {
        drawSpeechBubble(currentDialogue.text);
    }

    drawCharacter();
    drawItems();
}

function drawRestaurant() {
    // Wall
    ctx.fillStyle = "#d8b48a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Counter
    ctx.fillStyle = "#8b5a2b";
    ctx.fillRect(0, 400, canvas.width, 100);

    // Floor
    ctx.fillStyle = "#b8865b";
    ctx.fillRect(0, 500, canvas.width, 100);

    // Counter line
    ctx.fillStyle = "#5c3a1e";
    ctx.fillRect(0, 395, canvas.width, 10);
}

function drawSpeechBubble(text) {
    if (!text) {
        return;
    }

    const bubbleX = 300;
    const bubbleY = 40;
    const bubbleWidth = 300;
    const bubbleHeight = 80;

    // Bubble
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.roundRect(
        bubbleX,
        bubbleY,
        bubbleWidth,
        bubbleHeight,
        15
    );
    ctx.fill();
    ctx.stroke();

    // Bubble tail
    ctx.beginPath();
    ctx.moveTo(430, 120);
    ctx.lineTo(450, 140);
    ctx.lineTo(470, 120);
    ctx.closePath();

    ctx.fill();
    ctx.stroke();

    // Text
    ctx.fillStyle = "#222";
    ctx.font = "20px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        text,
        bubbleX + bubbleWidth / 2,
        bubbleY + bubbleHeight / 2
    );
}

function drawCharacter() {
    let emoji;

    switch (gameState) {
        case GAME_STATES.HAPPY:
            emoji = currentCharacter.states.happy;
            break;

        case GAME_STATES.ANGRY:
            emoji = currentCharacter.states.angry;
            break;

        case GAME_STATES.EATING:
            emoji = currentCharacter.states.eating[eatingFrame % currentCharacter.states.eating.length];
            break;

        case GAME_STATES.ASKING:
        default:
            emoji = currentCharacter.states.asking;
            break;
    }

    ctx.font = "100px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(emoji, 450, 200);

    ctx.font = "24px sans-serif";
    ctx.fillStyle = "#222";

    ctx.fillText(currentCharacter.name, 450, 275);
}

function drawItems() {
    for (const item of items) {
        if (eatenItem && item.id === eatenItem.id) {
            continue;
        }

        if (item === draggedItem) {
            continue;
        }

        ctx.font = "60px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(item.emoji, item.x, item.y);
    }

    if (draggedItem) {
        ctx.font = "60px serif";
        ctx.fillText(
            draggedItem.emoji,
            mouseX,
            mouseY
        );
    }
}

function getMousePosition(event) {
    const rect = canvas.getBoundingClientRect();

    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
}

function findItemAtPosition(x, y) {
    for (const item of items) {
        const distance = Math.sqrt(
            Math.pow(x - item.x, 2) +
            Math.pow(y - item.y, 2)
        );

        if (distance < 45) {
            return item;
        }
    }

    return null;
}

canvas.addEventListener("mousedown", (event) => {
    if (gameState !== "asking") {
        return;
    }
    getMousePosition(event);

    const item = findItemAtPosition(mouseX, mouseY);

    if (item) {
        draggedItem = item;
        draw();
    }
});

canvas.addEventListener("mousemove", (event) => {
    if (!draggedItem) {
        return;
    }

    getMousePosition(event);
    draw();
});

canvas.addEventListener("mouseup", () => {
    if (!draggedItem) {
        return;
    }

    const item = draggedItem;

    draggedItem = null;

    checkAnswer(item);
});

function checkAnswer(item) {
    if (item.id === currentRequest.correctItem) {
        score++;

        scoreElement.textContent = `Score: ${score}`;

        eatenItem = item;

        const response = randomItem(
            currentCharacter.dialogue.happy
        );

        showDialogue(response);

        transitionTo(GAME_STATES.HAPPY);

    } else {
        const response = randomItem(
            currentCharacter.dialogue.wrong
        );

        showDialogue(response);

        transitionTo(GAME_STATES.ANGRY);
    }
}

function playAudio(audioPath) {
    if (!audioPath) {
        return;
    }

    const audio = new Audio(audioPath);

    audio.play().catch(() => {
        console.log("Audio unavailable:", audioPath);
    });
}

function playEatingSound() {
    if (
        !currentCharacter.sounds ||
        !currentCharacter.sounds.eating ||
        currentCharacter.sounds.eating.length === 0
    ) {
        return;
    }

    const sound = randomItem(
        currentCharacter.sounds.eating
    );

    playAudio(sound);
}

function showDialogue(dialogue) {
    currentDialogue = dialogue;

    playAudio(dialogue.audio);

    draw();
}

function startEatingAnimation() {
    eatingFrame = 0;
    
    if (eatingAnimationTimer) {
        clearInterval(eatingAnimationTimer);
    }

    eatingAnimationTimer = setInterval(() => {
        eatingFrame++;
        draw();
    }, 300);
}

function stopEatingAnimation() {
    if (eatingAnimationTimer) {
        clearInterval(eatingAnimationTimer);
        eatingAnimationTimer = null;
    }

    eatingFrame = 0;
}

nextRequestButton.addEventListener("click", newRequest);

newRequest();
