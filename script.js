let questionInput = document.getElementById('question');
let answerInput = document.getElementById('answer');
let addFlashcardBtn = document.getElementById('add-flashcard');

addFlashcardBtn.addEventListener('click', add_flashcard);

function main() {
    if (!localStorage.getItem('flashcards')) {
        save_flashcards();
    }
    load_flashcards();
}

const flashcards = [
    { question: "What is the capital of Norway?", answer: "Oslo" },
    { question: "What is 2 + 2?", answer: "4" },
    { question: "What is the largest planet in our solar system?", answer: "Jupiter" },
    // Add more flashcards here
];

const randomIndex = Math.floor(Math.random() * flashcards.length);
const randomFlashcard = flashcards[randomIndex];

function save_flashcards() {
    // Save the flashcards to local storage
    const flashcardsString = JSON.stringify(flashcards);
    localStorage.setItem('flashcards', flashcardsString);
}

function load_flashcards() {
    // Retrieve the flashcards from local storage
    // Get the string from localStorage
    const storedFlashcardsString = localStorage.getItem('flashcards');
    
    // Parse the string back to an array
    const storedFlashcards = JSON.parse(storedFlashcardsString);
    
    // Check if flashcards were successfully retrieved
    if (storedFlashcards) {
      console.log(storedFlashcards); // Use the array as needed
    } else {
      console.log('No flashcards found in localStorage.');
    }
}


function add_flashcard() {
    const question = questionInput.value;
    const answer = answerInput.value;

    flashcards.push({ question, answer });

    // Save the updated flashcards array to local storage
    localStorage.setItem('flashcards', JSON.stringify(flashcards));

    // Clear the input fields
    questionInput.value = '';
    answerInput.value = '';
}
