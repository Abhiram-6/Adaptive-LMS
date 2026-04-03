const router   = require('express').Router();
const axios    = require('axios');
const auth     = require('../middleware/auth');
const User     = require('../models/User');
const Question = require('../models/Question');
const Session  = require('../models/Session');
const { generateQuestion } = require('../llm');

const CATALOGUE = {
  Math:    ['Algebra', 'Geometry', 'Trigonometry', 'Calculus', 'Statistics'],
  Science: ['Physics', 'Chemistry', 'Biology', 'Earth Science'],
  History: ['Ancient History', 'World War II', 'Indian History', 'Modern History'],
  English: ['Grammar', 'Comprehension', 'Vocabulary', 'Literature'],
  CS:      ['Data Structures', 'Algorithms', 'Databases', 'Networking']
};

router.get('/catalogue', auth, (req, res) => {
  res.json({ catalogue: CATALOGUE });
});

router.get('/subject/:subject', auth, async (req, res) => {
  try {
    const user   = await User.findById(req.user.id);
    const topics = CATALOGUE[req.params.subject] || [];
    const result = topics.map(topic => {
      const m = user.mastery.find(m => m.topic === topic);
      return {
        topic,
        p_l:       m ? m.p_l       : 0.3,
        bestScore: m ? m.bestScore : 0,
        attempts:  m ? m.attempts  : 0
      };
    });
    res.json({ subject: req.params.subject, topics: result });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// router.get('/question/:subject/:topic', auth, async (req, res) => {
//   try {
//     const decodedTopic = decodeURIComponent(req.params.topic);
//     const sessionId    = req.query.sessionId || null;

//     const user    = await User.findById(req.user.id);
//     const mastery = user.mastery.find(m => m.topic === decodedTopic);
//     const p_l     = mastery ? mastery.p_l : 0.3;

//     let difficulty;
//     if      (p_l < 0.4)  difficulty = 1;
//     else if (p_l < 0.6)  difficulty = 2;
//     else if (p_l < 0.75) difficulty = 3;
//     else                 difficulty = 4;

//     let askedIds = [];
//     if (sessionId) {
//       const currentSession = await Session.findById(sessionId);
//       if (currentSession) {
//         askedIds = currentSession.responses.map(r => r.questionId).filter(Boolean);
//       }
//     }

//     let questions = await Question.find({
//       topic: decodedTopic,
//       difficulty,
//       _id: { $nin: askedIds }
//     });

//     if (!questions.length) {
//       questions = await Question.find({ topic: decodedTopic, _id: { $nin: askedIds } });
//     }

//     if (!questions.length) {
//       questions = await Question.find({ topic: decodedTopic });
//     }

//     if (!questions.length) {
//       return res.status(404).json({ msg: `No questions found for ${decodedTopic}` });
//     }

//     const q = questions[Math.floor(Math.random() * questions.length)];
//     res.json({ question: q, current_p_l: p_l });

//   } catch (err) {
//     console.error('Question route error:', err.message);
//     res.status(500).json({ msg: err.message });
//   }
// });

router.get('/question/:subject/:topic', auth, async (req, res) => {
  try {
    const { subject, topic } = req.params;
    const decodedTopic   = decodeURIComponent(topic);
    const decodedSubject = decodeURIComponent(subject);
    const sessionId      = req.query.sessionId || null;

    const user    = await User.findById(req.user.id);
    const mastery = user.mastery.find(m => m.topic === decodedTopic);
    const p_l     = mastery ? mastery.p_l : 0.3;

    let difficulty;
    if      (p_l < 0.4)  difficulty = 1;
    else if (p_l < 0.6)  difficulty = 2;
    else if (p_l < 0.75) difficulty = 3;
    else                 difficulty = 4;

    // Get session stats
    let askedIds     = [];
    let askedTexts   = [];
    let sessionCount = 0;
    let wrongAreas   = [];
    let correctCount = 0;

    if (sessionId) {
      const currentSession = await Session.findById(sessionId);
      if (currentSession) {
        sessionCount = currentSession.responses.length;
        askedIds     = currentSession.responses.map(r => r.questionId).filter(Boolean);
        askedTexts   = currentSession.responses.map(r => r.questionText).filter(Boolean);
        wrongAreas   = currentSession.responses
          .filter(r => !r.correct && r.weakArea)
          .map(r => r.weakArea);
        correctCount = currentSession.responses.filter(r => r.correct).length;
      }
    }

    // ── Phase 1: first 10 → serve from DB ──
    if (sessionCount < 10) {
      let questions = await Question.find({
        topic: decodedTopic,
        difficulty,
        _id: { $nin: askedIds }
      });

      if (!questions.length) {
        questions = await Question.find({
          topic: decodedTopic,
          _id: { $nin: askedIds }
        });
      }

      if (questions.length) {
        const q = questions[Math.floor(Math.random() * questions.length)];
        return res.json({
          question:    q,
          current_p_l: p_l,
          phase:       'bank',
          questionNum: sessionCount + 1
        });
      }
    }

    // ── Phase 2: after 10 → Groq AI personalized ──
    const accuracy   = sessionCount > 0
      ? Math.round((correctCount / sessionCount) * 100) : 0;

    const uniqueWeak = [...new Set(wrongAreas)].slice(0, 4);

    // Also pull weak areas from past sessions
    const pastSessions = await Session.find({ userId: req.user.id, topic: decodedTopic })
      .sort({ createdAt: -1 }).limit(2);
    pastSessions.forEach(s => {
      s.responses.forEach(r => {
        if (!r.correct && r.weakArea) uniqueWeak.push(r.weakArea);
      });
    });
    const finalWeak = [...new Set(uniqueWeak)].slice(0, 4);

    // Adjust difficulty based on accuracy
    let aiDifficulty = difficulty;
    if      (accuracy >= 80) aiDifficulty = Math.min(difficulty + 1, 4);
    else if (accuracy <= 40) aiDifficulty = Math.max(difficulty - 1, 1);

    console.log(`🤖 Phase 2 — Q${sessionCount + 1} | Accuracy: ${accuracy}% | Weak: [${finalWeak.join(', ') || 'none'}] | Difficulty: ${aiDifficulty}`);

    const question = await generateQuestion(
      decodedTopic,
      decodedSubject,
      finalWeak,
      aiDifficulty,
      askedTexts
    );
    question._id = Date.now().toString();

    res.json({
      question,
      current_p_l: p_l,
      phase:       'ai',
      questionNum: sessionCount + 1,
      accuracy,
      aiDifficulty
    });

  } catch (err) {
    console.error('Question route error:', err.message);
    res.status(500).json({ msg: err.message });
  }
});
router.post('/answer', auth, async (req, res) => {
  try {
    const { selectedAnswer, topic, subject, sessionId, question } = req.body;

    const correct = question.answer === selectedAnswer;
    const user    = await User.findById(req.user.id);
    let mastery   = user.mastery.find(m => m.topic === topic);
    const p_l     = mastery ? mastery.p_l : 0.3;

    const { data: bktData } = await axios.post(
      `${process.env.ML_SERVICE_URL}/update`,
      { p_l, correct }
    );

    if (mastery) {
      mastery.p_l      = bktData.p_l;
      mastery.attempts = (mastery.attempts || 0) + 1;
      const newScore   = Math.round(bktData.p_l * 100);
      if (newScore > (mastery.bestScore || 0)) mastery.bestScore = newScore;
    } else {
      user.mastery.push({
        topic,
        subject:   subject || 'Math',
        p_l:       bktData.p_l,
        bestScore: correct ? Math.round(bktData.p_l * 100) : 0,
        attempts:  1
      });
    }

    const today     = new Date().toDateString();
    const last      = user.lastActive ? new Date(user.lastActive).toDateString() : null;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (last !== today) {
      user.streak     = last === yesterday ? (user.streak || 0) + 1 : 1;
      user.lastActive = new Date();
    }

    await user.save();

    if (sessionId) {
  // AI questions have string IDs, DB questions have ObjectIds
  // Only store questionId if it looks like a valid MongoDB ObjectId
  const isObjectId = question._id && question._id.length === 24 && /^[a-f0-9]+$/i.test(question._id);

  await Session.findByIdAndUpdate(sessionId, {
    $push: { responses: {
      ...(isObjectId && { questionId: question._id }),
      questionText: question.text,
      correct,
      p_l_after:    bktData.p_l,
      weakArea:     !correct ? topic : null
    }}
  });
}

    res.json({
      correct,
      p_l:         bktData.p_l,
      mastered:    bktData.mastered,
      explanation: question.explanation
    });
  } catch (err) {
    console.error('Answer route error:', err.message);
    res.status(500).json({ msg: err.message });
  }
});

router.post('/reset', auth, async (req, res) => {
  try {
    const { topic } = req.body;
    const user      = await User.findById(req.user.id);
    const mastery   = user.mastery.find(m => m.topic === topic);
    if (mastery) {
      mastery.p_l      = 0.3;
      mastery.attempts = 0;
    }
    await user.save();
    res.json({ msg: 'Score reset', topic });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post('/session', auth, async (req, res) => {
  try {
    console.log('Session create attempt, userId:', req.user.id, 'topic:', req.body.topic);
    const session = await Session.create({
      userId:    req.user.id,
      topic:     req.body.topic,
      responses: []
    });
    console.log('Session created:', session._id);
    res.json({ sessionId: session._id });
  } catch (err) {
    console.error('SESSION ERROR FULL:', err);
    res.status(500).json({ msg: err.message });
  }
});

router.get('/mastery', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('mastery name streak');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get('/leaderboard', auth, async (req, res) => {
  try {
    const users  = await User.find({ 'mastery.0': { $exists: true } }).select('name mastery streak');
    const ranked = users.map(u => ({
      name:    u.name,
      id:      u._id,
      streak:  u.streak || 0,
      mastery: u.mastery.length
        ? Math.round((u.mastery.reduce((a, m) => a + m.p_l, 0) / u.mastery.length) * 100)
        : 0
    }))
    .sort((a, b) => b.mastery - a.mastery)
    .slice(0, 10);
    res.json({ leaderboard: ranked, userId: req.user.id });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get('/analytics', auth, async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user.id });
    const topicMap = {};
    sessions.forEach(s => {
      if (!topicMap[s.topic]) topicMap[s.topic] = { correct: 0, total: 0 };
      s.responses.forEach(r => {
        topicMap[s.topic].total++;
        if (r.correct) topicMap[s.topic].correct++;
      });
    });
    const analytics = Object.entries(topicMap).map(([topic, d]) => ({
      topic,
      total:    d.total,
      correct:  d.correct,
      accuracy: d.total ? Math.round((d.correct / d.total) * 100) : 0
    }));
    const user = await User.findById(req.user.id).select('mastery streak');
    res.json({ analytics, mastery: user.mastery, streak: user.streak || 0 });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;