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
            ref="textarea"
            :rows="rows"
            no-resize
            density="compact"
            spellcheck="false"
            v-model="vModel"
            @focus="$emit(EMITS.FOCUS)"
            @blur="$emit(EMITS.BLUR)"
            :flat="true" />
    </div>
</template>

<script setup>
    import { EMITS } from '@/constants';
    import { nextTick, ref, watch, onMounted } from 'vue';

    defineProps({
        icon: {
            type: String,
            required: false,
            default: '',
        },
        rows: {
            type: Number,
            required: false,
            default: 10,
        },
    });

    const vModel = defineModel({ type: String, required: true, default: '' });

    defineEmits([
        EMITS.CLICK,
        EMITS.FOCUS,
        EMITS.BLUR,
    ]);

    const textarea = ref();
    const textareaPaddingRight = ref(0);
    const buttonRight = ref(0);

    async function setScrollBarOffset() {
        await nextTick();

        const textareaElem = textarea.value.$el.querySelector('textarea');
        const scrollbarWidth = textareaElem.offsetWidth - textareaElem.clientWidth;
        textareaPaddingRight.value = `${50 - (scrollbarWidth ? scrollbarWidth - 5 : 0)}px`;

        buttonRight.value = `${(scrollbarWidth ? 0 : 5) + scrollbarWidth}px`;
    }
    onMounted(() => {
        setScrollBarOffset();
    });

    watch(vModel, async () => {
        setScrollBarOffset();
    });
</script>

<style scoped lang="scss">
.output-paragraph {
    :deep(textarea){
        font-size: 14px;
        padding-right: v-bind(textareaPaddingRight);
    }
}
.container {
    position: relative;

    .icon-button {
        position: absolute;
        right: v-bind(buttonRight);
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
