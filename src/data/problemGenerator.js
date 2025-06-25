// Problem generator for the 80 in 8 challenge
// Generates problems based on specific techniques and difficulty levels

export class ProblemGenerator {
  constructor() {
    this.operations = ['+', '-', '×', '÷'];
  }
  
  // Generate a random number in range
  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  // Generate addition problems based on technique
  generateAddition(technique = 'standard', difficulty = 1) {
    let a, b;
    
    switch(technique) {
      case 'no-carry':
        // Generate numbers that won't require carrying
        if (difficulty === 1) {
          a = this.random(10, 40) * 10 + this.random(1, 4);
          b = this.random(10, 40) * 10 + this.random(1, 5);
        } else {
          a = this.random(100, 400) * 10 + this.random(1, 4);
          b = this.random(100, 400) * 10 + this.random(1, 5);
        }
        break;
        
      case 'subtraction-trick':
        // Generate problems where b is close to a round number
        const roundNumbers = [100, 200, 300, 400, 500];
        const round = roundNumbers[this.random(0, roundNumbers.length - 1)];
        a = this.random(50, 450);
        b = round - this.random(1, 4); // 96-99, 196-199, etc.
        break;
        
      default:
        // Standard addition
        if (difficulty === 1) {
          a = this.random(10, 99);
          b = this.random(10, 99);
        } else if (difficulty === 2) {
          a = this.random(100, 499);
          b = this.random(100, 499);
        } else {
          a = this.random(100, 999);
          b = this.random(100, 999);
        }
    }
    
    return { 
      question: `${a} + ${b}`, 
      answer: a + b,
      operation: '+',
      technique,
      difficulty 
    };
  }
  
  // Generate subtraction problems based on technique
  generateSubtraction(technique = 'standard', difficulty = 1) {
    let a, b;
    
    switch(technique) {
      case 'complement':
        // Subtract from 100 or 1000
        if (difficulty === 1) {
          a = 100;
          b = this.random(10, 99);
        } else {
          a = 1000;
          b = this.random(100, 999);
        }
        break;
        
      case 'addition-trick':
        // Generate problems where b is close to a round number
        const roundNumbers = [100, 200, 300];
        const round = roundNumbers[this.random(0, roundNumbers.length - 1)];
        a = this.random(round + 20, round + 200);
        b = round - this.random(1, 4);
        break;
        
      case 'make-change':
        // Generate money problems
        const amounts = [10, 20, 50, 100];
        a = amounts[this.random(0, amounts.length - 1)];
        b = this.random(Math.floor(a * 0.1), Math.floor(a * 0.9));
        return {
          question: `Change from $${a} for $${b}`,
          answer: a - b,
          operation: '-',
          technique,
          difficulty
        };
        
      default:
        // Standard subtraction
        if (difficulty === 1) {
          a = this.random(20, 99);
          b = this.random(10, a - 10);
        } else if (difficulty === 2) {
          a = this.random(100, 499);
          b = this.random(50, 299);
        } else {
          a = this.random(200, 999);
          b = this.random(100, 499);
        }
    }
    
    return { 
      question: `${a} - ${b}`, 
      answer: a - b,
      operation: '-',
      technique,
      difficulty 
    };
  }
  
  // Generate multiplication problems based on technique
  generateMultiplication(technique = 'standard', difficulty = 1) {
    let a, b;
    
    switch(technique) {
      case '2by1':
        // 2-digit × 1-digit
        a = this.random(11, 99);
        b = this.random(2, 9);
        break;
        
      case '3by1':
        // 3-digit × 1-digit
        a = this.random(101, 999);
        b = this.random(2, 9);
        break;
        
      case 'squares':
        // Squaring numbers
        if (difficulty === 1) {
          a = this.random(11, 30);
        } else if (difficulty === 2) {
          a = this.random(31, 50);
        } else {
          a = this.random(51, 99);
        }
        b = a;
        break;
        
      case '2by2':
        // 2-digit × 2-digit
        a = this.random(11, 99);
        b = this.random(11, 99);
        break;
        
      default:
        // Standard multiplication
        if (difficulty === 1) {
          a = this.random(2, 19);
          b = this.random(2, 9);
        } else if (difficulty === 2) {
          a = this.random(11, 49);
          b = this.random(2, 19);
        } else {
          a = this.random(21, 99);
          b = this.random(11, 29);
        }
    }
    
    return { 
      question: `${a} × ${b}`, 
      answer: a * b,
      operation: '×',
      technique,
      difficulty 
    };
  }
  
  // Generate division problem (ensures whole number results)
  generateDivision(difficulty = 1) {
    let answer, divisor, dividend;
    if (difficulty === 1) {
      answer = this.random(2, 19);
      divisor = this.random(2, 9);
    } else if (difficulty === 2) {
      answer = this.random(5, 29);
      divisor = this.random(3, 12);
    } else {
      answer = this.random(10, 49);
      divisor = this.random(4, 19);
    }
    dividend = answer * divisor;    return { 
      question: `${dividend} ÷ ${divisor}`, 
      answer: answer,
      operation: '÷',
      difficulty 
    };
  }
  
  // Generate a random problem based on type
  generateProblem(type = 'mixed', difficulty = 1) {
    if (type === 'mixed') {
      const operation = this.operations[this.random(0, 3)];
      type = operation;
    }
    
    switch(type) {
      case '+': return this.generateAddition('standard', difficulty);
      case '-': return this.generateSubtraction('standard', difficulty);
      case '×': return this.generateMultiplication('standard', difficulty);
      case '÷': return this.generateDivision('standard', difficulty);
      default: return this.generateAddition('standard', difficulty);
    }
  }
  
  // Generate a set of problems for practice
  generatePracticeSet(count = 20, type = 'mixed', difficulty = 1) {
    const problems = [];
    for (let i = 0; i < count; i++) {
      problems.push(this.generateProblem(type, difficulty));
    }
    return problems;
  }
  
  // Generate a mock test (80 problems, mixed difficulty)
  generateMockTest() {
    const problems = [];
    // 25% easy, 50% medium, 25% hard
    for (let i = 0; i < 20; i++) {
      problems.push(this.generateProblem('mixed', 1));
    }
    for (let i = 0; i < 40; i++) {
      problems.push(this.generateProblem('mixed', 2));
    }
    for (let i = 0; i < 20; i++) {
      problems.push(this.generateProblem('mixed', 3));
    }
    // Shuffle the problems
    return problems.sort(() => Math.random() - 0.5);
  }
}

export const problemGenerator = new ProblemGenerator();