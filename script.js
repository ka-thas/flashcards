// Description: This script is for a flashcard app that allows users to add, delete, and view flashcards.

// Variables
// Card
const questionText = document.getElementById('question-text');
const answerText = document.getElementById('answer-text');
// Menu
const menuEl = document.getElementById('menu');
const delBtn = document.getElementById('delete');
const plusBtn = document.getElementById('add');
const nextBtn = document.getElementById('next');
// Form
const formEl = document.getElementById('form');
const questionInput = document.getElementById('question');
const answerInput = document.getElementById('answer');
const closeBtn = document.getElementById('close');
const submitBtn = document.getElementById('submit');
// Logic
let allFlashcards = [];
let currentFlashcardIndex = 0;


main();

function main() {
    
    // Event listeners
    delBtn.addEventListener('click', delete_flashcard);
    plusBtn.addEventListener('click', show_form);
    nextBtn.addEventListener('click', pick_random_flashcard);
    submitBtn.addEventListener('click', add_flashcard);
    closeBtn.addEventListener('click', hide_form);



    if (!localStorage.getItem('flashcards')) { // If there are no flashcards in local storage
        allFlashcards = [
            { question: "Who created Simula?", answer: "Kristen Nygård and Ole Johan Dahl" },
            { question: "Hello in Korean", answer: "안녕하세요" },
        ];
            save_flashcards();
    }
    load_flashcards();
    console.log(allFlashcards);
    pick_random_flashcard();
}


function pick_random_flashcard() {
    const prev = currentFlashcardIndex;

    if (allFlashcards.length === 0) {
        questionText.textContent = "No flashcards available";
        answerText.textContent = "No flashcards available";

        return;
    }
    else if (allFlashcards.length === 1) {
        currentFlashcardIndex = 0;
    }
    else {
        while (prev === currentFlashcardIndex) {
            currentFlashcardIndex = Math.floor(Math.random() * allFlashcards.length);
        }
    }

    const randomFlashcard = allFlashcards[currentFlashcardIndex];

    questionText.textContent = randomFlashcard.question;
    answerText.textContent = randomFlashcard.answer;

    if (answerText.scrollHeight > 200) {
        answerText.style.overflowY = "scroll";
    } else {
        answerText.style.overflowY = "visible";
    }
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
    allFlashcards = JSON.parse(storedFlashcardsString);
}

function show_form() {
    formEl.style.display = "block";
    menuEl.style.marginBottom = "5px";
}

function hide_form() {
    // Clear the input fields
    questionInput.value = '';
    answerInput.value = '';
    formEl.style.display = "none";
    menuEl.style.marginBottom = "133px";
}

function add_flashcard() {
    const question = questionInput.value;
    const answer = answerInput.value;

    if (question === '' || answer === '') {
        alert('Please fill out both fields');
        return;
    }

    if (question.length > 180) {
        alert('Character limit exceeded for question (maximum 180 characters)');
        return;
    }

    allFlashcards.push({ question, answer });

    save_flashcards();

    // Clear the input fields
    questionInput.value = '';
    answerInput.value = '';
    console.log(allFlashcards);
}

function delete_flashcard() {
    allFlashcards.splice(currentFlashcardIndex, 1);
    save_flashcards();
    pick_random_flashcard();
}