const questionInput = document.getElementById('question');
const answerInput = document.getElementById('answer');
const questionText = document.getElementById('question-text');
const answerText = document.getElementById('answer-text');
const plusBtn = document.getElementById('add');
const nextBtn = document.getElementById('next');
const delBtn = document.getElementById('delete');
const formEl = document.getElementById('form');
const submitBtn = document.getElementById('submit');
const allFlashcards = [];
let currentFlashcardIndex = 0;


main();

function main() {
    formEl.style.display = "none";
    
    // Event listeners
    delBtn.addEventListener('click', delete_flashcard);
    plusBtn.addEventListener('click', () => formEl.style.display = "block");
    nextBtn.addEventListener('click', pick_random_flashcard);
    submitBtn.addEventListener('click', add_flashcard);


    if (!localStorage.getItem('flashcards')) {

    allFlashcards = [
        { question: "Who created Simula?", answer: "Kristen Nygård and Ole Johan Dahl" },
        { question: "Hello in Korean", answer: "안녕하세요" },
    ];
        save_flashcards();
    }
    load_flashcards();
    console.log(allFlashcards);
}


function pick_random_flashcard() {
    console.log(allFlashcards);
    currentFlashcardIndex = Math.floor(Math.random() * allFlashcards.length);
    const randomFlashcard = allFlashcards[currentFlashcardIndex];

    questionText.textContent = randomFlashcard.question;
    answerText.textContent = randomFlashcard.answer;
}


// LOCAL STORAGE ----------------------------
function save_flashcards() {
    // Save the flashcards to local storage
    const flashcardsString = JSON.stringify(allFlashcards);
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

    allFlashcards.push({ question, answer });

    save_flashcards();

    // Clear the input fields
    questionInput.value = '';
    answerInput.value = '';

    formEl.style.display = "none";

}

function delete_flashcard() {
    allFlashcards.splice(currentFlashcardIndex, 1);
    save_flashcards();
    pick_random_flashcard();
}