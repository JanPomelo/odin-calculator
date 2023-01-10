let buttonRows = [...document.querySelectorAll('.buttonRow')];

let buttons = buttonRows.reduce((button,buttonRow) => {
    return [...button,
        ...buttonRow.querySelectorAll('div')]
},[])

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