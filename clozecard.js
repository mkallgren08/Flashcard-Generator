

function ClozeCard(fullText, cloze){
    this.fullText = fullText.toString();
    this.cloze = cloze.toString();
    this.partial = fullText.split(cloze)

}

var test = new ClozeCard("Let's do a quick test", "test");
console.log(test.partial[0])
console.log(test.cloze);
console.log(test.fullText);

// Constructor that creates a prototype of ClozeCard to return the close-formatted question
function ClozeCardPrototype() {
    this.clozeRemoved = function(){
        return 
        `
        ${this.partial[0]} ... ${this.partial[1]}
        `
    }
}

ClozeCard.prototype = new ClozeCardPrototype();

module.exports = {
    ClozeCard,
}