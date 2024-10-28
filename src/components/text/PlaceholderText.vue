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
                    @click="onCopy($event)" />
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
            </v-col>
        </v-row>
        <v-row>
            <v-col class="view-footer">
                <div>
                    <v-btn
                        class="pull-right"
                        color="blue-darken-1"
                        variant="flat"
                        :disabled="kbSize > 8"
                        @click="onSaveClick()">
                        Save
                    </v-btn>
                </div>
                <div class="err-msg"
                    v-if="kbSize > 8">{{ kbSize }}KB (max 8KB)</div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
    import { EMITS, STORAGE } from '@/constants';
    import { mdiContentCopy } from '@mdi/js'; // https://pictogrammers.com/library/mdi/
    import { useDebounce } from '@vueuse/core';
    import { usePlaceholderStore } from '@stores/placeholder';
    import { v4 as uuidv4 } from 'uuid';
    import { watch, computed, onMounted, ref } from 'vue';
    import TextareaField from '@/components/formFields/textareaField.vue';
    import TextField from '@/components/formFields/textField.vue';
    import useEventsBus from '@cmp/eventBus';
    import useLoremIpsum from '@cmp/loremIpsum';

    const placeholderStore = usePlaceholderStore();

    const paragraphCountRef = computed(() => placeholderStore.model.paragraphCount);
    const debouncedParagraphCountRef = useDebounce(paragraphCountRef, 300);

    watch(debouncedParagraphCountRef, (newVal) => {
        placeholderStore.set_syncStorage({ [STORAGE.PARAGRAPH_COUNT]: newVal });
    });

    const wordCountRef = computed(() => placeholderStore.model.wordCount);
    const debouncedWordCountRef = useDebounce(wordCountRef, 300);

    watch(debouncedWordCountRef, (newVal) => {
        placeholderStore.set_syncStorage({ [STORAGE.WORD_COUNT]: newVal });
    });

    const { generateUrl, generateLoremIpsum } = useLoremIpsum();

    function onGenerateUrlClick() {
        placeholderStore.model.loremIpsumUrl = generateUrl();
    }

    const saveObj = ref();

    const kbSize = ref(false);

    watch(
        [
            () => placeholderStore.model.paragraphCount,
            () => placeholderStore.model.wordCount,
        ],
        () => {
            placeholderStore.model.loremIpsumTxt = generateLoremIpsum(
                placeholderStore.model.paragraphCount,
                placeholderStore.model.wordCount,
            );
        },
    );

    function generateSaveObj() {
        // Generate a unique identifier (UUID) for the new item
        // and capture the current timestamp in milliseconds.
        const guid = uuidv4();
        const timestamp = Date.now();

        saveObj.value = {
            timestamp,
            guid,
            text: placeholderStore.model.loremIpsumTxt,
            url: placeholderStore.model.loremIpsumUrl,
        };
    }

    watch(
        [
            () => placeholderStore.model.loremIpsumTxt,
            () => placeholderStore.model.loremIpsumUrl,
        ],
        () => {
            generateSaveObj();

            // storage item max 8 kb
            const jsonString = JSON.stringify(saveObj.value);
            const size = new Blob([jsonString]).size / 1024;
            kbSize.value = Math.round(size * 100) / 100;
        },
        {
            immediate: true,
        },
    );

    onMounted(() => {
        placeholderStore.model.loremIpsumUrl = generateUrl();

        placeholderStore.model.loremIpsumTxt = generateLoremIpsum(
            placeholderStore.model.paragraphCount,
            placeholderStore.model.wordCount,
        );
    });

    const { emit } = useEventsBus();

    function onCopy(event) {
        navigator.clipboard.writeText(event).then(() => {
            emit(EMITS.COPY, { success: true });
        }).catch(() => {
            emit(EMITS.COPY, { success: false });
        });
    }

    async function onSaveClick() {
        // Retrieve the current 'saved' array from sync storage asynchronously.
        const savedObj = await placeholderStore.get_syncStorage(STORAGE.SAVED_ITEMS);

        try {
            // Attempt to save the new item to sync storage using its UUID as the key.
            await placeholderStore.set_syncStorage({
                [saveObj.value.guid]: saveObj.value,
            });

            // Proceed only if the first set_syncStorage call succeeds.
            const arr = savedObj ? [...savedObj, saveObj.value.guid] : [saveObj.value.guid];
            await placeholderStore.set_syncStorage({ [STORAGE.SAVED_ITEMS]: arr });

            // Add the new item to the local 'savedPlaceholders' array in the placeholder store.
            placeholderStore.savedPlaceholders.push(saveObj.value);

            generateSaveObj();
        } catch (error) {
            // Emit a failure event if any error occurs.
            emit(EMITS.COPY, { success: false });
        }
    }

</script>

<style scoped lang="scss">
.output-paragraph {
    :deep(textarea){
        font-size: 14px;
    }
}

.view-footer {
    display: flex;
    flex-direction: column;
}
.err-msg {
    color: rgb(var(--v-theme-error));
    font-size: 12px;
    text-align: right;
    margin-top: 4px;
}
</style>
