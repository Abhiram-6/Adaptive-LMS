const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const QUESTION_TYPES = [
  'a definition or concept question',
  'an application or real-world scenario question',
  'a calculation or problem-solving question',
  'a compare and contrast question',
  'a cause and effect question',
  'a true understanding question requiring reasoning',
  'a fill-in-the-blank style question',
  'a "which of the following" analytical question',
];

async function generateQuestion(topic, subject, weakAreas = [], difficulty = 2, askedQuestions = []) {
  try {
    if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY not set in .env');

    const weakContext = weakAreas.length > 0
      ? `The student has been struggling with: ${weakAreas.join(', ')}. Target one of these weak areas.`
      : `Generate a difficulty ${difficulty}/5 question.`;

    const excludeContext = askedQuestions.length > 0
      ? `\nDo NOT repeat any of these already asked questions:\n${askedQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`
      : '';

    const questionType = QUESTION_TYPES[Math.floor(Math.random() * QUESTION_TYPES.length)];

    const prompt = `You are an expert educational quiz generator.

Generate ONE unique multiple choice question:
- Subject: ${subject}
- Topic: ${topic}
- Type: ${questionType}
- Difficulty: ${difficulty}/5 (1=beginner, 5=expert)
- ${weakContext}${excludeContext}

STRICT RULES:
1. Question must be factually accurate
2. Provide exactly 4 answer options
3. Only ONE option is correct
4. The "answer" field must be copied EXACTLY from the options array
5. Do not number the options
6. Explanation must be clear and educational

Return ONLY this JSON, no markdown, no extra text:
{"text":"question here","options":["opt1","opt2","opt3","opt4"],"answer":"exact correct option","explanation":"why this is correct","difficulty":${difficulty}}`;

    const completion = await groq.chat.completions.create({
      model:       'llama-3.1-8b-instant',
      temperature: 0.8,
      max_tokens:  500,
      messages: [
        {
          role:    'system',
          content: 'You are an expert quiz generator. Always respond with valid JSON only. Never add markdown or extra text.'
        },
        {
          role:    'user',
          content: prompt
        }
      ]
    });

    const raw    = completion.choices[0].message.content.trim();
    const clean  = raw.replace(/```json|```/g, '').trim();
    const start  = clean.indexOf('{');
    const end    = clean.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('No JSON found in response');

    const parsed = JSON.parse(clean.slice(start, end + 1));

    if (!parsed.text || !Array.isArray(parsed.options) || parsed.options.length < 2 || !parsed.answer) {
      throw new Error('Invalid question structure from Groq');
    }

    if (!parsed.options.includes(parsed.answer)) {
      const lower = parsed.answer.toLowerCase().trim();
      const match = parsed.options.find(o => o.toLowerCase().trim() === lower);
      parsed.answer = match || parsed.options[0];
    }

    const isDuplicate = askedQuestions.some(
      q => q.toLowerCase().trim() === parsed.text.toLowerCase().trim()
    );
    if (isDuplicate) throw new Error('Duplicate detected, using fallback');

    console.log(`✅ Groq generated: "${parsed.text.slice(0, 60)}..."`);
    return parsed;

  } catch (err) {
    console.error('❌ Groq failed:', err.message);
    return getFallbackQuestion(topic, subject, difficulty, askedQuestions);
  }
}

