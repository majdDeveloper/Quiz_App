// Create Variable
let border = document.querySelector(".border");
let count = document.querySelector(".num_question");
let spans = document.querySelector(".loc");
let question = document.querySelector(".question");
let option_answers = document.querySelector(".answer_area");
let next_q = document.querySelector(".count_ques .next");
let count_ques = document.querySelector(".count_ques");
let result = document.querySelector(".result");
let timeOut = document.querySelector(".seconds");
let table = document.querySelector("table");
let try_agin = document.querySelector(".agin")
let num_q = 0;
let r_answer = 0;
let countdownInterval;
let width_border = 0;
let time_q = 6
// Access Json File 
function getFileQuestions() {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let question = JSON.parse(this.responseText);
            let questionNum = question.length;
            num_questions(questionNum);
            add_question(question[num_q], questionNum)
            countdown(time_q, questionNum);
            // Case Click Button Next
            next_q.onclick = () => {
                // Case Click Button Next Change Width Border_Top
                width_border += question.length
                border.style.width = `${width_border}%`;
                let right_a = question[num_q].right_answer;
                let sup_question = question[num_q].title;

                // Get Function Check Answer
                check_answer(sup_question, right_a, num_q);
                num_q++;

                //  Get Function Add Number Of Question And Span Access
                num_questions(questionNum);

                // Get Function Add Question And Option_Answers
                add_question(question[num_q], questionNum)
                if (num_q == question.length) {
                    next_q.innerHTML = "Finish And Delivery";
                }

                // Stop Timer
                clearInterval(countdownInterval);
                timeOut.innerHTML = `00:${time_q < 10 ? `0${time_q}` : time_q}`;

                // Get Function calculator Time 
                countdown(time_q, questionNum);
            }
        }
    }
    myRequest.open("GET", "question.json");
    myRequest.send();   
}

// Get Function Access Json File
getFileQuestions();

// Add Number Of Question And Span Access
function num_questions(num) {
    spans.innerHTML = "";
    if (num_q < num) {
        count.textContent = `Question: ${num_q+1}`
        for (let i =0; i < 10; i++) {
            let span = document.createElement("span");
            spans.appendChild(span);
            if (i <= num_q) {
                span.className = "span_on";
            }
        }
    } else {
        if (r_answer >= 8) {
            count.innerHTML = ` ${r_answer} From ${num_q} Is Bad`
            count.style.backgroundColor = "red";
        } else if(r_answer >= 5) {
            count.innerHTML = ` ${r_answer} From ${num_q} Is Good`
            count.style.backgroundColor = "#0075ff";
        } else if(r_answer >= 0) {
            count.innerHTML = ` ${r_answer} From ${num_q} Is Nice`
            count.style.backgroundColor = "#42855B";
        }
    }
}

// Add Question And Option_Answers
function add_question(obj, count) {
    question.innerHTML = "";
    option_answers.innerHTML = "";
    if (num_q < count) {
        // add question Title 
        let title_q = document.createElement("h2");
        title_q.appendChild(document.createTextNode(obj.title));
        question.appendChild(title_q);
        // add answers 
        for (let i = 1; i < 5; i++) {
            let option_a = document.createElement("div");
            option_a.className = "answer";
            let input = document.createElement("input");
            input.type = "radio";
            input.name = "answer";
            input.id = `answer_${i}`;
            input.dataset.answer = obj[`answer_${i}`];
            option_a.appendChild(input);
            let label = document.createElement("label");
            label.htmlFor = `answer_${i}`
            label.appendChild(document.createTextNode(obj[`answer_${i}`]));
            option_a.appendChild(label);
            option_answers.appendChild(option_a);
            if (i === 1) {
                input.checked = true;
            }
        }
    } else {
        result.style.display = "block";

        //Try_Agin Quiz
        try_agin.style.display = "block";
        try_agin.onclick = () => {
            location.reload();
        }
        spans.remove();
        count_ques.remove();
    }
}

// Check Answer
function check_answer(question, right_answer, count_q) {
    let user_a = document.getElementsByName("answer");
    let user_answer
    for (let i = 0; i < user_a.length; i++) {
        if (user_a[i].checked == true) {
            user_answer = user_a[i].dataset.answer
        }
    }
    if (right_answer == user_answer) {
        r_answer++;
    } 
    // add result question to result table
    let anim = setTimeout(() => {
        // Create ques
        let ques = document.createElement("tr");
        ques.className = `question_${num_q}`;
        // Create number_q
        let number_q = document.createElement("td");
        number_q.appendChild(document.createTextNode(num_q));
        ques.appendChild(number_q);
        // Create t_question
        let t_question = document.createElement("td");
        t_question.style.color = "#0075ff"
        t_question.appendChild(document.createTextNode(question));
        ques.appendChild(t_question);
        // Create right_select
        let right_select = document.createElement("td");
        right_select.appendChild(document.createTextNode(right_answer));
        right_select.style.color = "#42855B"
        ques.appendChild(right_select);
        // Create user_select
        let user_select = document.createElement("td");
        user_select.appendChild(document.createTextNode(user_answer));
        ques.appendChild(user_select);
        table.appendChild(ques)
        if (right_answer == user_answer) {
            // Create check_t
            let check_t = document.createElement("td");
            let icon_t = document.createElement("i");
            icon_t.className = "fa-solid fa-check";
            icon_t.style.color = "#3CCF4E";
            check_t.appendChild(icon_t);
            ques.appendChild(check_t);
        } else {
            // Create check_f
            let check_f = document.createElement("td");
            let icon_f = document.createElement("i");
            icon_f.className = "fa-solid fa-xmark";
            icon_f.style.color = "red";
            check_f.appendChild(icon_f);
            ques.appendChild(check_f);
        }
    }, `${num_q}0`);
}

// Calculator Time 
function countdown(duration, count) {
    let maxTime = duration;
    if (num_q < count) {
      let minutes, seconds;
      countdownInterval = setInterval(function () {
        function transform_time(valueTime) {
            minutes = parseInt(valueTime / 60);
            seconds = parseInt(valueTime % 60);
      
            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;
            timeOut.innerHTML = `${minutes}:${seconds}`;
        }

        if (maxTime == 0) {
          clearInterval(countdownInterval);
          next_q.click();
          transform_time(duration)
        } else {
            transform_time(maxTime)
            --maxTime;
        }
      }, 1000);
    }
}

///////////////////////////////////////Done