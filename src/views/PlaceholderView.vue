<template>
    <div class="container">
        <template v-if="ready">
            <v-tabs
                v-model="tab"
                color="primary"
                grow>
                <v-tab
                    v-for="tab in PLACEHOLDER.TABS"
                    :key="tab.id"
                    :value="tab.id"
                    :disabled="tab.id === PLACEHOLDER.TABS[2].id && !placeholderStore.savedTotal">
                    {{ tab.label }}
                    <span
                        v-if="tab.id === PLACEHOLDER.TABS[2].id">
                        ({{ placeholderStore.savedTotal }})
                    </span>
                </v-tab>
            </v-tabs>
            <PlaceholderImageView v-if="tab === PLACEHOLDER.TABS[0].id" />
            <PlaceholderTextView v-if="tab === PLACEHOLDER.TABS[1].id" />
            <PlaceholderSavedView v-if="tab === PLACEHOLDER.TABS[2].id" />
        </template>
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
    </div>
</template>

<script setup>
    import PlaceholderImageView from '@/views/PlaceholderImageView.vue';
    import PlaceholderTextView from '@/views/PlaceholderTextView.vue';
    import PlaceholderSavedView from '@/views/PlaceholderSavedView.vue';
    import { ref, onMounted, watch, nextTick } from 'vue';
    import { usePlaceholderStore } from '@stores/placeholder';
    import { PLACEHOLDER, EMITS } from '@/constants';
    import { mdiCheckCircle, mdiAlertCircle } from '@mdi/js';
    import useEventsBus from '@cmp/eventBus';

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

    const ready = ref(false);
    const tab = ref();

    const placeholderStore = usePlaceholderStore();

    onMounted(async () => {
        try {
            // Load both images and wait for them to be loaded
            const [
                tabId,
                color,
                width,
                height,
                mimetype,
                wordCount,
                paragraphCount] = await Promise.all([
                    placeholderStore.get_syncStorage('tabId'),
                    placeholderStore.get_syncStorage('color'),
                    placeholderStore.get_syncStorage('width'),
                    placeholderStore.get_syncStorage('height'),
                    placeholderStore.get_syncStorage('mimetype'),
                    placeholderStore.get_syncStorage('wordCount'),
                    placeholderStore.get_syncStorage('paragraphCount'),
                ]);

            tab.value = tabId || PLACEHOLDER.TABS[0].id;
            placeholderStore.model.imageWidth = width || PLACEHOLDER.CANVAS.width;
            placeholderStore.model.imageHeight = height || PLACEHOLDER.CANVAS.height;
            placeholderStore.model.color = color || PLACEHOLDER.CANVAS.swatches[0][0];
            placeholderStore.model.mimetype = mimetype || PLACEHOLDER.MIME_TYPES[0].value;

            placeholderStore.model.wordCount = wordCount || PLACEHOLDER.TEXT.wordCount;
            placeholderStore.model.paragraphCount = paragraphCount
                || PLACEHOLDER.TEXT.paragraphCount;

            ready.value = true;
        } catch (error) {
            console.error(error);
        }

        const savedLoremIpsumResp = await placeholderStore.get_syncStorage('saved');
        placeholderStore.savedTotal = savedLoremIpsumResp ? savedLoremIpsumResp.length : 0;
    });

    watch(tab, () => {
        placeholderStore.set_syncStorage({ tabId: tab.value });
    });
</script>

<style scoped lang="scss">
.container {
    height: 500px;
    position: relative;
    width: 760px;
}

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
