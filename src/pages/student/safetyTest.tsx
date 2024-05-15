import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

import type { TestQuestion } from '@prisma/client';
import { useSession } from 'next-auth/react';

import { MachineContext } from '@/lib/contexts/MachineContext';

import Title from '@/components/Title';

interface ChoiceProps {
    text: string;
    selected: boolean;
    handleTouch: () => void;
}

type Answer = 1 | 2 | 3 | 4 | 5 | 6;

type TestQuestionAnswer = TestQuestion & { answer?: Answer };

const Choice = ({ text, selected, handleTouch }: ChoiceProps) => {
    return (
        <div
            className={`m-[3rem] flex h-[10rem] w-[50rem] items-center justify-center p-[5rem] text-4xl outline outline-[.5rem]  ${
                selected ? 'text-primary outline-primary' : 'outline-secondary'
            }`}
            onClick={() => handleTouch()}
        >
            {text}
        </div>
    );
};

interface QuestionProps {
    questionCount: number;
    question: TestQuestionAnswer;
    handleTouch: (choiceNumber: Answer) => void;
}

const Question = ({ questionCount, question, handleTouch }: QuestionProps) => {
    return (
        <div className="flex w-[130rem] flex-col items-center">
            <div className="mb-[10rem] text-7xl text-primary">
                {questionCount}. {question.text}
            </div>
            <div className="flex w-full justify-around text-secondary">
                <Choice
                    text={'A. ' + question.choice1}
                    selected={question.answer === 1}
                    handleTouch={() => handleTouch(1)}
                />
                <Choice
                    text={'B. ' + question.choice2}
                    selected={question.answer === 2}
                    handleTouch={() => handleTouch(2)}
                />
            </div>
            {question.choice3 && (
                <div className="flex w-full justify-around text-secondary">
                    <Choice
                        text={'C. ' + question.choice3}
                        selected={question.answer === 3}
                        handleTouch={() => handleTouch(3)}
                    />
                    {question.choice4 && (
                        <Choice
                            text={'D. ' + question.choice4}
                            selected={question.answer === 4}
                            handleTouch={() => handleTouch(4)}
                        />
                    )}
                </div>
            )}
            {question.choice5 && (
                <div className="flex w-full justify-around text-secondary">
                    <Choice
                        text={'E. ' + question.choice5}
                        selected={question.answer === 5}
                        handleTouch={() => handleTouch(5)}
                    />
                    {question.choice6 && (
                        <Choice
                            text={'F. ' + question.choice6}
                            selected={question.answer === 6}
                            handleTouch={() => handleTouch(6)}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

interface QuestionButtonProps {
    questionCount: number;
    highlight: boolean;
    correct?: boolean;
    handleTouch: (questionCount: number) => void;
}
const QuestionButton = ({
    questionCount,
    highlight,
    correct,
    handleTouch
}: QuestionButtonProps) => {
    return (
        <div
            className={`p-[5rem] ${highlight ? ' bg-primary-800' : ''} ${
                correct !== undefined ? (correct ? 'bg-green' : 'bg-red') : ''
            }`}
            onClick={() => handleTouch(questionCount)}
        >
            {questionCount}
        </div>
    );
};

const SafetyTest = (props) => {
    const [questions, setQuestions] = useState<TestQuestionAnswer[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<number[]>(Array(10).fill(0));
    const [studentId, setStudentId] = useState<number>(0);
    const [error, setError] = useState<string>('');
    const [incorrectAnswers, setIncorrectAnswers] = useState<number[] | null>(
        null
    );
    const [score, setScore] = useState<number>(0);

    const { machineUUID } = useContext(MachineContext);

    const { data: nextAuthSession, update } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (nextAuthSession?.user?.studentId !== undefined) {
            setStudentId(nextAuthSession?.user?.studentId.toString());
        }
    }, [nextAuthSession?.user?.studentId]);

    const getQuestions = async () => {
        if (questions.length == 0) {
            const res = await fetch(
                `/api/machine/getQuestions?UUID=${machineUUID}&generalSafetyTest=${
                    router.query?.generalSafetyTest ?? false
                }`
            ).then((res) => {
                if (res.status === 404) {
                    setError('Machine not found. Please contact your teacher.');
                    return;
                } else if (res.status === 422) {
                    setError('No questions found. Please contact your teacher');
                    return;
                }
                return res.json();
            });

            if (res) {
                setQuestions(res.questions);
                setCurrentQuestion(1);
            }
        }
    };

    const handleTouch = (choiceNumber: Answer) => {
        setError('');
        if (incorrectAnswers) {
            moveForward(false);
            return;
        }
        setAnswers((prev) => {
            const newAnswers = [...prev];
            newAnswers[currentQuestion - 1] = choiceNumber;
            return newAnswers;
        });
        setQuestions((prev) => {
            const newQuestions = [...prev];
            newQuestions[currentQuestion - 1].answer = choiceNumber;
            return newQuestions;
        });
        moveForward(true);
    };

    const moveForward = (skip = false, submit = false) => {
        const answered = answers.filter((value) => value !== 0).length;
        const answerLen = skip ? answered + 1 : answered;
        console.log(answerLen, questions.length, currentQuestion, answers);
        if (answerLen === questions.length && submit) {
            checkAnswers();
        } else if (answerLen >= currentQuestion) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setError('Please answer all questions.');
        }
    };

    const checkAnswers = () => {
        const incorrectAnswers = Array(10).fill(1);
        for (let i = 0; i < questions.length; i++) {
            if (questions[i].correctChoice !== answers[i]) {
                incorrectAnswers[i] = 0;
            }
        }
        const score = (incorrectAnswers.reduce((a, b) => a + b, 0) / 10) * 100;
        console.log(score);
        setScore(score);
        if (score == 100) {
            submitAnswers();
        } else {
            setIncorrectAnswers(incorrectAnswers);
        }
    };

    const submitAnswers = async () => {
        const res = await fetch('/api/apprentice/test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                studentId,
                machineUUID,
                generalSafetyTest: router?.query?.generalSafetyTest ?? false
            })
        });

        const data = await res.json();
        if (data.message) {
            setError(data.message);
        }
        if (res.status === 200) {
            update({
                generalSafetyTest: true
            });
            router.push('/');
        }
    };

    const retryTest = () => {
        setCurrentQuestion(1);
        setAnswers(Array(10).fill(0));
        setQuestions((prev) => {
            const newQuestions = [...prev];
            newQuestions.forEach((question) => {
                question.answer = undefined;
            });
            return newQuestions;
        });
        setIncorrectAnswers(null);
        setScore(0);
    };

    return (
        <div className="flex w-screen flex-col items-center text-center font-oxygen text-white">
            <Title
                title={`${
                    router.query?.generalSafetyTest ?? false
                        ? 'General'
                        : 'Machine'
                } Safety Test`}
            />
            <div className="flex flex-col items-center p-[2rem] text-4xl ">
                {currentQuestion === 0 && (
                    <div
                        className="mt-[20rem] w-[30rem] p-[3rem] text-center text-5xl outline outline-[.5rem]"
                        onClick={() => {
                            getQuestions();
                        }}
                    >
                        Start Test
                    </div>
                )}
                {questions && currentQuestion > 0 && currentQuestion < 11 && (
                    <div className="flex flex-col">
                        <Question
                            questionCount={currentQuestion}
                            question={questions[currentQuestion - 1]}
                            handleTouch={handleTouch}
                        />
                    </div>
                )}
                {currentQuestion > 0 &&
                    currentQuestion >= questions.length &&
                    score == 0 && (
                        <div className="flex flex-col items-center justify-center text-center">
                            <div
                                className="mt-[5rem] flex h-[10rem] w-[30rem] items-center justify-center  p-[5rem] text-5xl text-primary outline outline-[1rem] outline-primary"
                                onClick={() => moveForward(false, true)}
                            >
                                Submit Test
                            </div>
                            <div className="mt-[5rem] text-5xl text-primary">
                                {answers.filter((value) => value !== 0).length}{' '}
                                / {questions.length} questions answered
                            </div>
                        </div>
                    )}
                {score === 100 && (
                    <div className="mt-[5rem] text-5xl text-green">
                        Test Passed
                    </div>
                )}
                {score !== 100 && incorrectAnswers && (
                    <div className="flex flex-col items-center">
                        <div className="mt-[5rem] text-5xl text-red">
                            Test Failed - {score}%
                        </div>
                        <div className="mt-[2rem] text-4xl text-red">
                            Go back and review the questions you got wrong, then
                            click the button below to retry the test.
                        </div>
                        <div
                            className="mb-[4rem] mt-[4rem] flex h-[10rem] w-[30rem] items-center justify-center p-[5rem] text-5xl text-red outline outline-[1rem] outline-red"
                            onClick={() => retryTest()}
                        >
                            Retry Test
                        </div>
                    </div>
                )}
                {questions && currentQuestion > 0 && (
                    <div className="mt-[2rem]">
                        {/* need this to be low but now the main piece is too high  */}
                        <div className="flex flex-row justify-center space-x-[1rem] text-5xl">
                            {questions.map((question, index) => (
                                <QuestionButton
                                    key={index}
                                    questionCount={index + 1}
                                    highlight={index + 1 === currentQuestion}
                                    correct={
                                        incorrectAnswers
                                            ? incorrectAnswers[index] === 1
                                            : undefined
                                    }
                                    handleTouch={(questionCount) =>
                                        setCurrentQuestion(questionCount)
                                    }
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {error && (
                <div className="mt-[2rem] scroll-smooth text-5xl text-red-500">
                    {error}
                </div>
            )}
        </div>
    );
};

export default SafetyTest;
