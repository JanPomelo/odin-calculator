/* initializing all variables */
//Display
let displayCurrent = document.getElementById('currentNum');
let displayPrevious = document.getElementById('prevResult');
let display = document.getElementById('display');

//Buttons
let resultButton = document.getElementById('resultBut');
let plusMinus = document.getElementById('specialBut');
let acButton = document.getElementById('acBut');
let deleteButton = document.getElementById('deleteBut');
let onOffBut = document.getElementById('OnOffBut');
let dotButton = document.getElementById('dotButton');
let buttonRows = [...document.getElementsByClassName('buttonRow')];

let buttons = buttonRows.reduce((button,buttonRow) => {
    return [...button,
        ...buttonRow.querySelectorAll('div')]
},[])

let numButtons = buttons.reduce((numButs,button) => {
    if(button.className === 'numBut') {
        return [...numButs,
        button];
    } else {
        return numButs;
    }
},[]); 

let operatorButtons = buttons.reduce((opButs,button) => {
    if(button.className === 'operatorBut') {
        return [...opButs,
        button];
    } else {
        return opButs;
    }
},[]); 
//Keys
const normalKeys = ['1','2','3','4','5','6','7','8','9','0'];
const operatorKeys = ['-','+','/','+'];

//initial Values
let on = false;
let didCalcBefore = false;

/* OnClick EventListener */

for (button in numButtons) {
    numButtons[button].addEventListener('click',function() {
        writeNumToDisplay(this.querySelectorAll('p')[0].innerText);
    });
}

for (button in operatorButtons) {
    operatorButtons[button].addEventListener('click',function() {
        writeOperatorToDisplay(this.querySelectorAll('p')[0].innerText);
    })
}

resultButton.addEventListener('click',function() {
    doCalcs()
});

plusMinus.addEventListener('click',writePlusMinToDisplay);

acButton.addEventListener('click',emptyDisplay);

deleteButton.addEventListener('click',deleteLastDispNumber);

onOffBut.addEventListener('click',onOff);

dotButton.addEventListener('click',dotButtonCheck);

//Keydown Eventlistener

document.addEventListener('keydown',function(event) {
    if (event.key === 'o' || event.key === 'O') {
        onOff();
    }
    if (on) {
        if (!displayToLong()) {
            if (normalKeys.includes(event.key)) {
                calcBefore();
                displayCurrent.innerHTML += event.key;
            } else if (operatorKeys.includes(event.key)) {
                didCalcBefore = false;
                displayCurrent.innerHTML += ' ' + event.key + ' ';
            } else if (event.key === '=' || event.key === 'Enter') {
                doCalcs();
            } else if (event.key === 'Backspace') {
                deleteLastDispNumber();
            } else if (event.key === 'Delete') {
                emptyDisplay()
            } else if (event.key === ',' || event.key === '.') {
                dotButtonCheck();
            } else if (event.key === '_') {
                writePlusMinToDisplay();
            }
        }
    }
});


// This function prevents the user from writing two dots in one number. When a dot is already present in the current number, pushing the dot Button won't do anything.

function dotButtonCheck() {
    calcBefore();
    let displayArray = splitDisplay();
    if (displayArray[displayArray.length - 1].includes('.') || displayArray[displayArray.length - 1].includes('+') || 
    displayArray[displayArray.length - 1].includes('-') ||
    displayArray[displayArray.length - 1].includes('/') ||
    displayArray[displayArray.length - 1].includes('*')) {
        return;
    }
    displayCurrent.innerText = displayCurrent.innerText + dotButton.querySelectorAll('p')[0].innerText;
}

// This function prevents the display from overflow.
function displayToLong() {
    if (displayCurrent.innerText.length >= 15) {
        return true;
    }
    return false;
}

// This function checks if the calculator is currently on. If yes, pushing the on/off button will shut down the calculator. If not, the on/off button will start the calculator
function onOff() {
    if (!on) {
        on = true;
        display.className = 'displayOn';
        onOffBut.querySelectorAll('p')[0].innerText = 'Off';
    } else {
        on = false;
        displayCurrent.innerText = '';
        displayPrevious.innerText = '';
        display.className = 'displayOff';
        onOffBut.querySelectorAll('p')[0].innerText = 'On';
    }
}

//This function splits the display into an array
function splitDisplay() {
    return displayCurrent.innerText.split(' ');
}

//This function checks if the most recent action of the calculator was doing a calculation. If yes, the function will clear the display.
function calcBefore() {
    if (didCalcBefore) {
        displayCurrent.innerText = '';
        didCalcBefore = false;
    }
}

