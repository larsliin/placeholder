<template>
    <v-container>
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
                            v-model.number="placeholderStore.model.body.paragraphCount" />
                    </v-col>
                    <v-col cols="6">
                        <v-text-field
                            density="compact"
                            :hide-details="true"
                            label="Word Count"
                            type="number"
                            :min="1"
                            :max="200"
                            v-model.number="placeholderStore.model.body.wordCount" />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-checkbox
                            v-model="placeholderStore.model.body.prefixLoremIpsum"
                            label="Prefix Lorem Ipsum" />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-btn
                            color="blue-darken-1"
                            variant="tonal"
                            @click="onGenerateUrlClick()">
                            Generate Url
                        </v-btn>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="6">
                <TextareaField
                    v-model="output"
                    :icon="mdiContentCopy"
                    :rows="9"
                    @focus="onTextFieldFocus()"
                    @blur="onTextFieldFocus()"
                    @click="onCopy($event)" />
            </v-col>
        </v-row>
        <v-row>
            <v-col class="view-footer">
                <div class="text-save-button-wrp">
                    <div>
                        <v-btn
                            class="pull-right"
                            color="blue-darken-1"
                            variant="flat"
                            :disabled="kbSize >= 8"
                            @click="save(placeholderStore.model.body)">
                            Save
                        </v-btn>
                    </div>
                    <div class="err-msg"
                        :class="{ visible: kbSize >= 8 }">
                        {{ kbSize }}KB (8KB limit exceeded)
                    </div>
                </div>

            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
    import { EMITS, STORAGE } from '@/constants';
    import { generateLoremIpsum, generateUrl } from '@/shared/utils/loremIpsum';
    import { mdiContentCopy } from '@mdi/js';
    import { useDebounce } from '@vueuse/core';
    import { usePlaceholderStore } from '@stores/placeholder';
    import { v4 as uuidv4 } from 'uuid';
    import { watch, computed, ref, toRaw } from 'vue';
    import TextareaField from '@/components/formFields/TextareaField.vue';
    import useEventsBus from '@cmp/eventBus';

    const placeholderStore = usePlaceholderStore();

    // Paragraph Count State and Sync with Storage
    // Watches and debounces paragraph count input, syncing with storage.
    const paragraphCountRef = computed(() => placeholderStore.model.body.paragraphCount);

    const debouncedParagraphCountRef = useDebounce(paragraphCountRef, 300);

    watch(debouncedParagraphCountRef, (newVal) => {
        placeholderStore.set_syncStorage({ [STORAGE.PARAGRAPH_COUNT]: newVal });
    });

    // Word Count State and Sync with Storage
    // Watches and debounces word count input, syncing with storage.
    const wordCountRef = computed(() => placeholderStore.model.body.wordCount);

    const debouncedWordCountRef = useDebounce(wordCountRef, 300);

    watch(debouncedWordCountRef, (newVal) => {
        placeholderStore.set_syncStorage({ [STORAGE.WORD_COUNT]: newVal });
    });

    // URL Generation and Text Update
    // Generates URL and updates lorem ipsum text when paragraph/word count changes.
    const output = ref('');

    function onGenerateUrlClick() {
        output.value = generateUrl();
        placeholderStore.model.body.text = output.value;

        placeholderStore.model.body.guid = uuidv4();
        placeholderStore.model.body.timestamp = Date.now();
        placeholderStore.model.body.tags = [
            {
                label: 'Type',
                value: STORAGE.URL,
            },
        ];
    }

    function countWordsAndParagraphs(text) {
        // Count paragraphs (split by two or more newlines)
        const paragraphs = text.trim().split(/\n\s*\n/).filter((p) => p.length > 0);
        const paragraphCount = paragraphs.length;

        // Count words (split by whitespace)
        const words = text.trim().split(/\s+/).filter((word) => word.length > 0);
        const wordCount = words.length / paragraphCount;

        return {
            wordCount,
            paragraphCount,
        };
    }

    // Watches checkbox prefix Lorem Ipsum
    watch(() => placeholderStore.model.body.prefixLoremIpsum, (newVal) => {
        placeholderStore.set_syncStorage({ [STORAGE.PREFIX_LOREM_IPSUM]: newVal });
    });

    // Save Object Generation and Size Calculation
    // Creates save object with UUID and timestamp, calculates JSON size for storage limit.
    const kbSize = ref(false);

    watch(
        [
            () => placeholderStore.model.body.prefixLoremIpsum,
            () => placeholderStore.model.body.paragraphCount,
            () => placeholderStore.model.body.wordCount,
        ],
        () => {
            output.value = generateLoremIpsum(
                placeholderStore.model.body.paragraphCount,
                placeholderStore.model.body.wordCount,
                placeholderStore.model.body.prefixLoremIpsum,
            );
            placeholderStore.model.body.text = output.value;

            const counter = countWordsAndParagraphs(placeholderStore.model.body.text);

            // update model object
            placeholderStore.model.body.guid = uuidv4();
            placeholderStore.model.body.timestamp = Date.now();
            placeholderStore.model.body.tags = [
                {
                    label: 'Type',
                    value: STORAGE.TEXT,
                },
                {
                    label: 'Paragraphs',
                    value: counter.paragraphCount,
                },
                {
                    label: 'Words',
                    value: counter.wordCount,
                },
            ];

            // calculate size
            const jsonString = JSON
                .stringify(placeholderStore.model.body);
            const size = new Blob([jsonString]).size / 1024;
            kbSize.value = Math.round(size * 100) / 100;
        },
        { immediate: true },
    );

    // Clipboard Copy Function
    // Copies the specified text to clipboard, emits success/failure event.
    const { emit } = useEventsBus();

    function onCopy(event) {
        navigator.clipboard.writeText(event)
            .then(() => emit(EMITS.COPY, { success: true }))
            .catch(() => emit(EMITS.COPY, { success: false }));
    }

    // Save Text Click Handler
    // Saves generated text to storage, updates saved items list in storage
    async function save(saveObj) {
        const savedObj = await placeholderStore.get_syncStorage(STORAGE.SAVED_ITEMS);

        try {
            placeholderStore.savedPlaceholders.push(toRaw({ ...saveObj }));
            await placeholderStore.set_syncStorage({ [saveObj.guid]: saveObj });

            const arr = savedObj ? [...savedObj, saveObj.guid] : [saveObj.guid];
            await placeholderStore.set_syncStorage({ [STORAGE.SAVED_ITEMS]: arr });

            saveObj.guid = uuidv4();
        } catch (error) {
            console.error(error);
            emit(EMITS.COPY, { success: false });
        }
    }
    // eslint-disable-next-line
    function onTextFieldFocus(params) {
    }
</script>

<style scoped lang="scss">
.output-paragraph {
    :deep(textarea){
        font-size: 14px;
    }
}

.text-save-button-wrp {
    display: flex;
    flex-direction: column;
}
.err-msg {
    color: rgb(var(--v-theme-error));
    font-size: 12px;
    text-align: right;
    margin-top: 4px;
    visibility: hidden;

    &.visible {
        visibility: visible;
    }
}
</style>
