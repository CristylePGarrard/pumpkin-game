const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const messageElement = document.getElementById("message");

const GAME_STATES = {
    ASKING: "asking",
    HAPPY: "happy",
    ANGRY: "angry",
    EATING: "eating",
    THROWING: "throwing",
    DELIVERING: "delivering",
    GRABBING: "grabbing"
};

const PLATE = {
    x: 450,
    y: 350
};

let score = 0;
let currentRequest = null;
let currentDialogue = null;

let plateItem = null;
let draggedItem = null;
let thrownItem = null;
let deliveryItem = null;

let deliveryProgress = 0;
let deliveryStartX = 0;
let deliveryStartY = 0;

let grabbingProgress = 0;
let grabbingStartX = 0;
let grabbingStartY = 0;

let throwVelocityX = 0;
let throwVelocityY = 0;

let characterOffsetX = 0;
let characterOffsetY = 0;

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
            showDialogue(currentRequest);
            break;

        case GAME_STATES.HAPPY:
            stateTimer = setTimeout(() => {
                transitionTo(GAME_STATES.EATING);
            }, 500);
            break;

        case GAME_STATES.ANGRY:
            console.log("ENTERED ANGRY");

            stateTimer = setTimeout(() => {
                console.log("ABOUT TO TRANSITION TO THROWING");
                transitionTo(GAME_STATES.THROWING);
            }, 500);
            break;

        case GAME_STATES.EATING:
            startEatingAnimation();
            playEatingSound();

            stateTimer = setTimeout(() => {
                stopEatingAnimation();
                newRequest();
            }, 2000);
            break;
        
        case GAME_STATES.THROWING:
            console.log("ENTERED THROWING");
            startThrowing();
            break;

        case GAME_STATES.DELIVERING:
            break;

        case GAME_STATES.GRABBING:
            startGrabbing();
            break;
    }
}

function newRequest() {
    createRoundItems();    

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
    
    // Plate
    drawPlate();
}

function drawPlate() {
    const plateX = PLATE.x;
    const plateY = PLATE.y;

    // outer plate
    ctx.fillStyle = '#f5f5f5';
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.ellipse(
        plateX,
        plateY,
        100,
        35,
        0,
        0,
        Math.PI * 2
    );
    ctx.fill();
    ctx.stroke();
    
    //Inner Plate
    ctx.beginPath();
    ctx.ellipse(
        plateX,
        plateY,
        75,
        25,
        0,
        0,
        Math.PI * 2
    );
    ctx.stroke();
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

        case GAME_STATES.GRABBING:
            emoji = currentCharacter.states.asking;
            break;

        case GAME_STATES.ASKING:
        default:
            emoji = currentCharacter.states.asking;
            break;
    }

    ctx.font = "100px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(emoji, 450 + characterOffsetX, 200 + characterOffsetY);

    ctx.font = "24px sans-serif";
    ctx.fillStyle = "#222";

    ctx.fillText(currentCharacter.name, 450, 275);
}

function drawItems() {
    for (const item of items) {
        if (
            item === draggedItem || 
            item  === thrownItem || 
            item === deliveryItem
        ) {
            continue;
        }

        ctx.font = "60px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(item.emoji, item.x, item.y);
    }

    if (plateItem) {
        ctx.font = "60px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(
            plateItem.emoji,
            plateItem.x,
            plateItem.y
        );
    }

    if (draggedItem) {
        ctx.font = "60px serif";
        ctx.fillText(
            draggedItem.emoji,
            mouseX,
            mouseY
        );
    }
    if (deliveryItem) {
        ctx.font = "60px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(
            deliveryItem.emoji,
            deliveryItem.x,
            deliveryItem.y
        );
    }
    
    if (thrownItem) {
        ctx.font = "60px serif";
        ctx.fillText(
            thrownItem.emoji,
            thrownItem.x,
            thrownItem.y
        );
    }
}

function clearItems() {
    items = [];
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
    deliveryItem = item;

    startDelivery();
});

