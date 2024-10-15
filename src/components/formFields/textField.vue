<template>
    <v-text-field
        density="compact"
        :append-inner-icon="icon"
        v-model="vModel"
        @click:append-inner="$emit(EMITS.CLICK, vModel)" />
</template>

<script setup>
    import { EMITS } from '@/constants';

    defineProps({
        icon: {
            type: String,
            required: true,
        },
    });

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
