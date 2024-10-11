<template>
    <div class="output-container">
        <v-row>
            <v-col
                cols="12">
                <v-text-field
                    density="compact"
                    :append-inner-icon="mdiContentCopy"
                    @click:append-inner="onUrlCopyClick()"
                    v-model="placeholderStore.model.loremIpsumUrl" />
            </v-col>
        </v-row>
        <v-row>
            <v-col
                cols="12">
                <v-textarea
                    rows="10"
                    density="compact"
                    spellcheck="false"
                    class="output-paragraph"
                    v-model="placeholderStore.model.loremIpsumTxt"
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
    import { EMITS } from '@/constants';
    import useEventsBus from '@cmp/eventBus';
    import { mdiContentCopy } from '@mdi/js';

    const placeholderStore = usePlaceholderStore();

    const { emit } = useEventsBus();

    function onCopyClick() {
        navigator.clipboard.writeText(placeholderStore.model.loremIpsumTxt).then(() => {
            emit(EMITS.COPY, { success: true });
        }).catch(() => {
            emit(EMITS.COPY, { success: false });
        });
    }

    function onUrlCopyClick() {
        navigator.clipboard.writeText(placeholderStore.model.loremIpsumUrl).then(() => {
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
