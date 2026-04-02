const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function generateQuestion(topic, subject, weakAreas = [], difficulty = 2, askedQuestions = []) {
  try {
    if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not set');

    const weakContext = weakAreas.length > 0
      ? `Focus on these weak areas the student struggles with: ${weakAreas.join(', ')}.`
      : `Generate a difficulty ${difficulty}/5 question.`;

    const excludeContext = askedQuestions.length > 0
      ? `\nDo NOT ask any of these questions that were already asked:\n${askedQuestions.map((q, i) => `${i + 1}. "${q}"`).join('\n')}\nYour question MUST be completely different.`
      : '';

    // Random seed forces Gemini to generate differently each call
    const questionTypes = [
      'a definition question',
      'an application/scenario question',
      'a calculation or problem-solving question',
      'a compare-and-contrast question',
      'a cause-and-effect question',
      'a true understanding question that requires reasoning',
    ];
    const randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    const randomSeed = Math.random().toString(36).substring(7);

    const prompt = `You are a quiz generator. Seed: ${randomSeed}

Generate ONE unique multiple choice question.
Subject: ${subject}
Topic: ${topic}
Type: ${randomType}
${weakContext}${excludeContext}

STRICT RULES:
- Generate a BRAND NEW question not similar to any excluded ones
- Exactly 4 options labeled as plain text (no A. B. C. D. prefixes)
- Exactly one correct answer
- Answer must match one option EXACTLY character by character
- Keep question concise and clear

Return ONLY this JSON, absolutely no other text:
{"text":"your question","options":["opt1","opt2","opt3","opt4"],"answer":"exact correct option","explanation":"why this is correct","difficulty":${difficulty}}`;

    const result  = await model.generateContent(prompt);
    const raw     = result.response.text().trim();
    const clean   = raw.replace(/```json|```/g, '').trim();
    const start   = clean.indexOf('{');
    const end     = clean.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('No JSON found');

    const parsed  = JSON.parse(clean.slice(start, end + 1));

    if (!parsed.text || !Array.isArray(parsed.options) || !parsed.answer) {
      throw new Error('Invalid structure');
    }

    // Ensure answer exactly matches an option
    if (!parsed.options.includes(parsed.answer)) {
      const lower = parsed.answer.toLowerCase();
      const match = parsed.options.find(o => o.toLowerCase() === lower);
      parsed.answer = match || parsed.options[0];
    }

    // Check it's not a duplicate
    if (askedQuestions.some(q => q.toLowerCase().trim() === parsed.text.toLowerCase().trim())) {
      throw new Error('Duplicate detected, using fallback');
    }

    return parsed;

  } catch (err) {
    console.error('Gemini failed:', err.message);
    return getFallbackQuestion(topic, subject, difficulty, askedQuestions);
  }
}

