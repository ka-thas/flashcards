const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

let question = document.getElementById("question");
let next = document.getElementById("next");
let previous = document.getElementById("previous");
let title = document.getElementById("title");
let backToMenu = document.getElementById("back-to-menu");
let number = document.getElementById("number");
let shuffleToggle = document.getElementById("shuffle-toggle");
let listToggle = document.getElementById("list-toggle");
let listContainer = document.getElementById("list-container");
let questions = [];
let data = [];
let previousQuestions = [];
let shuffle = false;
let currentCollection = "";
let currentQuestion = 0;
let showlist = false;
let answer = document.getElementById("answer");
let questionContainer = document.getElementById("question-container");

function resolveCombinedQuestions(data) {
    for (const key in data) {
        const collection = data[key];
        if (Array.isArray(collection.combine)) {
            let combined = [];
            collection.combine.forEach(ref => {
                if (data[ref] && Array.isArray(data[ref].questions)) {
                    combined = combined.concat(data[ref].questions);
                }
            });
            // Optionally, also include this collection's own questions
            if (Array.isArray(collection.questions) && collection.questions.length > 0) {
                combined = collection.questions.concat(combined);
            }
            collection.questions = combined;
        }
    }
}

async function fetchCollections() {
    const response = await fetch("data.json");
    data = await response.json();
    resolveCombinedQuestions(data);
    console.log(data);
    const collectionsDiv = document.getElementById("collections");
    for (const collectionName in data) {
        const button = document.createElement("button");
        button.textContent = data[collectionName].title;
        button.onclick = () => loadCollection(collectionName);
        button.id = "collection-button";
        button.style.margin = "6px";
        collectionsDiv.appendChild(button);
    }
}

async function loadCollection(name) {
    const url = new URL(window.location);
    url.searchParams.set("collection", name);
    history.pushState({}, "", url);
    currentCollection = name;
    document.getElementById("main-menu").style.display = "none";
    document.getElementById("flashcards").style.display = "block";
    title.textContent = data[name].title;

    if (data[name]["google sheets"]) {
        const csvUrl = data[name]["google sheets"];
        await new Promise((resolve) => {
            Papa.parse(csvUrl, {
                download: true,
                header: true,
                skipEmptyLines: true,
                complete(results) {
                    questions = results.data.map((row) => {
                        const keys = Object.keys(row);
                        const q = row[keys[0]];
                        const a = keys[1] ? row[keys[1]] : undefined;
                        return a ? { q, a } : q;
                    });
                    resolve();
                },
            });
        });
    } else {
        questions = data[name].questions;
    }

    currentQuestion = shuffle ? Math.floor(Math.random() * questions.length) : 0;
    displayCurrentQuestion();
    loadList();
}

function displayCurrentQuestion() {
    const currentQ = questions[currentQuestion];

    answer.classList.remove("concealed");
    answer.textContent = "";

    setTimeout(() => {
        if (typeof currentQ === "string") {
            question.textContent = currentQ;
        } else {
            question.textContent = currentQ.q;
            answer.textContent = currentQ.a;
            answer.classList.add("concealed");
        }
    }, 50);

    number.textContent = `${currentQuestion + 1} / ${questions.length}`;
}

next.addEventListener("click", () => {
    previousQuestions.push(currentQuestion);
    if (shuffle) {
        currentQuestion = Math.floor(Math.random() * questions.length);
    } else {
        currentQuestion = (currentQuestion + 1) % questions.length;
    }

    displayCurrentQuestion();
});

previous.addEventListener("click", () => {
    if (previousQuestions.length > 0) {
        currentQuestion = previousQuestions.pop();
        displayCurrentQuestion();
    }
});

backToMenu.addEventListener("click", () => {
    document.getElementById("main-menu").style.display = "block";
    document.getElementById("flashcards").style.display = "none";
    previousQuestions = [];
    const url = new URL(window.location);
    url.searchParams.delete("collection");
    history.pushState({}, "", url);
});

shuffleToggle.addEventListener("click", () => {
    shuffle = !shuffle;
    if (shuffle) {
        shuffleToggle.style.backgroundColor = cssVar("--primary");
    } else {
        shuffleToggle.style.backgroundColor = cssVar("--secondary");
    }
});

listToggle.addEventListener("click", () => {
    showlist = !showlist;
    if (showlist) {
        listContainer.style.display = "block";
        listToggle.style.backgroundColor = cssVar("--primary");
        setTimeout(() => {
            listContainer.scrollIntoView({ behavior: "smooth" });
        }, 100);
    } else {
        listContainer.style.display = "none";
        listToggle.style.backgroundColor = cssVar("--secondary");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
});

questionContainer.addEventListener("click", () => {
    const currentQ = questions[currentQuestion];
    if (typeof currentQ === "object" && currentQ.a) {
        answer.classList.toggle("concealed");
    }
});

function loadList() {
    const listContainer = document.getElementById("list-container");
    listContainer.innerHTML = "";
    questions.forEach((q, i) => {
        const listItem = document.createElement("li");
        listItem.textContent = typeof q === "string" ? q : q.q;
        listItem.style.cursor = "pointer";
        listItem.addEventListener("click", () => {
            previousQuestions.push(currentQuestion);
            currentQuestion = i;
            displayCurrentQuestion();
            listContainer.style.display = "none";
            listToggle.style.backgroundColor = cssVar("--secondary");
            showlist = false;
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
        listContainer.appendChild(listItem);
    });
}

fetchCollections().then(() => {
    const params = new URLSearchParams(window.location.search);
    const col = params.get("collection");
    if (col && data[col]) {
        loadCollection(col);
    }
});
