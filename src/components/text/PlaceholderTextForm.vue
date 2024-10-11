<template>
    <v-row>
        <v-col
            cols="12">
            <v-btn
                color="blue-darken-1"
                variant="tonal"
                @click="onGenerateUrlClick()">
                Generate Url
            </v-btn>
        </v-col>
    </v-row>
    <v-row>
        <v-col
            cols="6">
            <v-text-field
                density="compact"
                :hide-details="true"
                label="Paragraph Count"
                type="number"
                :min="1"
                :max="50"
                v-model.number="placeholderStore.model.paragraphCount" />
        </v-col>
        <v-col
            cols="6">
            <v-text-field
                density="compact"
                :hide-details="true"
                label="Word Count"
                type="number"
                :min="1"
                :max="200"
                v-model.number="placeholderStore.model.wordCount" />
        </v-col>
    </v-row>
</template>

<script setup>
    import { usePlaceholderStore } from '@stores/placeholder';
    import { watch, computed, onMounted } from 'vue';
    import { useDebounce } from '@vueuse/core';
    import useLoremIpsum from '@cmp/loremIpsum';

    const placeholderStore = usePlaceholderStore();

    const paragraphCountRef = computed(() => placeholderStore.model.paragraphCount);
    const debouncedParagraphCountRef = useDebounce(paragraphCountRef, 300);

    watch(debouncedParagraphCountRef, (newVal) => {
        placeholderStore.set_syncStorage({ paragraphCount: newVal });
    });

    const wordCountRef = computed(() => placeholderStore.model.wordCount);
    const debouncedWordCountRef = useDebounce(wordCountRef, 300);

    watch(debouncedWordCountRef, (newVal) => {
        placeholderStore.set_syncStorage({ wordCount: newVal });
    });

    const { generateUrl, generateLoremIpsum } = useLoremIpsum();

    function onGenerateUrlClick() {
        placeholderStore.model.loremIpsumUrl = generateUrl();
    }

    watch([
        () => placeholderStore.model.paragraphCount,
        () => placeholderStore.model.wordCount,
    ], () => {
        placeholderStore.model.loremIpsumTxt = generateLoremIpsum(
            placeholderStore.model.paragraphCount,
            placeholderStore.model.wordCount,
        );
    });

    onMounted(() => {
        placeholderStore.model.loremIpsumUrl = generateUrl();

        placeholderStore.model.loremIpsumTxt = generateLoremIpsum(
            placeholderStore.model.paragraphCount,
            placeholderStore.model.wordCount,
        );
    });
</script>

<style scoped lang="scss">

</style>
