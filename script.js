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
            let questionContainer =
                document.getElementById("question-container");


            async function fetchCollections() {
                const response = await fetch("data.json");
                data = await response.json();
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

            function loadCollection(name) {
                currentCollection = name;
                document.getElementById("main-menu").style.display = "none";
                document.getElementById("flashcards").style.display = "block";
                title.textContent = data[name].title;
                questions = data[name].questions;
                if (shuffle) {
                    currentQuestion = Math.floor(
                        Math.random() * questions.length
                    );
                }
                displayCurrentQuestion();
                loadList();
            }

            function displayCurrentQuestion() {
                const currentQ = questions[currentQuestion];
                
                // Reset answer opacity instantly before changing content
                answer.style.transition = "opacity 0s";
                answer.style.opacity = "0";
                
                // Small delay to ensure opacity is reset
                setTimeout(() => {
                    if (typeof currentQ === 'string') {
                        question.textContent = currentQ;
                        answer.textContent = '';
                    } else {
                        question.textContent = currentQ.q;
                        answer.textContent = currentQ.a;
                    }
                    // Restore transition for future clicks
                    answer.style.transition = "opacity 0.3s ease";
                }, 50);
                
                number.textContent = `${currentQuestion + 1} / ${questions.length}`;
            }

            next.addEventListener("click", () => {
                previousQuestions.push(currentQuestion);
                if (shuffle) {
                    currentQuestion = Math.floor(
                        Math.random() * questions.length
                    );
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
            });

            shuffleToggle.addEventListener("click", () => {
                shuffle = !shuffle;
                if (shuffle) {
                    shuffleToggle.style.backgroundColor = "#aca";
                } else {
                    shuffleToggle.style.backgroundColor = "#f1f1f1";
                }
            });

            listToggle.addEventListener("click", () => {
                showlist = !showlist;
                if (showlist) {
                    listContainer.style.display = "block";
                    listToggle.style.backgroundColor = "#aca";
                    setTimeout(() => {
                        listContainer.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                } else {
                    listContainer.style.display = "none";
                    listToggle.style.backgroundColor = "#f1f1f1";
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }
            });

            questionContainer.addEventListener("click", () => {
                const currentQ = questions[currentQuestion];
                if (typeof currentQ === "object" && currentQ.a) {
                    answer.style.opacity =
                        answer.style.opacity === "0" ? "1" : "0";
                }
            });

            function loadList() {
                const listContainer = document.getElementById("list-container");
                listContainer.innerHTML = "";
                questions.forEach((q) => {
                    const listItem = document.createElement("li");
                    listItem.textContent = typeof q === "string" ? q : q.q;
                    listContainer.appendChild(listItem);
                });
            }

            fetchCollections();