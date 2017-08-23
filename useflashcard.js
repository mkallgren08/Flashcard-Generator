var inquirer = require("inquirer");
var library = require("./cardlibrary.json");
var BasicCard = require("./basicflashcard.js");
var ClozeCard = require("./clozecard.js");
var fs = require("fs");

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
        //askQuestions();
        return
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
                    back: answer.cardBack,
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
                    message: "Fill out the full text of your card (the answer.",
                     
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
                    cloze: answer.cloze,
                }

                if (cardObj.fulltext.indexOf(cardObj.close) !== -1){ // checking to make sure the cloze statement
                                                                     // is actually a part of the answer

                library.push(cardObj); // pushes the new Card into the array of cards in our libary file
                fs.writeFile("cardlibrary.json", JSON.stringify(library, null, 2)); // writes the updated array of cards
                                                                                    // as a "pretty" JSON object in the 
                                                                                    // library file
                } else {
                    console.log("I'm sorry, the cloze statement must match a portion of the phrase in the full text" + 
                    "Please check your spelling and try again")
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