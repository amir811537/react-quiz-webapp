import { useRef, useState, useEffect } from 'react';
import './quiz.css';
import { data } from '../../Assets/data';

const Quiz = () => {
    const [index, setIndex] = useState(0);
    const [question, setQuestion] = useState(data[index]);
    const [lock, setLock] = useState(false);
    const [score, setScore] = useState(0);
    const [result, setResult] = useState(false);
    // Set the initial countdown time based on data.length
    const [time, setTime] = useState(data.length * 60); 
    // Total time for the quiz
    const [totalTime] = useState(data.length * 60); 

    const option1 = useRef(null);
    const option2 = useRef(null);
    const option3 = useRef(null);
    const option4 = useRef(null);

    const optionArray = [option1, option2, option3, option4];

    useEffect(() => {
        let timer;

        if (!lock && time > 0) {
            timer = setInterval(() => {
                setTime(prevTime => prevTime - 1);
            }, 1000);
        } else if (time === 0) {
            // Time is up, reset the quiz
            setResult(true);
        }

        return () => {
            clearInterval(timer);
        };
    }, [lock, time]);

    const checkAnswer = (e, ans) => {
        if (lock === false) {
            if (question.ans === ans) {
                e.target.classList.add('correct');
                setLock(true);
                setScore(prev => prev + 1);
            } else {
                e.target.classList.add('wrong');
                setLock(true);
                optionArray[question.ans - 1].current.classList.add('correct');
            }
        }
    };

    const next = () => {
        if (lock === true) {
            if (index === data.length - 1) {
                setResult(true);
                return 0;
            }
            setIndex(prevIndex => prevIndex + 1);
            setQuestion(data[index + 1]);
            setLock(false);
            // Decrement time to show the next question
            setTime(prevTime => prevTime - 1); 
            optionArray.forEach(option => {
                option.current.classList.remove('wrong');
                option.current.classList.remove('correct');
            });
        }
    };

    const reset = () => {
        setIndex(0);
        setQuestion(data[0]);
        setScore(0);
        setLock(false);
        setResult(false);
        // Reset the countdown time to the total time
        setTime(totalTime); 
    };

    return (
        <div className="container">surge
            <h1> Quiz App</h1>
            <hr />
            {result ? (
                <>
<h3>Your Scored {score} out of {data.length} in {Math.floor((totalTime - time) / 60)} minutes  {(totalTime - time) % 60} seconds</h3>
                    <button onClick={reset}>Reset</button>
                </>
            ) : (
                <>
                    <h2>
                        {index + 1}.{question.question}
                    </h2>
                    <div className="timer">Time Remaining: {time} seconds</div>
                    <ul>
                        <li ref={option1} onClick={e => checkAnswer(e, 1)}>
                            {question.option1}
                        </li>
                        <li ref={option2} onClick={e => checkAnswer(e, 2)}>
                            {question.option2}
                        </li>
                        <li ref={option3} onClick={e => checkAnswer(e, 3)}>
                            {question.option3}
                        </li>
                        <li ref={option4} onClick={e => checkAnswer(e, 4)}>
                            {question.option4}
                        </li>
                    </ul>
                    <button onClick={next}>Next</button>
                    <div className="index">
                        {index + 1} of {data.length} questions
                    </div>
                </>
            )}
        </div>
    );
};

export default Quiz;