function getFallbackQuestion(topic, subject, difficulty, askedQuestions = []) {
  const allFallbacks = {
    'Algebra': [
      { text:'Solve: 2x + 6 = 14', options:['x=3','x=4','x=5','x=6'], answer:'x=4', explanation:'2x=8, x=4' },
      { text:'What is the slope of y = 5x + 3?', options:['3','4','5','6'], answer:'5', explanation:'In y=mx+b, m is the slope' },
      { text:'Expand: (x+4)(x+2)', options:['x²+6x+8','x²+8x+6','x²+6x+6','x²+8x+8'], answer:'x²+6x+8', explanation:'FOIL: x²+2x+4x+8=x²+6x+8' },
      { text:'Factorise: x²+6x+9', options:['(x+3)²','(x+9)(x+1)','(x+3)(x-3)','(x+6)(x+3)'], answer:'(x+3)²', explanation:'Perfect square: (x+3)²' },
    ],
    'Geometry': [
      { text:'Area of triangle: base=10, height=6', options:['16','30','60','100'], answer:'30', explanation:'Area=½×10×6=30' },
      { text:'Volume of cube with side 5', options:['15','25','75','125'], answer:'125', explanation:'V=5³=125' },
      { text:'Sum of exterior angles of any polygon?', options:['180°','270°','360°','540°'], answer:'360°', explanation:'Always 360° for any convex polygon' },
      { text:'Circumference of circle with radius 4 (π≈3.14)', options:['12.56','25.12','50.24','6.28'], answer:'25.12', explanation:'C=2πr=2×3.14×4=25.12' },
    ],
    'Physics': [
      { text:'A 4kg object accelerates at 5m/s². What is the force?', options:['1.25N','9N','20N','40N'], answer:'20N', explanation:'F=ma=4×5=20N' },
      { text:'Unit of electrical resistance?', options:['Ampere','Volt','Ohm','Watt'], answer:'Ohm', explanation:'Resistance is measured in Ohms (Ω)' },
      { text:'Energy stored in a stretched spring?', options:['Kinetic','Thermal','Elastic potential','Chemical'], answer:'Elastic potential', explanation:'Stretched spring stores elastic potential energy' },
      { text:'Formula for power?', options:['P=Fd','P=W/t','P=mv','P=ma'], answer:'P=W/t', explanation:'Power = Work / Time' },
    ],
    'Chemistry': [
      { text:'Valency of Carbon?', options:['2','3','4','6'], answer:'4', explanation:'Carbon has 4 valence electrons' },
      { text:'Gas produced when acid reacts with metal?', options:['Oxygen','Hydrogen','Nitrogen','Carbon dioxide'], answer:'Hydrogen', explanation:'Acid + Metal → Salt + Hydrogen gas' },
      { text:'Which is a noble gas?', options:['Oxygen','Nitrogen','Argon','Fluorine'], answer:'Argon', explanation:'Argon (Ar) is a noble gas in Group 18' },
      { text:'Charge of a proton?', options:['-1','0','+1','+2'], answer:'+1', explanation:'Protons carry +1 charge' },
    ],
    'Biology': [
      { text:'Function of the cell membrane?', options:['Energy production','Controls what enters/exits cell','Protein synthesis','Cell division'], answer:'Controls what enters/exits cell', explanation:'Cell membrane is a selectively permeable barrier' },
      { text:'Where is insulin produced?', options:['Liver','Kidney','Pancreas','Stomach'], answer:'Pancreas', explanation:'Insulin is produced by beta cells in the pancreas' },
      { text:'Which vitamin comes from sunlight?', options:['Vitamin A','Vitamin B','Vitamin C','Vitamin D'], answer:'Vitamin D', explanation:'Skin synthesizes Vitamin D from UV radiation' },
      { text:'What carries oxygen in blood?', options:['White blood cells','Plasma','Platelets','Red blood cells'], answer:'Red blood cells', explanation:'Red blood cells contain haemoglobin which carries oxygen' },
    ],
    'Ancient History': [
      { text:'First emperor of China?', options:['Genghis Khan','Kublai Khan','Qin Shi Huang','Sun Yat-sen'], answer:'Qin Shi Huang', explanation:'Qin Shi Huang unified China in 221 BCE' },
      { text:'Capital of the Roman Empire?', options:['Athens','Carthage','Alexandria','Rome'], answer:'Rome', explanation:'Rome was the capital of the Roman Empire' },
      { text:'Who built Machu Picchu?', options:['Aztec','Maya','Inca','Olmec'], answer:'Inca', explanation:'Machu Picchu was built by the Inca around 1450 CE' },
      { text:'What was the Rosetta Stone used for?', options:['Navigation','Deciphering hieroglyphics','Ceremonies','Tax records'], answer:'Deciphering hieroglyphics', explanation:'The Rosetta Stone helped decode ancient Egyptian hieroglyphics' },
    ],
    'World War II': [
      { text:'Code name for German invasion of USSR?', options:['Operation Overlord','Operation Barbarossa','Operation Sea Lion','Operation Market Garden'], answer:'Operation Barbarossa', explanation:'Operation Barbarossa was Germany\'s invasion of USSR in June 1941' },
      { text:'First country invaded by Germany in WWII?', options:['France','Denmark','Austria','Poland'], answer:'Poland', explanation:'Germany invaded Poland on September 1, 1939' },
      { text:'Which conference shaped post-war Europe?', options:['Paris','Potsdam','Yalta','Tehran'], answer:'Yalta', explanation:'The Yalta Conference (Feb 1945) divided post-war Europe' },
      { text:'What was the Blitzkrieg?', options:['A German submarine','Lightning fast military attack','A peace treaty','Air defense system'], answer:'Lightning fast military attack', explanation:'Blitzkrieg means lightning war — fast combined arms attack' },
    ],
    'Indian History': [
      { text:'Who founded the Mughal Empire?', options:['Akbar','Babur','Humayun','Shah Jahan'], answer:'Babur', explanation:'Babur founded the Mughal Empire after Battle of Panipat in 1526' },
      { text:'What was the Dandi March about?', options:['Independence','Salt tax protest','Anti-partition','Non-cooperation'], answer:'Salt tax protest', explanation:'Gandhi marched 240 miles to protest British salt tax in 1930' },
      { text:'First President of India?', options:['Nehru','Sardar Patel','Rajendra Prasad','Ambedkar'], answer:'Rajendra Prasad', explanation:'Dr. Rajendra Prasad was India\'s first President 1950-1962' },
      { text:'Which king spread Buddhism after Kalinga War?', options:['Chandragupta','Bindusara','Ashoka','Harsha'], answer:'Ashoka', explanation:'Ashoka embraced Buddhism after witnessing the destruction of the Kalinga War' },
    ],
    'Data Structures': [
      { text:'Time complexity of inserting at head of linked list?', options:['O(n)','O(log n)','O(1)','O(n²)'], answer:'O(1)', explanation:'Just update the head pointer — O(1)' },
      { text:'Which structure is used in the call stack?', options:['Queue','Stack','Heap','Graph'], answer:'Stack', explanation:'Function calls use LIFO — a stack' },
      { text:'What is a priority queue?', options:['Sorted by insertion','Served by priority','Stack with priorities','Sorted array'], answer:'Served by priority', explanation:'Priority queue serves elements by priority value' },
      { text:'What is a circular linked list?', options:['List with no head','Tail points to head','Doubly linked','Sorted list'], answer:'Tail points to head', explanation:'In circular linked list, the last node points back to the first' },
    ],
    'Algorithms': [
      { text:'Average time complexity of hash table lookup?', options:['O(n)','O(log n)','O(1)','O(n²)'], answer:'O(1)', explanation:'Hash tables provide O(1) average lookup' },
      { text:'Which algorithm uses divide, conquer, combine?', options:['Bubble Sort','Merge Sort','Linear Search','Greedy'], answer:'Merge Sort', explanation:'Merge Sort divides, sorts halves, then merges' },
      { text:'What is backtracking?', options:['Going back in loop','Try and undo if fail','Type of sorting','Dynamic programming'], answer:'Try and undo if fail', explanation:'Backtracking tries options and undoes them if they don\'t work' },
      { text:'Time complexity of selection sort?', options:['O(n)','O(n log n)','O(n²)','O(log n)'], answer:'O(n²)', explanation:'Selection sort always scans remaining elements — O(n²)' },
    ],
    'Grammar': [
      { text:'Plural of "child"?', options:['Childs','Children','Childes','Childrens'], answer:'Children', explanation:'"Children" is the irregular plural of "child"' },
      { text:'Which sentence is future tense?', options:['She ran fast','She runs fast','She will run fast','She has run fast'], answer:'She will run fast', explanation:'"Will + verb" forms simple future tense' },
      { text:'Antonym of "ancient"?', options:['Old','Historic','Modern','Traditional'], answer:'Modern', explanation:'"Modern" is the opposite of "ancient"' },
      { text:'Identify the adverb: "She sings beautifully."', options:['She','sings','beautifully','the'], answer:'beautifully', explanation:'"Beautifully" modifies the verb "sings"' },
    ],
  };

  const topicFallbacks = allFallbacks[topic];
  if (topicFallbacks) {
    const unused = topicFallbacks.filter(q =>
      !askedQuestions.some(a => a.toLowerCase().trim() === q.text.toLowerCase().trim())
    );
    const pool   = unused.length > 0 ? unused : topicFallbacks;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    return { ...picked, difficulty };
  }

  return {
    text:        `What is a key principle of ${topic}?`,
    options:     [`${topic} has no applications`, `${topic} is fundamental to ${subject}`, `${topic} is only theoretical`, `${topic} is outdated`],
    answer:      `${topic} is fundamental to ${subject}`,
    explanation: `${topic} is a core concept in ${subject}.`,
    difficulty
  };
}

module.exports = { generateQuestion };