function checkAnswer(item) {
    if (item.id === currentRequest.correctItem) {
        score++;

        scoreElement.textContent = `Score: ${score}`;

        clearItems();
        draggedItem = null;

        const response = randomItem(
            currentCharacter.dialogue.happy
        );

        showDialogue(response);

        transitionTo(GAME_STATES.HAPPY);

    } else {
        thrownItem = item;

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

function startDelivery(){
    if (!deliveryItem) {
        return;
    }

    deliveryStartX = deliveryItem.x;    
    deliveryStartY = deliveryItem.y;

    deliveryProgress = 0;
    
    transitionTo(GAME_STATES.DELIVERING);

    requestAnimationFrame(updateDelivery);
}

function updateDelivery() {
    if (!deliveryItem) {
        return;
    }

    deliveryProgress += 0.045;

    if (deliveryProgress >= 1) {
        deliveryProgress = 1;
  
        deliveryItem.x = PLATE.x;
        deliveryItem.y = PLATE.y;

        draw();

        finishDelivery();
        return;
    }
    
    const easedProgress = 
        1 - Math.pow(1 - deliveryProgress, 3);

    deliveryItem.x = deliveryStartX + (PLATE.x - deliveryStartX) * easedProgress;
    deliveryItem.y = deliveryStartY + (PLATE.y - deliveryStartY) * easedProgress;

    draw();

    requestAnimationFrame(updateDelivery);
}

function finishDelivery() {
    plateItem = deliveryItem;

    deliveryItem = null;

    items = items.filter(item => item != plateItem);

    plateItem.x = PLATE.x;
    plateItem.y = PLATE.y;

    transitionTo(GAME_STATES.GRABBING);

    stateTimer = setTimeout(() => {
        const item = plateItem;
        
        plateItem = null;

        checkAnswer(item);
    }, 350);
} 

function startGrabbing() {
    if (!plateItem) {
        return;
    }

    grabbingProgress = 0;

    grabbingStartX = plateItem.x;
    grabbingStartY = plateItem.y;

    requestAnimationFrame(updateGrabbing);
}

function updateGrabbing() {
    if (!plateItem) {
        return;
    }

    grabbingProgress += 0.06;
    
    if (grabbingProgress >= 1) {
        grabbingProgress = 1;

        finishGrabbing();
        return;
    }

    const easedProgress = 1 - Math.pow(1 - grabbingProgress, 3);

    /* Move food from plate towards pumpkin */

    const targetX = 450;
    const targetY = 270;

    plateItem.x = grabbingStartX + (targetX - grabbingStartX) * easedProgress;
    plateItem.y = grabbingStartY + (targetY - grabbingStartY) * easedProgress;    

    characterOffsetY = 40* easedProgress;

    draw()

    requestAnimationFrame(updateGrabbing);
}

function finishGrabbing() {
    const item = plateItem;

    plateItem = null;
    
    characterOffsetX = 0;
    characterOffsetY = 0;

    checkAnswer(item);
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

function startThrowing() {
    if (!thrownItem) {
        return;
    }

    console.log("START THROWING", thrownItem);
    
    throwVelocityX = 11;
    throwVelocityY = -13;

    requestAnimationFrame(updateThrowing);
}

function updateThrowing() {
    if (!thrownItem) {
        return;
    }
  
    thrownItem.x += throwVelocityX;
    thrownItem.y += throwVelocityY;

    throwVelocityY += 0.5;

    draw();

    if (
        thrownItem.x < -100 ||
        thrownItem.x > canvas.width + 100 || 
        thrownItem.y < -100 ||
        thrownItem.y > canvas.height + 100
    ) {
        finishThrowing();
        return;
    }

    requestAnimationFrame(updateThrowing);
}

function finishThrowing() {
    console.log("FINISHED THROWING");

    items = items.filter(item => item !== thrownItem);

    thrownItem = null;

    transitionTo(GAME_STATES.ASKING);
}

createRoundItems();
newRequest();
