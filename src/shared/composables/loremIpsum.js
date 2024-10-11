export default function useLoremIpsum() {
    // Function to capitalize the first letter of each sentence, including after ".", "!", and "?"
    const capitalizeSentences = (text) => text.replace(/(?:^|[.!?]\s+)(\w)/g, (match, p1) => match.replace(p1, p1.toUpperCase()));

    // Function to randomly insert punctuation without leaving space before it
    const insertRandomPunctuation = (textArray, mandatoryWordsLength) => {
        const punctuationMarks = ['.', ',', '!', '?'];
        const result = [];

        textArray.forEach((word, index) => {
            result.push(word); // Add the word first

            // Ensure punctuation is not inserted between mandatory words
            if (index < mandatoryWordsLength - 1) {
                return;
            }

            // Randomly decide whether to add punctuation after the word
            if (Math.random() < 0.2 && index !== textArray.length - 1) { // 20% chance, avoid at end
                const randomPunctuation = punctuationMarks[
                    Math.floor(Math.random() * punctuationMarks.length)];
                // Append the punctuation directly to the word without a space
                result[result.length - 1] += randomPunctuation;
            }
        });

        return result.join(' ');
    };

    // Function to generate lorem ipsum, with optional mandatory words (for the first paragraph)
    const generateSingleParagraph = (
        wordCount = 100,
        mandatoryWords = [],
        noSpacesOrPunctuation = false,
    ) => {
        const loremIpsumWords = [
            'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
            'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
            'magna', 'aliqua', 'ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
            'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea',
            'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit',
            'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla',
            'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident',
            'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est',
            'laborum', 'sapien', 'ullamcorper', 'nibh', 'nisi', 'congue', 'scelerisque',
            'massa', 'faucibus', 'nullam', 'feugiat', 'viverra', 'mauris', 'facilisi',
            'convallis', 'rutrum', 'pellentesque', 'habitant', 'morbi', 'tristique', 'senectus',
            'netus', 'malesuada', 'fames', 'ac', 'turpis', 'egestas', 'integer', 'ac', 'libero',
            'euismod', 'pharetra', 'tellus', 'at', 'auctor', 'orci', 'fringilla', 'vulputate',
            'pharetra', 'vestibulum', 'vel', 'lacus', 'laoreet', 'amet', 'dictum', 'imperdiet',
            'rhoncus', 'blandit', 'aliquam', 'pretium', 'metus', 'varius', 'arcu', 'interdum',
        ];

        const addRandomWord = (textArray, lastWords) => {
            let randomWord;
            do {
                randomWord = loremIpsumWords[Math.floor(Math.random() * loremIpsumWords.length)];
            } while (lastWords.includes(randomWord)); // Avoid repeating within the last 10 words

            lastWords.push(randomWord);
            if (lastWords.length > 10) lastWords.shift(); // Maintain a max of 10 words in history
            textArray.push(randomWord); // Add the random word to the text array
            return textArray;
        };

        // Limit mandatory words if word count is less than the number of mandatory words
        const effectiveMandatoryWords = mandatoryWords.slice(0, wordCount);

        // Initialize with mandatory words (if provided)
        const textArray = [...effectiveMandatoryWords];
        const lastWords = [...textArray]; // Track last words to avoid repetition

        // Avoid negative remaining words
        const remainingWords = Math.max(0, wordCount - textArray.length);

        // Add remaining words
        Array.from({ length: remainingWords }).forEach(() => {
            addRandomWord(textArray, lastWords);
        });

        // If noSpacesOrPunctuation is true, return the text with no spaces or punctuation
        if (noSpacesOrPunctuation) {
            return textArray.join('');
        }

        // Insert random punctuation (starting after mandatory words if present)
        const punctuatedText = insertRandomPunctuation(textArray, effectiveMandatoryWords.length);

        // Capitalize the first letter of each sentence
        return `${capitalizeSentences(punctuatedText)}.`;
    };

    // Function to generate multiple paragraphs
    const generateLoremIpsum = (
        paragraphCount = 3,
        wordsPerParagraph = 100,
    ) => Array.from({ length: paragraphCount }, (_, i) => {
        if (i === 0) {
            // First paragraph starts with "lorem ipsum"
            return generateSingleParagraph(wordsPerParagraph, ['lorem', 'ipsum']);
        }
        // Subsequent paragraphs are generated without mandatory starting words
        return generateSingleParagraph(wordsPerParagraph);
    }).join('\n\n');

    const generateUrl = () => `https://${generateSingleParagraph(2, [], true)}.com`;

    return {
        generateLoremIpsum,
        generateUrl,
    };
}