function getFallbackQuestion(topic, subject, difficulty, askedQuestions = []) {
  const allFallbacks = {
    'Ancient History': [
      { text: "Which civilization built the pyramids of Giza?", options: ["Roman Empire","Ancient Egypt","Greek Empire","Mesopotamia"], answer: "Ancient Egypt", explanation: "Built by Ancient Egyptians around 2560 BCE." },
      { text: "Who was the first pharaoh of unified Egypt?", options: ["Cleopatra","Ramesses II","Narmer","Tutankhamun"], answer: "Narmer", explanation: "Narmer unified Upper and Lower Egypt around 3100 BCE." },
      { text: "What writing system did Ancient Egyptians use?", options: ["Cuneiform","Latin","Hieroglyphics","Sanskrit"], answer: "Hieroglyphics", explanation: "Egyptians used hieroglyphics, a system of pictorial symbols." },
      { text: "Which ancient wonder was located in Alexandria?", options: ["Colossus of Rhodes","Lighthouse of Alexandria","Hanging Gardens","Temple of Artemis"], answer: "Lighthouse of Alexandria", explanation: "The Lighthouse of Alexandria was one of the Seven Wonders of the Ancient World." },
    ],
    'World War II': [
      { text: "In which year did World War II end?", options: ["1943","1944","1945","1946"], answer: "1945", explanation: "WWII ended in 1945 with Germany surrendering in May and Japan in September." },
      { text: "Which event triggered the US entry into WWII?", options: ["D-Day","Pearl Harbor attack","Battle of Britain","Fall of France"], answer: "Pearl Harbor attack", explanation: "Japan's attack on Pearl Harbor on Dec 7, 1941 brought the US into the war." },
      { text: "What was the code name for the D-Day invasion?", options: ["Operation Overlord","Operation Barbarossa","Operation Sea Lion","Operation Market Garden"], answer: "Operation Overlord", explanation: "Operation Overlord was the codename for the Allied invasion of Normandy on June 6, 1944." },
      { text: "Which country was NOT part of the Allied Powers?", options: ["USA","USSR","Italy","UK"], answer: "Italy", explanation: "Italy was initially part of the Axis Powers before switching sides in 1943." },
    ],
    'Indian History': [
      { text: "In which year did India gain independence?", options: ["1945","1947","1950","1952"], answer: "1947", explanation: "India gained independence from British rule on August 15, 1947." },
      { text: "Who is known as the Father of the Indian Nation?", options: ["Nehru","Ambedkar","Bose","Gandhi"], answer: "Gandhi", explanation: "Mahatma Gandhi led India's independence movement through nonviolent resistance." },
      { text: "When did the Indian Constitution come into effect?", options: ["1947","1948","1950","1952"], answer: "1950", explanation: "The Constitution of India came into effect on January 26, 1950." },
      { text: "Which movement did Gandhi launch in 1942?", options: ["Non-Cooperation","Quit India","Swadeshi","Civil Disobedience"], answer: "Quit India", explanation: "Gandhi launched the Quit India Movement in August 1942 demanding end of British rule." },
    ],
    'Physics': [
      { text: "What is the unit of force in the SI system?", options: ["Watt","Joule","Newton","Pascal"], answer: "Newton", explanation: "The Newton (N) is the SI unit of force." },
      { text: "What is the speed of light in a vacuum?", options: ["3×10⁶ m/s","3×10⁸ m/s","3×10¹⁰ m/s","3×10⁴ m/s"], answer: "3×10⁸ m/s", explanation: "Light travels at approximately 3×10⁸ m/s in a vacuum." },
      { text: "Which law states F = ma?", options: ["Newton's First Law","Newton's Second Law","Newton's Third Law","Law of Gravitation"], answer: "Newton's Second Law", explanation: "Newton's Second Law states that Force equals mass times acceleration." },
      { text: "What type of energy does a moving object have?", options: ["Potential energy","Thermal energy","Kinetic energy","Chemical energy"], answer: "Kinetic energy", explanation: "A moving object possesses kinetic energy due to its motion." },
    ],
    'Chemistry': [
      { text: "What is the chemical symbol for water?", options: ["HO","H2O","OH2","H2O2"], answer: "H2O", explanation: "Water consists of two hydrogen atoms bonded to one oxygen atom." },
      { text: "What is the atomic number of carbon?", options: ["4","6","8","12"], answer: "6", explanation: "Carbon has 6 protons, giving it atomic number 6." },
      { text: "Which gas makes up most of Earth's atmosphere?", options: ["Oxygen","Carbon dioxide","Nitrogen","Argon"], answer: "Nitrogen", explanation: "Nitrogen makes up about 78% of Earth's atmosphere." },
      { text: "What is the pH of a neutral solution?", options: ["0","5","7","14"], answer: "7", explanation: "A neutral solution has a pH of 7, neither acidic nor basic." },
    ],
    'Biology': [
      { text: "What is the powerhouse of the cell?", options: ["Nucleus","Ribosome","Mitochondria","Golgi body"], answer: "Mitochondria", explanation: "Mitochondria produce ATP through cellular respiration." },
      { text: "What is the basic unit of life?", options: ["Tissue","Organ","Cell","Molecule"], answer: "Cell", explanation: "The cell is the fundamental unit of all living organisms." },
      { text: "Which molecule carries genetic information?", options: ["RNA","ATP","DNA","Protein"], answer: "DNA", explanation: "DNA (deoxyribonucleic acid) carries the genetic blueprint of living organisms." },
      { text: "What process do plants use to make food?", options: ["Respiration","Photosynthesis","Digestion","Fermentation"], answer: "Photosynthesis", explanation: "Plants use photosynthesis to convert sunlight into glucose." },
    ],
    'Algebra': [
      { text: "Solve: 2x + 4 = 10", options: ["x=2","x=3","x=4","x=5"], answer: "x=3", explanation: "2x = 6, so x = 3." },
      { text: "Simplify: 3x + 5x", options: ["8","8x","15x","8x²"], answer: "8x", explanation: "Like terms: 3x + 5x = 8x." },
      { text: "What is the slope of y = 3x + 2?", options: ["2","3","5","1"], answer: "3", explanation: "In y = mx + b, m is the slope. Here m = 3." },
      { text: "Solve: x² = 16", options: ["x=4","x=±4","x=8","x=±8"], answer: "x=±4", explanation: "x² = 16 gives x = +4 or x = -4." },
    ],
    'Data Structures': [
      { text: "Which data structure uses LIFO order?", options: ["Queue","Stack","Array","Linked List"], answer: "Stack", explanation: "A Stack uses Last In First Out (LIFO) ordering." },
      { text: "What is the time complexity of accessing an array element by index?", options: ["O(n)","O(log n)","O(1)","O(n²)"], answer: "O(1)", explanation: "Array index access is O(1) — direct memory addressing." },
      { text: "Which data structure is best for breadth-first search?", options: ["Stack","Queue","Tree","Graph"], answer: "Queue", explanation: "BFS uses a Queue (FIFO) to explore nodes level by level." },
      { text: "What is a linked list node composed of?", options: ["Just data","Just a pointer","Data and a pointer","Key and value"], answer: "Data and a pointer", explanation: "Each linked list node stores data and a pointer to the next node." },
    ],
    'Algorithms': [
      { text: "What is the time complexity of binary search?", options: ["O(n)","O(n²)","O(log n)","O(1)"], answer: "O(log n)", explanation: "Binary search halves the search space each step." },
      { text: "Which sorting algorithm has O(n log n) average time complexity?", options: ["Bubble Sort","Selection Sort","Merge Sort","Insertion Sort"], answer: "Merge Sort", explanation: "Merge Sort consistently achieves O(n log n) time complexity." },
      { text: "What does a greedy algorithm do?", options: ["Tries all possibilities","Makes locally optimal choices","Uses dynamic programming","Backtracks always"], answer: "Makes locally optimal choices", explanation: "Greedy algorithms pick the best option at each step hoping for a global optimum." },
      { text: "Which algorithm is used to find the shortest path in a graph?", options: ["DFS","BFS","Dijkstra's","Quick Sort"], answer: "Dijkstra's", explanation: "Dijkstra's algorithm finds the shortest path between nodes in a weighted graph." },
    ],
  };

  const topicFallbacks = allFallbacks[topic];
  if (topicFallbacks) {
    // Pick one that hasn't been asked yet
    const unused = topicFallbacks.filter(q =>
      !askedQuestions.some(asked => asked.toLowerCase().trim() === q.text.toLowerCase().trim())
    );
    const pool = unused.length > 0 ? unused : topicFallbacks;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    return { ...picked, difficulty };
  }

  // Generic fallback
  const genericPool = [
    { text: `What is the most important concept in ${topic}?`, options: [`Theoretical foundations of ${topic}`, `Practical applications of ${topic}`, `History of ${topic}`, `Future of ${topic}`], answer: `Practical applications of ${topic}`, explanation: `${topic} is most valued for its real-world applications in ${subject}.` },
    { text: `How does ${topic} relate to ${subject}?`, options: [`It is unrelated`, `It is a core component`, `It is optional`, `It contradicts ${subject}`], answer: `It is a core component`, explanation: `${topic} is a fundamental part of ${subject}.` },
  ];
  const unused = genericPool.filter(q =>
    !askedQuestions.some(asked => asked.toLowerCase().trim() === q.text.toLowerCase().trim())
  );
  const pool = unused.length > 0 ? unused : genericPool;
  return { ...pool[Math.floor(Math.random() * pool.length)], difficulty };
}

module.exports = { generateQuestion };