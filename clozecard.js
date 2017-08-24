

function ClozeCard(fullText, cloze){
    this.fullText = fullText.toString();
    this.cloze = cloze.toString();
    this.partial = fullText.split(cloze);
    this.clozeRemoved = function(){
        //return  this.partial.indexOf("''")
        //return  this.partial.splice(this.partial.indexOf("''", 1))
        return fullText.replace(cloze, "....")
    }

}

var test = new ClozeCard("Let us do a quick test", "test");
console.log(test.partial);
console.log(test.clozeRemoved());
console.log(test.cloze);
console.log(test.fullText);

// Constructor that creates a prototype of ClozeCard to return the close-formatted question
// function ClozeCardPrototype() {
//     this.clozeRemoved = function(){
//         return 
//         `
//         ${this.partial[0]} ... ${this.partial[1]}
//         `
//     }
// }

// ClozeCard.prototype = new ClozeCardPrototype();

module.exports =  ClozeCard
