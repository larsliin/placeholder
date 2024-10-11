<template>
    <div class="placeholder-container">
        <PlaceholderText />
    </div>
    <v-icon
        v-if="showSuccess"
        class="feedback-blink green"
        size="80"
        :icon="mdiCheckCircle" />
    <v-icon
        v-if="showError"
        class="feedback-blink red"
        size="80"
        :icon="mdiAlertCircle" />
</template>

<script setup>
    import { mdiCheckCircle, mdiAlertCircle } from '@mdi/js';
    import useEventsBus from '@cmp/eventBus';
    import { watch, ref, nextTick } from 'vue';
    import { EMITS } from '@/constants';
    import PlaceholderText from '@/components/text/PlaceholderText.vue';

    const { bus } = useEventsBus();

    const showSuccess = ref(false);
    const showError = ref(false);

    watch(() => bus.value.get(EMITS.COPY), async (args) => {
        if (args[0].success) {
            showSuccess.value = false;

            await nextTick();

            showSuccess.value = true;
        } else {
            showError.value = false;

            await nextTick();

            showError.value = true;
        }
    });
</script>

<style scoped lang="scss">
.feedback-blink {
    animation: fadeOut 1.5s ease forwards;
    height: 20px;
    left: 50%;
    line-height: 0;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 9;

    &.green {
        color: green;
    }

    &.red {
        color: red;
    }
}

@keyframes fadeOut {
    0% {
        opacity: 0;
    }
    5% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}
</style>
