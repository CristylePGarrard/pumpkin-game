# PumpkinRemake
Remake of the old flash Pumpkin game.
---
             ┌─────────────┐
             │   ASKING    │
             └──────┬──────┘
                    │
               player gives
                  an item
                    │
           ┌────────┴────────┐
           │                 │
         WRONG             CORRECT
           │                 │
           ▼                 ▼
      ┌─────────┐       ┌─────────┐
      │  ANGRY  │       │  HAPPY  │
      └────┬────┘       └────┬────┘
           │                 │
        response          response
           │                 │
           ▼                 ▼
        ASKING             EATING
           │                 │
           │              new request
           │                 │
           └────────┬────────┘
                    ▼
                 ASKING

---
Next Steps
[ ]  Correct item disappears from the counter
[ ]  Character enters EATING
[ ]  Eating animation plays
[ ]  Eating sound is selected from character data
[ ]  After eating, a new request appears
[ ]  Wrong items still repeat the same request
[ ]  Existing score system still works
[ ]  No real audio files required yet
[ ]  State transitions remain centralized                 

```
Ask → choose → correct/wrong → react → eat/throw → ask again.
```
---

```
ASKING
   ↓
player gives correct item
   ↓
HAPPY
   ↓
item disappears
   ↓
EATING
   ↓
eating sound
   ↓
new request
```
---
```
ROUND
│
├── Request: "I want an apple!"
│
├── Items:
│     🍎 🥕 🍔 🥛 🍕
│
└── Player chooses
       │
       ├── CORRECT
       │      ↓
       │    clear counter
       │      ↓
       │    eating
       │      ↓
       │    generate new round
       │      ↓
       │    🍞 🍎 🍌 🥛 🥨
       │
       └── WRONG
              ↓
           throw item
              ↓
           remove that item
              ↓
           same request

```
---
```

generateRound()
      ↓
items appear
      ↓
player chooses
      ↓
┌───────────────┐
│               │
CORRECT       WRONG
│               │
↓               ↓
clearItems()   throwItem()
│               │
↓               ↓
EATING        removeItem()
│               │
└───────┬───────┘
        ↓
  generateRound()

  
```

Next step → refactor the item/round lifecycle.
Then:
→ eating animation
→ throwing animation
→ variable round sizes
→ character selection
→ better speech bubbles
→ real character artwork + voice files
And eventually we'll be able to add a completely new character without rewriting the game engine. 🎃👻🧙‍♀️
