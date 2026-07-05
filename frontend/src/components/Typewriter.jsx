import React, { useEffect, useState } from 'react';

const Typewriter = ({
    words = ['Software Engineer', 'Product Designer', 'Marketing Specialist', 'Student', 'Freelancer'],
    typingSpeed = 80,
    deletingSpeed = 40,
    pauseTime = 1500,
    className = '',
}) => {
    const [wordIndex, setWordIndex] = useState(0);
    const [text, setText] = useState('');
    const [phase, setPhase] = useState('typing'); // typing | pausing | deleting

    useEffect(() => {
        const currentWord = words[wordIndex % words.length];
        let timeout;

        if (phase === 'typing') {
            if (text.length < currentWord.length) {
                timeout = setTimeout(() => setText(currentWord.slice(0, text.length + 1)), typingSpeed);
            } else {
                timeout = setTimeout(() => setPhase('pausing'), pauseTime);
            }
        } else if (phase === 'pausing') {
            timeout = setTimeout(() => setPhase('deleting'), pauseTime / 2);
        } else if (phase === 'deleting') {
            if (text.length > 0) {
                timeout = setTimeout(() => setText(currentWord.slice(0, text.length - 1)), deletingSpeed);
            } else {
                setWordIndex((i) => (i + 1) % words.length);
                setPhase('typing');
            }
        }

        return () => clearTimeout(timeout);
    }, [text, phase, wordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

    return (
        <span className={className}>
            {text}
            <span className="inline-block w-[2px] h-[1em] bg-current ml-1 align-middle animate-pulse" />
        </span>
    );
};

export default Typewriter;
