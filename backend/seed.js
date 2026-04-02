require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');

const questions = [
  // ── Algebra ──
  { topic: 'Algebra', difficulty: 1, text: 'Solve: x + 5 = 12', options: ['x=5','x=6','x=7','x=8'], answer: 'x=7' },
  { topic: 'Algebra', difficulty: 1, text: 'Solve: 2x = 14', options: ['x=5','x=6','x=7','x=8'], answer: 'x=7' },
  { topic: 'Algebra', difficulty: 1, text: 'Solve: x - 3 = 9', options: ['x=10','x=11','x=12','x=13'], answer: 'x=12' },
  { topic: 'Algebra', difficulty: 1, text: 'Simplify: 3x + 2x', options: ['5x','6x','5x²','x'], answer: '5x' },
  { topic: 'Algebra', difficulty: 2, text: 'Solve: 2x + 3 = 11', options: ['x=3','x=4','x=5','x=6'], answer: 'x=4' },
  { topic: 'Algebra', difficulty: 2, text: 'Solve: 3x - 7 = 8', options: ['x=3','x=4','x=5','x=6'], answer: 'x=5' },
  { topic: 'Algebra', difficulty: 2, text: 'Expand: (x + 2)(x + 3)', options: ['x²+5x+6','x²+6x+5','x²+5x+5','x²+6x+6'], answer: 'x²+5x+6' },
  { topic: 'Algebra', difficulty: 2, text: 'Factorise: x² + 5x + 6', options: ['(x+2)(x+3)','(x+1)(x+6)','(x+2)(x+4)','(x+3)(x+3)'], answer: '(x+2)(x+3)' },
  { topic: 'Algebra', difficulty: 3, text: 'Solve: x² - 5x + 6 = 0', options: ['x=2,3','x=1,6','x=2,4','x=3,4'], answer: 'x=2,3' },
  { topic: 'Algebra', difficulty: 3, text: 'Solve: 2x² - 8 = 0', options: ['x=2','x=±2','x=4','x=±4'], answer: 'x=±2' },
  { topic: 'Algebra', difficulty: 4, text: 'Solve: x² + x - 12 = 0', options: ['x=3,-4','x=-3,4','x=2,-6','x=4,-3'], answer: 'x=3,-4' },
  { topic: 'Algebra', difficulty: 4, text: 'If f(x) = 2x² - 3x + 1, find f(2)', options: ['3','4','5','6'], answer: '3' },

  // ── Geometry ──
  { topic: 'Geometry', difficulty: 1, text: 'Area of a rectangle with length 5 and width 3?', options: ['8','12','15','20'], answer: '15' },
  { topic: 'Geometry', difficulty: 1, text: 'Perimeter of a square with side 4?', options: ['8','12','16','20'], answer: '16' },
  { topic: 'Geometry', difficulty: 1, text: 'How many degrees in a right angle?', options: ['45','60','90','180'], answer: '90' },
  { topic: 'Geometry', difficulty: 1, text: 'How many sides does a hexagon have?', options: ['5','6','7','8'], answer: '6' },
  { topic: 'Geometry', difficulty: 2, text: 'Area of a triangle with base 6 and height 4?', options: ['10','12','24','8'], answer: '12' },
  { topic: 'Geometry', difficulty: 2, text: 'Area of a circle with radius 7? (use π≈3.14)', options: ['43.96','49','153.86','21.98'], answer: '153.86' },
  { topic: 'Geometry', difficulty: 2, text: 'What is the sum of angles in a triangle?', options: ['90°','180°','270°','360°'], answer: '180°' },
  { topic: 'Geometry', difficulty: 2, text: 'Circumference of a circle with diameter 10? (π≈3.14)', options: ['31.4','15.7','62.8','10π'], answer: '31.4' },
  { topic: 'Geometry', difficulty: 3, text: 'In a right triangle, legs are 3 and 4. Find the hypotenuse.', options: ['5','6','7','8'], answer: '5' },
  { topic: 'Geometry', difficulty: 3, text: 'Volume of a cube with side 3?', options: ['9','18','27','81'], answer: '27' },
  { topic: 'Geometry', difficulty: 3, text: 'Surface area of a cube with side 4?', options: ['64','96','48','16'], answer: '96' },
  { topic: 'Geometry', difficulty: 4, text: 'Two angles of a triangle are 55° and 75°. Find the third.', options: ['40°','50°','60°','70°'], answer: '50°' },
  { topic: 'Geometry', difficulty: 4, text: 'Volume of a cylinder with r=3 and h=5? (π≈3.14)', options: ['141.3','47.1','94.2','188.4'], answer: '141.3' },

  // ── Trigonometry ──
  { topic: 'Trigonometry', difficulty: 1, text: 'sin(30°) = ?', options: ['0.5','0.866','1','0'], answer: '0.5' },
  { topic: 'Trigonometry', difficulty: 1, text: 'cos(0°) = ?', options: ['0','0.5','1','-1'], answer: '1' },
  { topic: 'Trigonometry', difficulty: 1, text: 'tan(45°) = ?', options: ['0','0.5','1','√2'], answer: '1' },
  { topic: 'Trigonometry', difficulty: 1, text: 'sin(90°) = ?', options: ['0','0.5','0.866','1'], answer: '1' },
  { topic: 'Trigonometry', difficulty: 2, text: 'cos(60°) = ?', options: ['0.5','0.866','1','0'], answer: '0.5' },
  { topic: 'Trigonometry', difficulty: 2, text: 'sin(45°) = ?', options: ['0.5','1/√2','√3/2','1'], answer: '1/√2' },
  { topic: 'Trigonometry', difficulty: 2, text: 'What is tan(θ) in terms of sin and cos?', options: ['sin/cos','cos/sin','sin×cos','1/sin'], answer: 'sin/cos' },
  { topic: 'Trigonometry', difficulty: 3, text: 'If sin(θ) = 0.6, find cos(θ).', options: ['0.4','0.6','0.8','1'], answer: '0.8' },
  { topic: 'Trigonometry', difficulty: 3, text: 'sin²(θ) + cos²(θ) = ?', options: ['0','0.5','1','2'], answer: '1' },
  { topic: 'Trigonometry', difficulty: 3, text: 'In a right triangle, opposite=4, hypotenuse=5. Find sin(θ).', options: ['0.6','0.7','0.8','0.9'], answer: '0.8' },
  { topic: 'Trigonometry', difficulty: 4, text: 'cos(2θ) = ?', options: ['2cos²θ-1','1-2sin²θ','cos²θ-sin²θ','All of these'], answer: 'All of these' },
  { topic: 'Trigonometry', difficulty: 4, text: 'What is the period of sin(x)?', options: ['π','2π','π/2','4π'], answer: '2π' },

  // ── Calculus ──
  { topic: 'Calculus', difficulty: 1, text: 'What is the derivative of a constant?', options: ['1','0','The constant itself','Undefined'], answer: '0' },
  { topic: 'Calculus', difficulty: 1, text: 'Derivative of x?', options: ['x','1','0','2x'], answer: '1' },
  { topic: 'Calculus', difficulty: 2, text: 'Derivative of x²?', options: ['x','2x','2','x²'], answer: '2x' },
  { topic: 'Calculus', difficulty: 2, text: 'Derivative of x³?', options: ['3x','3x²','x²','2x³'], answer: '3x²' },
  { topic: 'Calculus', difficulty: 2, text: 'What is lim(x→0) of sin(x)/x?', options: ['0','1','∞','Undefined'], answer: '1' },
  { topic: 'Calculus', difficulty: 3, text: 'Derivative of sin(x)?', options: ['cos(x)','-cos(x)','sin(x)','-sin(x)'], answer: 'cos(x)' },
  { topic: 'Calculus', difficulty: 3, text: 'Derivative of e^x?', options: ['e^x','xe^x','e^(x-1)','1'], answer: 'e^x' },
  { topic: 'Calculus', difficulty: 3, text: '∫2x dx = ?', options: ['x²+C','2x²+C','x+C','2+C'], answer: 'x²+C' },
  { topic: 'Calculus', difficulty: 4, text: 'Derivative of ln(x)?', options: ['1/x','ln(x)','x','e^x'], answer: '1/x' },
  { topic: 'Calculus', difficulty: 4, text: '∫sin(x) dx = ?', options: ['cos(x)+C','-cos(x)+C','sin(x)+C','-sin(x)+C'], answer: '-cos(x)+C' },

  // ── Statistics ──
  { topic: 'Statistics', difficulty: 1, text: 'Mean of [2, 4, 6]?', options: ['3','4','5','6'], answer: '4' },
  { topic: 'Statistics', difficulty: 1, text: 'Median of [1, 3, 5, 7, 9]?', options: ['3','4','5','6'], answer: '5' },
  { topic: 'Statistics', difficulty: 1, text: 'Mode of [1, 2, 2, 3, 4]?', options: ['1','2','3','4'], answer: '2' },
  { topic: 'Statistics', difficulty: 2, text: 'Mean of [2, 4, 6, 8, 10]?', options: ['5','6','7','8'], answer: '6' },
  { topic: 'Statistics', difficulty: 2, text: 'Probability of rolling a 4 on a fair die?', options: ['1/2','1/3','1/4','1/6'], answer: '1/6' },
  { topic: 'Statistics', difficulty: 2, text: 'Probability of flipping heads on a fair coin?', options: ['1/4','1/3','1/2','1'], answer: '1/2' },
  { topic: 'Statistics', difficulty: 3, text: 'Range of [3, 7, 2, 9, 1]?', options: ['6','7','8','9'], answer: '8' },
  { topic: 'Statistics', difficulty: 3, text: 'If P(A) = 0.3, what is P(not A)?', options: ['0.3','0.5','0.7','1'], answer: '0.7' },
  { topic: 'Statistics', difficulty: 3, text: 'Standard deviation measures what?', options: ['Average value','Spread of data','Most common value','Middle value'], answer: 'Spread of data' },
  { topic: 'Statistics', difficulty: 4, text: 'P(A and B) where A and B are independent, P(A)=0.4, P(B)=0.5?', options: ['0.1','0.2','0.45','0.9'], answer: '0.2' },
  { topic: 'Statistics', difficulty: 4, text: 'In a normal distribution, ~68% of data falls within how many standard deviations?', options: ['1','2','3','4'], answer: '1' },
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Question.deleteMany({});   // clear old questions first
  await Question.insertMany(questions);
  console.log(`Seeded ${questions.length} questions successfully!`);
  process.exit();
});