const axios = require('axios');
const marked = require('marked');

// Vue-like data structure
const appState = {
  githubUrl: '',
  quiz: { subject: '', minScore: 0, questions: [] },
  userAnswers: {},
  results: null,
};

// Helper function to parse markdown
function parseMarkdown(content) {
  const subjectMatch = content.match(/# Subject: (.+)/);
  const minScoreMatch = content.match(/## Minimum Score Required: (\d+)/);

  const subject = subjectMatch ? subjectMatch[1] : 'Unknown Subject';
  const minScore = minScoreMatch ? parseInt(minScoreMatch[1], 10) : 0;

  const questions = [];
  const questionBlocks = content.split(/### Question \d+ \(Score: \d+\)/).slice(1);
  const questionHeaders = content.match(/### Question \d+ \(Score: \d+\)/g);

  questionHeaders.forEach((header, index) => {
    const block = questionBlocks[index];
    const questionText = block.match(/\n(.+)/)[1].trim();
    const score = parseInt(header.match(/Score: (\d+)/)[1], 10);
    const options = [...block.matchAll(/- ([A-D])\) (.+)/g)].map(match => [match[1], match[2]]);
    const answerMatch = block.match(/\*\*Answer: ([A-D])\*\*/);
    const answer = answerMatch ? answerMatch[1] : null;

    questions.push({ question: questionText, score, options, answer });
  });

  return { subject, minScore, questions };
}

// Fetch quiz from GitHub
async function fetchQuiz() {
  if (!appState.githubUrl) return;

  try {
    const response = await axios.get(appState.githubUrl);
    appState.quiz = parseMarkdown(response.data);
    renderApp();
  } catch (error) {
    console.error('Error fetching quiz:', error);
    alert('Failed to fetch or parse the markdown file.');
  }
}

// Submit quiz answers
function submitQuiz() {
  let totalScore = 0;
  const results = appState.quiz.questions.map((question) => {
    const userAnswer = appState.userAnswers[question.question];
    const isCorrect = userAnswer === question.answer;
    const score = isCorrect ? question.score : 0;
    totalScore += score;

    return {
      question: question.question,
      correctAnswer: question.answer,
      userAnswer,
      isCorrect,
      score,
    };
  });

  const passed = totalScore >= appState.quiz.minScore;

  appState.results = { results, totalScore, minScore: appState.quiz.minScore, passed };
  renderApp();
}

// Render markdown content
function renderMarkdown(text) {
  return marked(text);
}

// Render the app dynamically
function renderApp() {
  document.body.innerHTML = `
    <h1>MCQ Quiz</h1>

    ${!appState.quiz.subject ? `
      <div>
        <h2>Enter GitHub Raw URL</h2>
        <input type="text" value="${appState.githubUrl}" placeholder="https://raw.githubusercontent.com/..." />
        <button onclick="fetchQuiz()">Load Quiz</button>
      </div>
    ` : `
      <div>
        <h1>${appState.quiz.subject}</h1>
        <p><strong>Minimum Score Required:</strong> ${appState.quiz.minScore}</p>

        <form>
          ${appState.quiz.questions.map((question, index) => `
            <div class="question">
              <p><strong>${index + 1}. ${question.question}</strong></p>
              <div>${renderMarkdown(question.question)}</div>
              ${question.options.map(option => `
                <label>
                  <input type="radio" name="q${index}" value="${option[0]}" ${
                    appState.userAnswers[question.question] === option[0] ? 'checked' : ''
                  } />
                  ${option[0]}) <span>${renderMarkdown(option[1])}</span>
                </label>
              `).join('')}
            </div>
          `).join('')}
          <button type="button" onclick="submitQuiz()">Submit</button>
        </form>

        ${appState.results ? `
          <div class="results">
            <h2>Results</h2>
            <p><strong>Total Score:</strong> ${appState.results.totalScore}</p>
            <p><strong>Passed:</strong> ${appState.results.passed ? 'Yes' : 'No'}</p>
            ${appState.results.results.map(result => `
              <div>
                <p><strong>${result.question}</strong></p>
                <p>Your Answer: ${result.userAnswer || 'Not answered'}</p>
                <p>Correct Answer: ${result.correctAnswer}</p>
                <p>Score: ${result.score}</p>
                <hr />
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `}
  `;
}

// Expose functions to global scope for event handling
window.fetchQuiz = fetchQuiz;
window.submitQuiz = submitQuiz;