class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') {
            this.currentOperand = '0';
        }
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }

        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.formatNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = 
                `${this.formatNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }

    formatNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }
}

const numberButtons = document.querySelectorAll('[data-action="number"]');
const operationButtons = document.querySelectorAll('.operator:not([data-action="clear"]):not([data-action="delete"]):not([data-action="percent"])');
const equalsButton = document.querySelector('[data-action="calculate"]');
const deleteButton = document.querySelector('[data-action="delete"]');
const allClearButton = document.querySelector('[data-action="clear"]');
const decimalButton = document.querySelector('[data-action="decimal"]');
const percentButton = document.querySelector('[data-action="percent"]');
const previousOperandTextElement = document.querySelector('.previous-operand');
const currentOperandTextElement = document.querySelector('.current-operand');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

allClearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

decimalButton.addEventListener('click', () => {
    calculator.appendNumber('.');
    calculator.updateDisplay();
});

percentButton.addEventListener('click', () => {
    calculator.chooseOperation('%');
    calculator.updateDisplay();
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= 0 && e.key <= 9) {
        calculator.appendNumber(e.key);
        calculator.updateDisplay();
    } else if (e.key === '.') {
        calculator.appendNumber('.');
        calculator.updateDisplay();
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        let operation;
        if (e.key === '*') operation = '×';
        else if (e.key === '/') operation = '÷';
        else operation = e.key;
        calculator.chooseOperation(operation);
        calculator.updateDisplay();
    } else if (e.key === 'Enter' || e.key === '=') {
        calculator.compute();
        calculator.updateDisplay();
    } else if (e.key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
    } else if (e.key === 'Escape') {
        calculator.clear();
        calculator.updateDisplay();
    } else if (e.key === '%') {
        calculator.chooseOperation('%');
        calculator.updateDisplay();
    }
});