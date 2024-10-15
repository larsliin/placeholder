<template>
    <v-textarea
        rows="10"
        density="compact"
        spellcheck="false"
        class="output-paragraph"
        v-model="vModel"
        :flat="true" />
    <v-btn
        color="blue-darken-1"
        variant="tonal"
        @click="$emit(EMITS.CLICK, vModel)">
        COPY
    </v-btn>
</template>

<script setup>
    import { EMITS } from '@/constants';

    const vModel = defineModel({ type: String, required: true });

    defineEmits([
        EMITS.CLICK,
    ]);

</script>

<style scoped lang="scss">
.output-paragraph {
    :deep(textarea){
        font-size: 14px;
    }
}

</style>
