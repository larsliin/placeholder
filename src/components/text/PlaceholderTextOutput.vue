<template>
    <div class="output-container">
        <textarea
            class="output-paragraph"
            aria-label="paragraph output"
            rows="22"
            spellcheck="false"
            v-model="lorem"></textarea>
    </div>
</template>

<script setup>
    import { usePlaceholderStore } from '@stores/placeholder';
    import { ref, watch } from 'vue';

    const placeholderStore = usePlaceholderStore();

    const generateLoremIpsum = (wordCount = 100) => {
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

        const mandatoryWords = ['lorem', 'ipsum']; // Mandatory starting words

        const addRandomWord = (textArray, lastWords) => {
            let randomWord;
            do {
                randomWord = loremIpsumWords[Math.floor(Math.random() * loremIpsumWords.length)];
            } while (lastWords.includes(randomWord)); // Avoid repeating within last 10 words

            lastWords.push(randomWord);
            if (lastWords.length > 10) lastWords.shift(); // Keep track of the last 10 words
            return [...textArray, randomWord]; // Add the random word to the generated text
        };

        // If wordCount is smaller than mandatoryWords length, just return the slice
        if (wordCount <= mandatoryWords.length) {
            return `${mandatoryWords.slice(0, wordCount).join(' ')}.`;
        }

        // Generate the remaining words using reduce
        const result = Array.from({ length: wordCount - mandatoryWords.length }).reduce(
            ({ textArray, lastWords }) => ({
                textArray: addRandomWord(textArray, lastWords),
                lastWords,
            }),
            { textArray: mandatoryWords, lastWords: [...mandatoryWords] },
        ).textArray;

        return `${result.join(' ')}.`;
    };

    function generateLoremIpsumParagraphs(paragraphCount, wordCount) {
        const generateParagraphs = (pCount = paragraphCount, wCount = wordCount) => Array.from(
            { length: pCount },
            () => generateLoremIpsum(wCount),
        ).join('\n\n');
        return generateParagraphs();
    }

    const lorem = ref(generateLoremIpsumParagraphs(
        placeholderStore.model.paragraphCount,
        placeholderStore.model.wordCount,
    ));

    watch([
        () => placeholderStore.model.paragraphCount,
        () => placeholderStore.model.wordCount,
    ], () => {
        lorem.value = generateLoremIpsumParagraphs(
            placeholderStore.model.paragraphCount,
            placeholderStore.model.wordCount,
        );
    });

</script>

<style scoped lang="scss">
.output-paragraph {
    width: 100%;
    padding: 5px;
}

</style>