//This function deletes the last letter (number, operator) from the display
function deleteLastDispNumber() {
    calcBefore();
    let displayArray = splitDisplay();
    if (displayArray.length === 0) {
        return;
    }
    if (displayArray[displayArray.length-1] === 'NaN') {
        displayArray[displayArray.length-1] = '';
    } else {
        displayArray[displayArray.length - 1] = displayArray[displayArray.length - 1].substring(0,displayArray[displayArray.length -1].length - 1);
    }
    displayCurrent.innerText = '';
    for (num in displayArray) {
        displayCurrent.innerText = displayCurrent.innerText + ' ' + displayArray[num];
    }
    if (displayArray[displayArray.length -1] === '') {
        displayArray.pop();
        return;
    }
}
//This function writes a number to the display
function writeNumToDisplay(number) {
    if (on) {
        calcBefore();
        if (!displayToLong()) { 
            nanLast();
            displayCurrent.innerHTML += number;
        }
    }
}

//This function writes an operator to the display
function writeOperatorToDisplay(operator) {
    if (on) {
        didCalcBefore = false;
        if (!displayToLong()) {
            nanLast();
            displayCurrent.innerHTML += ' ' + operator + ' '; 
        }
    }
}

//This function checks if the last result of a calculation was a NaN and deletes it if yes.
function nanLast() {
    if (displayCurrent.innerText === 'NaN') {
        displayCurrent.innerText = '';
    } 
}

//This function writes a - in front of a digit if there is no. If there is - in front of a digit, the function will delete the -
function writePlusMinToDisplay() {
    if (on) {
        calcBefore();
        if (!displayToLong()) {
            nanLast();
            let displayArray = splitDisplay();
            if (displayArray[displayArray.length-1] === '+' ||      displayArray[displayArray.length-1] === '/' || displayArray[displayArray.length-1] === '*') {
                displayArray.push('-');
            }
            else if (displayArray[displayArray.length - 1].substring(0,1) === '-') {
                displayArray[displayArray.length - 1] = displayArray[displayArray.length -1].replace('-','');
            } else {
                displayArray[displayArray.length - 1] = '-' + displayArray[displayArray.length - 1];
            }
            displayCurrent.innerText = '';
            for (num in displayArray) {
                displayCurrent.innerText = displayCurrent.innerText + ' ' + displayArray[num];
        }
        }
    }
}

//This function empties the display
function emptyDisplay() {
    displayCurrent.innerText = '';
    displayPrevious.innerText = '';
}

//This function does all the calculations. It first checks if the input is mathematically correct. If yes it checks if there is some * or / as operators. If yes, it will do these first and the others after that. Finally it prints the result to the display.
function doCalcs() {
    if (on) {
    let displayArray = splitDisplay();
    if (displayArray.length%2 == 1) {
        let i = 1;
        while (displayArray.length > 1) {
            while (i < displayArray.length) {
                if (displayArray[i] === '/' || displayArray[i] === '*') 
                {
                    displayArray[i-1] = operate(displayArray[i], Number(displayArray[i-1]), Number(displayArray[i+1]));
                    displayArray = [...displayArray.slice(0,i),
                        ...displayArray.slice(i+2)];
                } else {
                    i = i + 2;
                }
            }
            if (displayArray.length > 1) {
                displayArray[0] = operate(displayArray[1],Number(displayArray[0]),Number(displayArray[2]));
                displayArray = [...displayArray.slice(0,1),
                    ...displayArray.slice(3)];
            }
        }
        displayPrevious.innerText = displayCurrent.innerText;
        displayCurrent.innerText = Number(parseFloat(displayArray[0]).toFixed(8));
        if (displayCurrent.innerText === 'Infinity') {
            displayCurrent.innerText = 'NaN';
        }
        } else {
            displayPrevious.innerText = displayCurrent.innerText;
            displayCurrent.innerText = 'NaN';
        }
        didCalcBefore = true;
    }
}

function add(a,b) {
    return a + b;
}

function substract(a,b) {
    return a - b;
}

function multiply(a,b) {
    return a * b;
}

function divide(a,b) {
        return a/b;
}

function operate(operator,num1,num2) {
    switch(operator) {
        case '+':
            return add(num1,num2);
        case '-':
            return substract(num1,num2);
        case '*':
            return multiply(num1,num2);
        case '/':
            return divide(num1,num2);
    }
} 
