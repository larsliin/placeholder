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
            <v-col>
                <v-btn
                    class="pull-right"
                    color="blue-darken-1"
                    variant="flat"
                    @click="onSaveClick()">
                    Save
                </v-btn>
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
    import { v4 as uuidv4 } from 'uuid';

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

    const { emit } = useEventsBus();

    function onCopy(event) {
        navigator.clipboard.writeText(event).then(() => {
            emit(EMITS.COPY, { success: true });
        }).catch(() => {
            emit(EMITS.COPY, { success: false });
        });
    }

    async function onSaveClick() {
        const savedObj = await placeholderStore.get_syncStorage('saved');

        const guid = uuidv4();
        const arr = savedObj ? [...savedObj, guid] : [guid];

        placeholderStore.set_syncStorage({ saved: arr });

        const timestamp = Date.now();

        const item = {
            timestamp,
            text: placeholderStore.model.loremIpsumTxt,
            url: placeholderStore.model.loremIpsumUrl,
        };
        placeholderStore.set_syncStorage({
            [guid]: item,
        });

        placeholderStore.savedPlaceholders.push(item);
    }
</script>

<style scoped lang="scss">
.output-paragraph {
    :deep(textarea){
        font-size: 14px;
    }
}

</style>
