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

const wrongResponses = [
    "I don't want that!",
    "Ewwww!",
    "That's not what I asked for!",
    "NOPE!",
    "Are you even listening to me?",
    "I can't eat that!",
    "Why would you give me that?!"
];

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
    currentRequest = randomItem(requests);

    messageElement.textContent = currentRequest.text;
    
    setGameState("asking");
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawRestaurant();
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

function drawCharacter() {
    const pumpkin = characters[0];

    let emoji;

    switch (gameState) {
        case "happy":
            emoji = pumpkin.states.happy;
            break;

        case "angry":
            emoji = pumpkin.states.angry;
            break;

        case "asking":
        case "waiting":
        default:
            emoji = pumpkin.states.asking;
            break;
    }

    ctx.font = "100px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(emoji, 450, 200);

    ctx.font = "24px sans-serif";
    ctx.fillStyle = "#222";

    ctx.fillText(pumpkin.name, 450, 275);
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

        messageElement.textContent = randomItem([
            "Yum!",
            "Mmmm!",
            "Delicious!",
            "Nom nom nom!",
            "That's the stuff!",
            "That hits the spot!",
            "Just what i needed!"
        ]);

        setGameState("happy", 1500);

    } else {
        messageElement.textContent = randomItem(wrongResponses);

        setGameState("angry", 1500);
    }
}

nextRequestButton.addEventListener("click", newRequest);

newRequest();
