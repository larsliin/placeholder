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
                    v-model="placeholderStore.model.loremIpsumTxt"
                    :icon="mdiContentCopy"
                    :rows="9"
                    @click="onCopy($event)" />
                <div class="text-save-button-wrp">
                    <div>
                        <v-btn
                            class="pull-right"
                            color="blue-darken-1"
                            variant="flat"
                            :disabled="kbSize > 8"
                            @click="onSaveTextClick()">
                            Save Body Text
                        </v-btn>
                    </div>
                    <div class="err-msg"
                        :class="{ visible: kbSize > 8 }">
                        {{ kbSize }}KB (max 8KB)
                    </div>
                </div>
            </v-col>
        </v-row>
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
                    :icon="mdiContentCopy"
                    v-model="placeholderStore.model.loremIpsumUrl"
                    @click="onCopy($event)" />
                <div>
                    <v-btn
                        class="pull-right"
                        color="blue-darken-1"
                        variant="flat"
                        @click="onSaveUrlClick()">
                        Save Url
                    </v-btn>
                </div>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="view-footer" />
        </v-row>
    </v-container>
</template>

<script setup>
    import { EMITS, STORAGE } from '@/constants';
    import { mdiContentCopy } from '@mdi/js';
    import { useDebounce } from '@vueuse/core';
    import { usePlaceholderStore } from '@stores/placeholder';
    import { v4 as uuidv4 } from 'uuid';
    import { watch, computed, onMounted, ref } from 'vue';
    import TextareaField from '@/components/formFields/TextareaField.vue';
    import TextField from '@/components/formFields/TextField.vue';
    import useEventsBus from '@cmp/eventBus';
    import useLoremIpsum from '@cmp/loremIpsum';

    const placeholderStore = usePlaceholderStore();

    // Paragraph Count State and Sync with Storage
    // Watches and debounces paragraph count input, syncing with storage.
    const paragraphCountRef = computed(() => placeholderStore.model.paragraphCount);

    const debouncedParagraphCountRef = useDebounce(paragraphCountRef, 300);

    watch(debouncedParagraphCountRef, (newVal) => {
        placeholderStore.set_syncStorage({ [STORAGE.PARAGRAPH_COUNT]: newVal });
    });

    // Word Count State and Sync with Storage
    // Watches and debounces word count input, syncing with storage.
    const wordCountRef = computed(() => placeholderStore.model.wordCount);

    const debouncedWordCountRef = useDebounce(wordCountRef, 300);

    watch(debouncedWordCountRef, (newVal) => {
        placeholderStore.set_syncStorage({ [STORAGE.WORD_COUNT]: newVal });
    });

    // URL Generation and Text Update
    // Generates URL and updates lorem ipsum text when paragraph/word count changes.
    const { generateUrl, generateLoremIpsum } = useLoremIpsum();

    function onGenerateUrlClick() {
        placeholderStore.model.loremIpsumUrl = generateUrl();
    }

    watch(
        [() => placeholderStore.model.paragraphCount, () => placeholderStore.model.wordCount],
        () => {
            placeholderStore.model.loremIpsumTxt = generateLoremIpsum(
                placeholderStore.model.paragraphCount,
                placeholderStore.model.wordCount,
            );
        },
    );

    // Save Object Generation and Size Calculation
    // Creates save object with UUID and timestamp, calculates JSON size for storage limit.
    function generateSaveObj(text, tags) {
        const guid = uuidv4();
        const timestamp = Date.now();

        return { timestamp, guid, text, tags };
    }

    function getTxtTags() {
        return [
            {
                label: 'Type',
                value: STORAGE.TEXT,
            },
            {
                label: 'Word Count',
                value: placeholderStore.model.wordCount,
            },
            {
                label: 'Paragraph Count',
                value: placeholderStore.model.paragraphCount,
            },
        ];
    }

    const kbSize = ref(false);

    watch(
        () => placeholderStore.model.loremIpsumTxt,
        () => {
            const jsonString = JSON
                .stringify(getTxtTags());
            const size = new Blob([jsonString]).size / 1024;

            kbSize.value = Math.round(size * 100) / 100;
        },
        { immediate: true },
    );

    // Initial Setup on Component Mount
    // Initializes URL and lorem ipsum text with current paragraph/word count.
    onMounted(() => {
        placeholderStore.model.loremIpsumUrl = generateUrl();

        placeholderStore.model.loremIpsumTxt = generateLoremIpsum(
            placeholderStore.model.paragraphCount,
            placeholderStore.model.wordCount,
        );
    });

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
    async function save(txt, tags) {
        const savedObj = await placeholderStore.get_syncStorage(STORAGE.SAVED_ITEMS);

        try {
            const saveObj = generateSaveObj(txt, tags);
            await placeholderStore.set_syncStorage({ [saveObj.guid]: saveObj });

            const arr = savedObj ? [...savedObj, saveObj.guid] : [saveObj.guid];
            await placeholderStore.set_syncStorage({ [STORAGE.SAVED_ITEMS]: arr });

            placeholderStore.savedPlaceholders.push(saveObj);
        } catch (error) {
            emit(EMITS.COPY, { success: false });
        }
    }

    function onSaveUrlClick() {
        const tags = [{ label: 'Type', value: STORAGE.URL }];
        save(placeholderStore.model.loremIpsumUrl, tags);
    }

    function onSaveTextClick() {
        save(placeholderStore.model.loremIpsumTxt, getTxtTags());
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
