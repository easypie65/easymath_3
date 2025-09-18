// 문제 데이터베이스
// 각 문제에는 정답 계산을 위한 'answer'와 유사 문제 생성을 위한 'params'를 포함합니다.
const problems = {
    easy: [
        { id: 1, question: "다음 직각삼각형에서 $x$의 길이를 구하시오. (그림: 빗변 10, 각도 30도)", formula: "$$ \\sin(30^\\circ) = \\frac{x}{10} $$", answer: 5, params: {hypotenuse: 10, angle: 30, ratio: 'sin'} },
    ],
    medium: [
        { id: 2, question: "다음 삼각형의 넓이를 구하시오. (그림: 두 변의 길이 10, 8, 끼인각 60도)", formula: "$$ \\text{넓이} = \\frac{1}{2} \\times 10 \times 8 \times \\sin(60^\\circ) $$", answer: "20 * Math.sqrt(3)", params: {side1: 10, side2: 8, angle: 60} },
    ],
    hard: [
        { id: 3, question: "다음 그림과 같이 변의 길이가 주어졌을 때, $\triangle ABC$의 넓이를 구하시오. (그림: 변 AB=10, BC=12, 각 B=45도)", formula: "$$ \\text{넓이} = \\frac{1}{2} \\times 12 \\times (10 \\sin(45^\\circ)) $$", answer: "30 * Math.sqrt(2)", params: {side1: 10, side2: 12, angle: 45} },
    ]
};

// 정답 확인 함수
function checkAnswer(problemId, difficulty) {
    const inputElement = document.getElementById(`answer${problemId}`);
    const resultElement = document.getElementById(`result${problemId}`);
    const userAnswer = inputElement.value;
    
    // 문제 정보 가져오기
    const problem = problems[difficulty][0]; // 현재는 각 난이도당 첫 번째 문제만 사용
    
    let isCorrect = false;
    try {
        let correctAnswer;
        if (typeof problem.answer === 'string') {
            // 루트가 포함된 문자열 수식 계산
            correctAnswer = eval(problem.answer);
        } else {
            correctAnswer = problem.answer;
        }

        // 사용자의 입력 값과 정답 비교 (소수점 오차 허용)
        if (Math.abs(parseFloat(userAnswer) - correctAnswer) < 0.01) {
            isCorrect = true;
        }
    } catch (e) {
        resultElement.textContent = "입력 형식이 올바르지 않습니다.";
        resultElement.className = "result incorrect";
        return;
    }

    if (isCorrect) {
        resultElement.textContent = "🎉 정답입니다!";
        resultElement.className = "result correct";
    } else {
        resultElement.textContent = "❌ 오답입니다. 유사 문제를 제공합니다.";
        resultElement.className = "result incorrect";
        
        // 오답 시 유사 문제 생성 및 업데이트
        const newProblem = generateSimilarProblem(difficulty);
        updateProblemUI(problemId, newProblem);
    }
}

// 유사 문제 생성 함수
function generateSimilarProblem(difficulty) {
    let newProblem = {};
    if (difficulty === 'easy') {
        const newHypotenuse = Math.floor(Math.random() * 10) + 10; // 10에서 19 사이의 빗변
        const newAngle = [30, 45, 60][Math.floor(Math.random() * 3)]; // 30, 45, 60도 중 하나
        const angleRad = newAngle * Math.PI / 180;
        const newAnswer = newHypotenuse * Math.sin(angleRad);
        
        newProblem = {
            question: `다음 직각삼각형에서 $x$의 길이를 구하시오. (빗변 ${newHypotenuse}, 각도 ${newAngle}도)`,
            formula: `$$ \\sin(${newAngle}^\\circ) = \\frac{x}{${newHypotenuse}} $$`,
            answer: newAnswer.toFixed(2), // 소수점 두 자리로 정답 표시
        };
    } else if (difficulty === 'medium') {
        const newSide1 = Math.floor(Math.random() * 5) + 5;
        const newSide2 = Math.floor(Math.random() * 5) + 5;
        const newAngle = [30, 45, 60][Math.floor(Math.random() * 3)];
        const angleRad = newAngle * Math.PI / 180;
        const newAnswer = 0.5 * newSide1 * newSide2 * Math.sin(angleRad);
        
        newProblem = {
            question: `두 변의 길이가 ${newSide1}, ${newSide2}이고 끼인각이 ${newAngle}도인 삼각형의 넓이를 구하시오.`,
            formula: `$$ \\text{넓이} = \\frac{1}{2} \\times ${newSide1} \\times ${newSide2} \\times \\sin(${newAngle}^\\circ) $$`,
            answer: newAnswer.toFixed(2),
        };
    } else if (difficulty === 'hard') {
        const newSide1 = Math.floor(Math.random() * 5) + 8;
        const newSide2 = Math.floor(Math.random() * 5) + 8;
        const newAngle = [30, 45, 60][Math.floor(Math.random() * 3)];
        const angleRad = newAngle * Math.PI / 180;
        const height = newSide1 * Math.sin(angleRad);
        const newAnswer = 0.5 * newSide2 * height;

        newProblem = {
            question: `다음 그림에서 두 변의 길이가 ${newSide1}, ${newSide2}이고 끼인각이 ${newAngle}도인 삼각형의 넓이를 구하시오.`,
            formula: `$$ \\text{높이} = ${newSide1} \\sin(${newAngle}^\\circ) \\qquad \\text{넓이} = \\frac{1}{2} \\times ${newSide2} \\times \\text{높이} $$`,
            answer: newAnswer.toFixed(2),
        };
    }
    return newProblem;
}

// UI 업데이트 함수
function updateProblemUI(problemId, newProblem) {
    const problemElement = document.getElementById(`problem${problemId}`);
    
    // HTML 내용 업데이트
    const questionElement = problemElement.querySelector('p:first-of-type');
    const formulaElement = problemElement.querySelector('p:last-of-type');
    
    questionElement.innerHTML = `${problemId}. ${newProblem.question}`;
    formulaElement.innerHTML = newProblem.formula;
    
    // input 값 초기화
    const inputElement = document.getElementById(`answer${problemId}`);
    inputElement.value = "";
    
    // result 초기화
    const resultElement = document.getElementById(`result${problemId}`);
    resultElement.textContent = "";

    // MathJax 수식 다시 렌더링
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, problemElement]);
}
