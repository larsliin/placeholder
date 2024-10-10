<template>
    <div class="output-container">
        <v-row>
            <v-col
                cols="12">
                <v-textarea
                    rows="10"
                    spellcheck="false"
                    class="output-paragraph"
                    v-model="loremIpsum"
                    :flat="true" />
                <v-btn
                    color="blue-darken-1"
                    variant="tonal"
                    @click="onCopyClick()">
                    COPY
                </v-btn>
            </v-col>
        </v-row>
    </div>

</template>

<script setup>

    import { usePlaceholderStore } from '@stores/placeholder';
    import { ref, watch } from 'vue';
    import useEventsBus from '@cmp/eventBus';
    import { EMITS } from '@/constants';

    const placeholderStore = usePlaceholderStore();

    // Function to capitalize the first letter of each sentence
    const capitalizeSentences = (text) => text.replace(/(?:^|[.!?]\s+)(\w)/g, (match, p1) => match.replace(p1, p1.toUpperCase()));

    // Function to randomly insert punctuation without leaving space before it
    const insertRandomPunctuation = (textArray) => {
        const punctuationMarks = ['.', ',', '!'];
        const result = [];

        textArray.forEach((word, index) => {
            result.push(word); // Add the word first

            // Randomly decide whether to add punctuation after the word
            if (Math.random() < 0.1 && index !== textArray.length - 1) { // 20% chance, avoid at end
                const randomPunctuation = punctuationMarks[
                    Math.floor(Math.random() * punctuationMarks.length)
                ];
                // Append the punctuation directly to the word without a space
                result[result.length - 1] += randomPunctuation;
            }
        });

        return result.join(' ');
    };

    // Function to generate lorem ipsum, with optional mandatory words (for the first paragraph)
    const generateLoremIpsum = (wordCount = 100, mandatoryWords = []) => {
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

        // Initialize with mandatory words (if provided)
        const textArray = mandatoryWords.length ? [...mandatoryWords] : [];
        const lastWords = [...textArray]; // Track last words to avoid repetition

        const remainingWords = wordCount - textArray.length;

        // Add remaining words
        Array.from({ length: remainingWords }).forEach(() => {
            addRandomWord(textArray, lastWords);
        });

        // Insert random punctuation
        const punctuatedText = insertRandomPunctuation(textArray);

        // Capitalize the first letter of each sentence
        return `${capitalizeSentences(punctuatedText)}.`;
    };

    // Function to generate multiple paragraphs
    // eslint-disable-next-line
    const generateParagraphs = (paragraphCount = 3, wordsPerParagraph = 100) => Array.from({ length: paragraphCount }, (_, i) => {
        if (i === 0) {
            // First paragraph starts with "lorem ipsum"
            return generateLoremIpsum(wordsPerParagraph, ['lorem', 'ipsum']);
        }
        // Subsequent paragraphs are generated without mandatory starting words
        return generateLoremIpsum(wordsPerParagraph);
    }).join('\n\n');

    const loremIpsum = ref(generateParagraphs(
        placeholderStore.model.paragraphCount,
        placeholderStore.model.wordCount,
    ));

    const { emit } = useEventsBus();

    function onCopyClick() {
        navigator.clipboard.writeText(loremIpsum.value).then(() => {
            emit(EMITS.COPY, { success: true });
        }).catch(() => {
            emit(EMITS.COPY, { success: false });
        });
    }

    watch([
        () => placeholderStore.model.paragraphCount,
        () => placeholderStore.model.wordCount,
    ], () => {
        loremIpsum.value = generateParagraphs(
            placeholderStore.model.paragraphCount,
            placeholderStore.model.wordCount,
        );
    });

</script>

<style scoped lang="scss">
.output-paragraph {
    :deep(textarea){
        font-size: 14px;
    }
}

</style>
