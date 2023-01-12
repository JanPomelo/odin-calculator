let displayCurrent = document.getElementById('currentNum');
let displayPrevious = document.getElementById('prevResult');
let buttonRows = [...document.getElementsByClassName('buttonRow')];
let plusMinus = document.getElementById('specialBut');

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
plusMinus.addEventListener('click',writePlusMinToDisplay);

function splitDisplay() {
    return displayCurrent.innerText.split(' ');
}

function writeNumToDisplay(number) {
    displayCurrent.innerHTML += number;
}

function writeOperatorToDisplay(operator) {
    displayCurrent.innerHTML += ' ' + operator + ' '; 
}

function writePlusMinToDisplay() {
    let displayArray = splitDisplay();
    if (displayArray[displayArray.length - 1].substring(0,1) === '-') {
        displayArray[displayArray.length - 1] = displayArray[displayArray.length -1].replace('-','');
    } else {
        displayArray[displayArray.length - 1] = '-' + displayArray[displayArray.length - 1];
    }
    displayCurrent.innerText = '';
    for (num in displayArray) {
        displayCurrent.innerText = displayCurrent.innerText + ' ' + displayArray[num];
    }
}

function doCalcs() {
    let displayArray = splitDisplay();
    displayPrevious.innerText = displayCurrent.innerText;
    displayCurrent.innerText = operate(displayArray[1],Number(displayArray[0]),Number(displayArray[2]));
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