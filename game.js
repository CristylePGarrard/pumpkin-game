const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const messageElement = document.getElementById("message");
const nextRequestButton = document.getElementById("nextRequest");

let score = 0;
let currentRequest = null;
let draggedItem = null;
let mouseX = 0;
let mouseY = 0;

let gameState = "asking";
let stateTimer = null;

const currentCharacter = characters[0];

let currentDialogue = null;

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function setGameState(newState, duration = null) {
    gameState = newState;

    if (stateTimer) {
        clearTimeout(stateTimer);
    }

    if (duration) {
        stateTimer = setTimeout(() => {
            setGameState("asking");
        }, duration);
    }

    draw();
}

function newRequest() {
    currentRequest = randomItem(
        currentCharacter.dialogue.requests
    );

    showDialogue(currentRequest);
 
    setGameState("asking");
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
        case "happy":
            emoji = currentCharacter.states.happy;
            break;

        case "angry":
            emoji = currentCharacter.states.angry;
            break;

        case "asking":
        case "waiting":
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

        const response = randomItem(
            currentCharacter.dialogue.happy
        );

        showDialogue(response);

        setGameState("happy", 1500);

    } else {
        const response = randomItem(
            currentCharacter.dialogue.wrong
        );

        showDialogue(response);

        setGameState("angry", 1500);
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

function showDialogue(dialogue) {
    currentDialogue = dialogue;

    playAudio(dialogue.audio);

    draw();
}

nextRequestButton.addEventListener("click", newRequest);

newRequest();
