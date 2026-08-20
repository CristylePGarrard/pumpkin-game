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

const items = [
    {
        id: "milk",
        name: "Milk",
        emoji: "🥛",
        x: 150,
        y: 470
    },
    {
        id: "apple",
        name: "Apple",
        emoji: "🍎",
        x: 350,
        y: 470
    },
    {
        id: "burger",
        name: "Burger",
        emoji: "🍔",
        x: 550,
        y: 470
    },
    {
        id: "carrot",
        name: "Carrot",
        emoji: "🥕",
        x: 750,
        y: 470
    }
];

const requests = [
    {
        text: "Give me the milk!",
        correctItem: "milk"
    },
    {
        text: "I want an apple!",
        correctItem: "apple"
    },
    {
        text: "Give me a burger!",
        correctItem: "burger"
    },
    {
        text: "Can I have a carrot?",
        correctItem: "carrot"
    }
];

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

function newRequest() {
    currentRequest = randomItem(requests);

    messageElement.textContent = currentRequest.text;

    draw();
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
    ctx.font = "100px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText("🎃", 450, 200);

    ctx.font = "24px sans-serif";
    ctx.fillStyle = "#222";

    ctx.fillText("Customer", 450, 275);
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
            "That's the stuff!"
        ]);
    } else {
        messageElement.textContent = randomItem(wrongResponses);
    }

    draw();
}

nextRequestButton.addEventListener("click", newRequest);

newRequest();
