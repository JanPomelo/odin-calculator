let displayCurrent = document.getElementById('currentNum');
let displayPrevious = document.getElementById('prevResult');
let display = document.getElementById('display');
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

let displayLength = 17;

let operatorButtons = buttons.reduce((opButs,button) => {
    if(button.className === 'operatorBut') {
        return [...opButs,
        button];
    } else {
        return opButs;
    }
},[]); 

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

let resultButton = document.getElementById('resultBut');
resultButton.addEventListener('click',function() {
    doCalcs()
});
let plusMinus = document.getElementById('specialBut');
plusMinus.addEventListener('click',writePlusMinToDisplay);

let acButton = document.getElementById('acBut');
acButton.addEventListener('click',emptyDisplay);

let deleteButton = document.getElementById('deleteBut');
deleteButton.addEventListener('click',deleteLastDispNumber);

let onOffBut = document.getElementById('OnOffBut');
onOffBut.addEventListener('click',onOff);

let dotButton = document.getElementById('dotButton');
dotButton.addEventListener('click',dotButtonCheck);

let on = false;

let didCalcBefore = false;

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

function displayToLong() {
    if (displayCurrent.innerText.length >= 20) {
        return true;
    }
    return false;
}

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

function splitDisplay() {
    return displayCurrent.innerText.split(' ');
}

function calcBefore() {
    if (didCalcBefore) {
        displayCurrent.innerText = '';
        didCalcBefore = false;
    }
}

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

function writeNumToDisplay(number) {
    if (on) {
        calcBefore();
        if (!displayToLong()) { 
            nanLast();
            displayCurrent.innerHTML += number;
        }
    }
}

function writeOperatorToDisplay(operator) {
    if (on) {
        didCalcBefore = false;
        if (!displayToLong()) {
            nanLast();
            displayCurrent.innerHTML += ' ' + operator + ' '; 
        }
    }
}

function nanLast() {
    if (displayCurrent.innerText === 'NaN') {
        displayCurrent.innerText = '';
    } 
}

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

function emptyDisplay() {
    displayCurrent.innerText = '';
    displayPrevious.innerText = '';
}

function doCalcs() {
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
        displayCurrent.innerText = displayArray[0];
        if (displayCurrent.innerText === 'Infinity') {
            displayCurrent.innerText = 'NaN';
        }
    } else {
        displayPrevious.innerText = displayCurrent.innerText;
        displayCurrent.innerText = 'NaN';
    }
    didCalcBefore = true;
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
const normalKeys = ['1','2','3','4','5','6','7','8','9','0'];
const operatorKeys = ['-','+','/','+'];

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