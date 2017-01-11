"use strict";

const data = require('./data');
const inquirer = require('inquirer');

console.log("------------------------------------------");
console.log("Welcome Olivia to your city code trainer!!");
console.log("------------------------------------------");

console.log("");

const continents = [
    "North America",
    "Central America and South America",
    "Asia and the South West Pacific",
    "Africa",
    "Europe"
];

let numberOfQuestions;
let exerciceData = [];

let settingQuestions = [
    {
        type: 'checkbox',
        message: 'Please select the continents you would like to practice: ',
        name: 'continents',
        choices: continents,
        validate: function (answer) {
            if (answer.length < 1) {
                return 'You must choose at least one continent.';
            }
            for (let i=0; i < data.length; i++) {
                if (answer.indexOf(data[i].continent) > -1) {
                    exerciceData.push(data[i]);
                }
            }

            return true;
        }
    },
    {
        type: 'input',
        name: 'numberOfQuestions',
        message: 'How many questions would you like to practice?',
        default: function () {
            return exerciceData.length;
        },
        validate: function (answer) {
            if (answer < 1) {
                return 'You must choose at least one question.';
            }
            if (answer > exerciceData.length) {
                return 'The selected continents only allow ' + exerciceData.length + " combinations";
            }
            numberOfQuestions = answer - 1;
            return true;
        }
    }
];



inquirer.prompt(settingQuestions)
    .then(afterSettingQuestions)
    .then(main)
    .catch(function(error) {
        console.log("Error: " + error);
    });


function afterSettingQuestions() {
    return exerciceData;
}

function main(answers) {
    "use strict";

    let questions = prepareQuestions(answers);

    inquirer.prompt(questions).then(function() {
        console.log("Well Done!");
    });

}

function prepareQuestions(answers) {ß

    let askedBuffer = [];
    let questions = [];
    let q = 0;

    console.log(numberOfQuestions);

    while (q<numberOfQuestions) {
        let index = getRandomInt(0, answers.length - 1, askedBuffer);
        let questionData = answers[index];
        let type = (getRandomInt(0,1,[]) === 0);

        if(type) {
            questions.push(
                {
                    type: 'Input',
                    name: 'cityCode',
                    message: 'Which code corresponds to the city ' + questionData.city + ' and country ' + questionData.country,
                    validate: function (answer) {
                        if (answer.trim().toUpperCase().localeCompare(questionData.cityCode.trim().toUpperCase())) {
                            return 'Incorrect answer, try again';
                        }
                        return true;
                    }
                });
        } else {
            questions.push(
                {
                    type: 'Input',
                    name: 'city',
                    message: 'Which city corresponds to the cityCode ' + questionData.cityCode + ' and country ' + questionData.country,
                    validate: function (answer) {
                        if (answer.trim().toUpperCase() !== questionData.city.trim().toUpperCase()) {
                            return 'Incorrect answer, try again';
                        }
                        return true;
                    }
                });
        }

        askedBuffer.push(index);

        q++;
    }

    return questions;

}

function getRandomInt(min, max, askedBuffer) {
    "use strict";
    let index = Math.floor(Math.random() * (max - min + 1)) + min;
    if(askedBuffer.indexOf(index) > -1) {
        return getRandomInt(min, max, askedBuffer);
    }
    return index;
}



