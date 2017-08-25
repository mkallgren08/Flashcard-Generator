var inquirer = require("inquirer");
var library = require("./cardlibrary.json");
var BasicCard = require("./basicflashcard.js");
var ClozeCard = require("./clozecard.js");
var fs = require("fs");

var pulledCard;
var alreadyPulledArray = [];
var counter = 0;
var indexArray = [];

inquirer.prompt([
    {
        type: "list",
        message: "Would you like to make or use flashcards?",
        choices: ["Make", "Use"],
        name: "makeOrUse",
    }
]). then (function (answer) {
    if (answer.makeOrUse === "Make"){
        makeCard();
    } else {
        //indexArrayGenerator(library);
        askQuestions();
        //return
    }
});

function makeCard(){
    inquirer.prompt([
        {
            type: "list",
            name: "cardType",
            message: 'What type of card would you like to make?',
            choices: ["Basic Card", "Cloze card"],
            
        }
    ]).then  (function (answer){
        let cardType = answer.cardType;
        console.log(cardType);

        if (cardType === "Basic Card"){
            inquirer.prompt([
                {
                    type: "input",
                    name: "cardFront",
                    message: "Fill out the front of your card (the question).",
                     
                },
                {
                    type: "input",
                    name: "cardBack",
                    message: "Fill out the back of your card (the answer).",     
                    
                }

            ]).then  (function (answer){
                let cardObj = {
                    type: "Basic Card",
                    front: answer.cardFront,
                    back: answer.cardBack.toLowerCase(),
                }

                library.push(cardObj); // pushes the new Card into the array of cards in our libary file
                fs.writeFile("cardlibrary.json", JSON.stringify(library, null, 2)); // writes the updated array of cards
                                                                                    // as a "pretty" JSON object in the 
                                                                                    // library file

                inquirer.prompt([   // asks the user if they want to make a nother new card, begins a recursive loop
                    {
                        type: "list",
                        name: "newCardYorN",
                        message: "Do you want to make another card?",
                        choices: ["Yes", "No"]
                    }
                ]).then(function (answer){
                    if (answer.newCardYorN === "Yes"){
                        makeCard();  
                    } else{
                        return;     // This ends the app and returns us to the command line
                    }
                })
            });
        } else { // And here we make the code to make a cloze card!
            inquirer.prompt([
                {
                    type: "input",
                    name: "fullText",
                    message: "Fill out the full text of your card (the answer).",
                     
                },
                {
                    type: "input",
                    name: "cloze",
                    message: "Fill out the cloze(question) - i.e. the part of "+ 
                    "the answer you want omitted to test your knowledge.",     
                    
                }

            ]).then  (function (answer){
                let cardObj = {
                    type: "Cloze Card",
                    fullText: answer.fullText,
                    cloze: answer.cloze.toLowerCase(),
                    partial: answer.partial
                }

                if (cardObj.fullText.indexOf(cardObj.cloze) !== -1){ // checking to make sure the cloze statement
                                                                     // is actually a part of the answer

                library.push(cardObj); // pushes the new Card into the array of cards in our libary file
                fs.writeFile("cardlibrary.json", JSON.stringify(library, null, 2)); // writes the updated array of cards
                                                                                    // as a "pretty" JSON object in the 
                                                                                    // library file
                } else {
                    console.log("I'm sorry, the cloze statement must match a portion of the phrase in the full text. " + 
                    "Please check your spelling and try again.")
                    return;
                }

               

                inquirer.prompt([   // asks the user if they want to make a nother new card, begins a recursive loop
                    {
                        type: "list",
                        name: "newCardYorN",
                        message: "Do you want to make another card?",
                        choices: ["Yes", "No"]
                    }
                ]).then(function (answer){
                    if (answer.newCardYorN === "Yes"){
                        makeCard();  
                    } else{
                        return;     // This ends the app and returns us to the command line
                    }
                })
            });

        }



    })
}



function indexArrayGenerator(array){ // This function generates a random array of indeces to cycle through. The 
                                // length of the array should be the same as the length of the cardlibary JSON
    var indexCounter = array.length;
    function internalGenerator(array){
        while (0 !== indexCounter){
            var indexGen = Math.floor(Math.random()*indexCounter)
            console.log(indexGen)
                if (indexArray.indexOf(indexGen) === -1){
                    indexArray.push(indexArray)
                    console.log(indexArray);
                    indexCounter--; 
                    if (indexArray.length === array.length){
                        return indexArray;
                        console.log('Index array  = ' + indexArray)
                    }
                } else{
                    internalGenerator(array);
            }
        }
    }

internalGenerator(array)
}



function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function pullCard(card){
    if (card.type === "Basic Card"){
        pulledCard = new BasicCard(card.front, card.back)
        return pulledCard.front;
    } else {
        pulledCard = new ClozeCard(card.fullText, card.cloze)
        return pulledCard.clozeRemoved();
    }

}

var indexArrayCounter = 0;

function askQuestions(){
    // This is just a quick check to make sure the index array has been made
    //console.log(indexArray) ; 
    if (counter < library.length){
        // This function returns a card from the cardlibrary JSON.
        // It uses the randomly generated indexArray to simulate a card-shuffle
        // It uses the indexArrayCounter to keep track of which index on the indexArray 
        // we are currently *on*
        //let cardPath = library[indexArray[indexArrayCounter]];
        //indexArrayGenerator(library)
        shuffle(library)
        //let cardPath = library[indexArray[indexArrayCounter]];
        let cardPath = library[indexArrayCounter]
        pulledCard = pullCard(cardPath)
        //console.log(pulledCard);
        inquirer.prompt([
            {
                type: "input",
                message: pulledCard, // Remember, pulledCard shows either the front of the basic card 
                                     // or the partial text of a cloze card
                name: "userAnswer"
            }
        ]).then(function(answer){
            // Check if the user's answer matches the back of a basic card or the cloze statement.
            // console.log("Back of card (basic): " + cardPath.back);
            // console.log("Back of card (cloze): " + cardPath.cloze);
            // console.log ("user answer: " + answer.userAnswer);
            if (answer.userAnswer.toLowerCase() === cardPath.back || answer.userAnswer.toLowerCase() === cardPath.cloze){
                    console.log("Huzzah! You are correct.\n")
                } 
                // If the user was incorrect, show the correct answer
                else {
                    if (cardPath.back !== undefined){ //If the card HAS a .front property, then it's a Basic card
                                                         // If it doesn't, that means it's a Cloze card.
                        console.log("I'm sorry, the correct answer is: " + cardPath.back + ".\n")
                    } else {
                        console.log( "I'm sorry, the correct answer is: " + cardPath.cloze + ".\n")
                    }
                };
                indexArrayCounter++; // increases the counter for the next run-through!
                counter++;
                askQuestions(); //start the fun all over again!
        })
    }
}