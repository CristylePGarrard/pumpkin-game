# PumpkinRemake
Remake of the old flash Pumpkin game.
---

---
```
PLAYER
  │
  │ gives item
  ↓
GAME
  │
  ├── correct
  │     ↓
  │   happy dialogue
  │     ↓
  │   text + MP3
  │
  └── wrong
        ↓
      angry dialogue
        ↓
      text + MP3
```
---
```
ID              Text                         Audio
milk_request    "Give me the milk!"          milk.mp3
wrong_01        "I don't want that!"         wrong1.mp3
wrong_02        "Ewwww!"                     wrong2.mp3
happy_01        "Yum!"                       yum1.mp3
eat_01          [no text]                    eat1.mp3
```
---
                    GAME ENGINE
                    game.js
                       │
           ┌───────────┴───────────┐
           │                       │
      GAME MECHANICS           CHARACTER DATA
           │                       │
     drag/drop/etc.             Pumpkin
           │                       │
           │              ┌────────┼────────┐
           │              │        │        │
           │           dialogue  reactions  sounds
           │              │        │        │
           │              ↓        ↓        ↓
           │             text     happy    eating
           │             audio    angry    etc.
           │
           ↓
       GAMEPLAY
---
                 game.js
              GAME ENGINE
                   │
                   │
        ┌──────────┴──────────┐
        ↓                     ↓
     items.js            characters.js
                              │
                    ┌─────────┼─────────┐
                    ↓         ↓         ↓
                 requests   happy     wrong
                              │
                              ↓
                         audio files
---
```
currentRequest
      ↓
player gives correct item
      ↓
happy response selected
      ↓
showDialogue(response)
      ↓
currentDialogue = response
      ↓
speech bubble changes
      ↓
     😋
```
--- 
