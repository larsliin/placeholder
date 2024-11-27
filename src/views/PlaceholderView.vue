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
                    :disabled="tab.id === PLACEHOLDER.TABS[2].id
                        && !placeholderStore.savedPlaceholders.length">
                    {{ tab.label }}
                    <span
                        v-if="tab.id === PLACEHOLDER.TABS[2].id">
                        ({{ placeholderStore.savedPlaceholders.length }})
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
    import { STORAGE, PLACEHOLDER, EMITS } from '@/constants';
    import PlaceholderImageView from '@/views/PlaceholderImageView.vue';
    import PlaceholderTextView from '@/views/PlaceholderTextView.vue';
    import PlaceholderSavedView from '@/views/PlaceholderSavedView.vue';
    import { ref, onMounted, watch, nextTick } from 'vue';
    import { usePlaceholderStore } from '@stores/placeholder';
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

    const tab = ref();

    watch(() => bus.value.get(EMITS.UPDATE_TAB), async (args) => {
        tab.value = args[0].id;
    });

    const ready = ref(false);

    const placeholderStore = usePlaceholderStore();

    async function fetchSettings() {
        try {
            // Load both images and wait for them to be loaded
            const [
                tabId,
                color,
                width,
                height,
                mimetype,
                wordCount,
                paragraphCount,
                prefixLoremIpsum,
                selected,
            ] = await Promise.all([
                placeholderStore.get_syncStorage(STORAGE.TAB),
                placeholderStore.get_syncStorage(STORAGE.IMAGE_COLOR),
                placeholderStore.get_syncStorage(STORAGE.IMAGE_WIDTH),
                placeholderStore.get_syncStorage(STORAGE.IMAGE_HEIGHT),
                placeholderStore.get_syncStorage(STORAGE.IMAGE_MIMETYPE),
                placeholderStore.get_syncStorage(STORAGE.WORD_COUNT),
                placeholderStore.get_syncStorage(STORAGE.PARAGRAPH_COUNT),
                placeholderStore.get_syncStorage(STORAGE.PREFIX_LOREM_IPSUM),
                placeholderStore.get_syncStorage(STORAGE.SELECTED_SAVED_ITEM),
            ]);
            placeholderStore.model.body = {};
            placeholderStore.model.url = {};

            tab.value = tabId || PLACEHOLDER.TABS[0].id;
            placeholderStore.selectedSavedGuid = selected || null;
            placeholderStore.model.imageWidth = width || PLACEHOLDER.CANVAS.width;
            placeholderStore.model.imageHeight = height || PLACEHOLDER.CANVAS.height;
            placeholderStore.model.color = color || PLACEHOLDER.CANVAS.swatches[0][0];
            placeholderStore.model.mimetype = mimetype || PLACEHOLDER.MIME_TYPES[0].value;

            placeholderStore.model.body.prefixLoremIpsum = !!prefixLoremIpsum;
            placeholderStore.model.body.wordCount = wordCount || PLACEHOLDER.TEXT.wordCount;
            placeholderStore.model.body.paragraphCount = paragraphCount
                || PLACEHOLDER.TEXT.paragraphCount;

            ready.value = true;
        } catch (error) {
            console.error(error);
        }
    }

    async function fetchSaved() {
        try {
            const savedListResp = await placeholderStore.get_syncStorage(STORAGE.SAVED_ITEMS);

            if (!savedListResp) {
                return;
            }

            Promise.all(savedListResp.map((id) => placeholderStore.get_syncStorage(id)))
                .then((results) => {
                    if (results.length) {
                        const arr = results.sort((a, b) => a.timestamp - b.timestamp);
                        placeholderStore.savedPlaceholders = arr;
                    }
                })
                .catch((error) => {
                    console.error('Error loading sync storage items:', error);
                });
        } catch (error) {
            console.error(error);
        }
    }

    onMounted(() => {
        fetchSettings();
        fetchSaved();
    });

    watch(tab, () => {
        placeholderStore.set_syncStorage({ [STORAGE.TAB]: tab.value });
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
