<template>
    <v-container>
        <v-row>
            <v-col cols="6">
                <v-btn
                    color="blue-darken-1"
                    variant="tonal"
                    @click="onGenerateUrlClick()">
                    Generate Url
                </v-btn>
            </v-col>
            <v-col cols="6">
                <TextField
                    v-if="placeholderStore.model.loremIpsumUrl"
                    :icon="mdiContentCopy"
                    v-model="placeholderStore.model.loremIpsumUrl"
                    @click="onUrlCopyClick($event)" />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="6">
                <v-row>
                    <v-col cols="6">
                        <v-text-field
                            density="compact"
                            :hide-details="true"
                            label="Paragraph Count"
                            type="number"
                            :min="1"
                            :max="50"
                            v-model.number="placeholderStore.model.paragraphCount" />
                    </v-col>
                    <v-col cols="6">
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
            </v-col>
            <v-col cols="6">
                <TextareaField
                    v-if="placeholderStore.model.loremIpsumTxt"
                    v-model="placeholderStore.model.loremIpsumTxt"
                    @click="onParagraphCopyClick($event)" />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
    import { usePlaceholderStore } from '@stores/placeholder';
    import { watch, computed, onMounted } from 'vue';
    import { useDebounce } from '@vueuse/core';
    import useLoremIpsum from '@cmp/loremIpsum';
    import { EMITS } from '@/constants';
    import useEventsBus from '@cmp/eventBus';
    import { mdiContentCopy } from '@mdi/js';
    import TextField from '@/components/formFields/textField.vue';
    import TextareaField from '@/components/formFields/textareaField.vue';

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

    //

    const { emit } = useEventsBus();

    function onParagraphCopyClick(event) {
        navigator.clipboard.writeText(event).then(() => {
            emit(EMITS.COPY, { success: true });
        }).catch(() => {
            emit(EMITS.COPY, { success: false });
        });
    }

    function onUrlCopyClick(event) {
        navigator.clipboard.writeText(event).then(() => {
            emit(EMITS.COPY, { success: true });
        }).catch(() => {
            emit(EMITS.COPY, { success: false });
        });
    }
</script>

<style scoped lang="scss">
.output-paragraph {
    :deep(textarea){
        font-size: 14px;
    }
}

</style>
