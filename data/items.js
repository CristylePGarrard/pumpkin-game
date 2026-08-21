const itemCatalog = [
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

let items = [];

function createRoundItems() {
    items = itemCatalog.map(item => ({
        ...item
    }));
}
