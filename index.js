const cityCodes = require('./cityCodes');
const airlines = require('./airlines')
const inquirer = require('inquirer');

console.log("------------------------------------------");
console.log("Welcome Olivia to your city code trainer!!");
console.log("------------------------------------------");

console.log("");

const continents = [
    "North America",
    "Central America and South America",
    "Asia and the South West Pacific",
    "Middle East",
    "Africa",
    "Europe"
];

var numberOfQuestions;
var exerciceData = [];
var includeAirlines = true;

var settingQuestions = [
    {
        type: 'confirm',
        message: 'Please select if you want to include airlines codes questions: ',
        name: 'airlines',
        default: true,
        validate: function (answer) {
            includeAirlines = !!answer;
            console.log(includeAirlines);
            return true;
        }
    },
    {
        type: 'checkbox',
        message: 'Please select the continents you would like to practice: ',
        name: 'continents',
        choices: continents,
        validate: function (answer) {
            for (let i=0; i < cityCodes.length; i++) {
                if (answer.indexOf(cityCodes[i].continent) > -1) {
                    exerciceData.push(cityCodes[i]);
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
            if (includeAirlines) return exerciceData.length + airlines.length - 2;
            return exerciceData.length - 1;
        },
        validate: function (answer) {
            var maxNumber = exerciceData.length -1;
            if (includeAirlines) maxNumber += airlines.length - 1;
            if (answer < 1) {
                return 'You must choose at least one question.';
            }
            if (answer > maxNumber) {
                return 'The selected continents only allow ' + maxNumber + " combinations";
            }
            numberOfQuestions = answer;
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


function afterSettingQuestions(settingsData) {
    return exerciceData;
}

function main(answers) {
    "use strict";

    var questions = prepareQuestions(answers);

    inquirer.prompt(questions).then(function() {
        console.log("Well Done!");
    });

}

function prepareQuestions(selectedContinentsCityCodes) {

    let askedBufferCityCodes = [];
    let askedBufferAirlines = [];
    let questions = [];
    let q = 0;

    while (q<numberOfQuestions) {
        let questionData = {};
        let index = 0;
        if (askedBufferAirlines.length === airlines.length) {
            console.log("All airlines asked!");
            type = getRandomInt(2,3,[]);
            index = getRandomInt(0, selectedContinentsCityCodes.length - 1, askedBufferCityCodes);
            questionData = selectedContinentsCityCodes[index];
        } else if (askedBufferCityCodes.length === selectedContinentsCityCodes.length || selectedContinentsCityCodes.length === 0) {
            type = getRandomInt(4,5,[]);
            index = getRandomInt(0, airlines.length - 1, askedBufferAirlines);
            questionData = airlines[index];
        } else {
            if(getRandomInt(0,1,[])) {
                type = getRandomInt(2,3,[]);
                index = getRandomInt(0, selectedContinentsCityCodes.length - 1, askedBufferCityCodes);
                questionData = selectedContinentsCityCodes[index];
            } else {
                type = getRandomInt(4,5,[]);
                index = getRandomInt(0, airlines.length - 1, askedBufferAirlines);
                questionData = airlines[index];
            }
        }

        switch (type) {
            case 0:
                questions.push({
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
                askedBufferCityCodes.push(index);
                break;

            case 1:
                questions.push({
                    type: 'Input',
                    name: 'city',
                    message: 'Which city corresponds to the code ' + questionData.cityCode + ' and country ' + questionData.country,
                    validate: function (answer) {
                        if (answer.trim().toUpperCase().localeCompare(questionData.city.trim().toUpperCase())) {
                            return 'Incorrect answer, try again';
                        }
                        return true;
                    }
                });
                askedBufferCityCodes.push(index);
                break;

            case 2:
                questions.push({
                    type: 'Input',
                    name: 'city',
                    message: 'Which city corresponds to the code ' + questionData.cityCode,
                    validate: function (answer) {
                        if (answer.trim().toUpperCase().localeCompare(questionData.city.trim().toUpperCase())) {
                            return 'Incorrect answer, try again';
                        }
                        return true;
                    }
                });
                questions.push({
                    type: 'Input',
                    name: 'code',
                    message: 'Which country corresponds to the city ' + questionData.city,
                    validate: function (answer) {
                        if (answer.trim().toUpperCase().localeCompare(questionData.country.trim().toUpperCase())) {
                            return 'Incorrect answer, try again';
                        }
                        return true;
                    }
                });
                askedBufferCityCodes.push(index);
                break;
            case 3:
                questions.push({
                    type: 'Input',
                    name: 'code',
                    message: 'Which code corresponds to the city ' + questionData.city,
                    validate: function (answer) {
                        if ((answer.trim().toUpperCase()).localeCompare(questionData.cityCode.trim().toUpperCase())) {
                            return 'Incorrect answer, try again';
                        }
                        return true;
                    }
                });
                questions.push({
                    type: 'Input',
                    name: 'code',
                    message: 'Which country corresponds to the city ' + questionData.city,
                    validate: function (answer) {
                        if ((answer.trim().toUpperCase()).localeCompare(questionData.country.trim().toUpperCase())) {
                            return 'Incorrect answer, try again';
                        }
                        return true;
                    }
                });
                askedBufferCityCodes.push(index);
                break;
            case 4:
                questions.push({
                    type: 'Input',
                    name: 'code',
                    message: 'Which code corresponds to the airline company ' + questionData.airlineName,
                    validate: function (answer) {
                        if ((answer.trim().toUpperCase()).localeCompare(questionData.airlineCode.trim().toUpperCase())) {
                            return 'Incorrect answer, try again';
                        }
                        return true;
                    }
                });
                askedBufferAirlines.push(index);
                break;
            case 5:
                questions.push({
                    type: 'Input',
                    name: 'name',
                    message: 'Which name corresponds to the airline code ' + questionData.airlineCode,
                    validate: function (answer) {
                        if ((answer.trim().toUpperCase()).localeCompare(questionData.airlineName.trim().toUpperCase())) {
                            return 'Incorrect answer, try again';
                        }
                        return true;
                    }
                });
                askedBufferAirlines.push(index);
                break;
            default:
                console.log("Error in switch selector of questions");
                break;

        }

        q++;
    }

    return questions;

}

function getRandomInt(min, max, askedBuffer) {
    "use strict";
    let index = Math.floor(Math.random() * (max + 1 - min)) + min;
    if(askedBuffer.indexOf(index) > -1) {
        return getRandomInt(min, max, askedBuffer);
    }
    return index;
}



