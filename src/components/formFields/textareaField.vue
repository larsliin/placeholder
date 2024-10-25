<template>
    <div class="container">
        <button
            class="icon-button"
            type="button"
            @click="$emit(EMITS.CLICK, vModel)">
            <v-icon :icon="icon" :size="24" class="icon" />
        </button>
        <v-textarea
            class="output-paragraph"
            rows="10"
            no-resize
            density="compact"
            spellcheck="false"
            v-model="vModel"
            :flat="true" />
    </div>
</template>

<script setup>
    import { EMITS } from '@/constants';

    defineProps({
        icon: {
            type: String,
            required: false,
            default: '',
        },
    });

    const vModel = defineModel({ type: String, required: true, default: '' });

    defineEmits([
        EMITS.CLICK,
    ]);

</script>

<style scoped lang="scss">
.output-paragraph {
    :deep(textarea){
        font-size: 14px;
        padding-right: 30px;
    }
}
.container {
    position: relative;

    .icon-button {
        position: absolute;
        right: 15px;
        top: 7px;
        z-index: 1;
        padding: 5px;

        &:hover {
            cursor: pointer;
        }

        .icon {
            opacity: .6;

        }
    }
}
</style>
