<template>
    <div class="output-container">
        <v-row>
            <v-col
                cols="12">
                <TextField
                    v-if="placeholderStore.model.loremIpsumUrl"
                    :icon="mdiContentCopy"
                    v-model="placeholderStore.model.loremIpsumUrl"
                    @click="onUrlCopyClick($event)" />
            </v-col>
        </v-row>
        <v-row>
            <v-col
                cols="12">
                <TextareaField
                    v-if="placeholderStore.model.loremIpsumTxt"
                    v-model="placeholderStore.model.loremIpsumTxt"
                    @click="onParagraphCopyClick($event)" />
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
    import { usePlaceholderStore } from '@stores/placeholder';
    import { EMITS } from '@/constants';
    import useEventsBus from '@cmp/eventBus';
    import { mdiContentCopy } from '@mdi/js';
    import TextField from '@/components/formFields/textField.vue';
    import TextareaField from '@/components/formFields/textareaField.vue';

    const placeholderStore = usePlaceholderStore();

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
