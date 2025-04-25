<template>
    <v-container>
        <v-row>
            <v-col cols="6">
                <v-row>
                    <v-col cols="12">
                        <div class="saved-list"
                            v-if="placeholderStore.savedPlaceholders.length">
                            <v-list>
                                <PlaceholderSavedItem
                                    v-for="item in sortedPlaceholders"
                                    :selected="placeholderStore.selectedSavedGuid === item.guid"
                                    :key="item.guid"
                                    :savedItem="item"
                                    @click="onItemClick(item)" />
                            </v-list>
                        </div>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="6">
                <template v-if="activeItemModel">
                    <!-- Text Preview Section - only shown for text or URL items -->
                    <template v-if="!isImageType">
                        <TextareaField
                            v-model="activeItemModel.text"
                            :icon="mdiContentCopy"
                            @click="onCopy($event)" />
                    </template>
                    
                    <!-- Image Preview Section - shown only for image type items -->
                    <template v-else>
                        <div class="placeholder-canvas-wrapper">
                            <PlaceholderImageCanvas />
                        </div>
                        <div class="text-right mt-3">
                            <v-btn
                                color="blue-darken-1"
                                variant="flat"
                                @click="onDownloadClick()">
                                DOWNLOAD
                            </v-btn>
                        </div>
                    </template>
                </template>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
    import { EMITS, STORAGE, PLACEHOLDER } from '@/constants';
    import { mdiContentCopy } from '@mdi/js';
    import { ref, watch, computed, onMounted } from 'vue';
    import { usePlaceholderStore } from '@stores/placeholder';
    import PlaceholderSavedItem from '@/components/saved/PlaceholderSavedItem.vue';
    import TextareaField from '@/components/formFields/TextareaField.vue';
    import PlaceholderImageCanvas from '@/components/image/PlaceholderImageCanvas.vue';
    import useEventsBus from '@cmp/eventBus';

    const placeholderStore = usePlaceholderStore();
    const activeItemModel = ref();

    // Computed property to check if active item is an image type
    const isImageType = computed(() => {
        if (!activeItemModel.value || !Array.isArray(activeItemModel.value.tags)) {
            return false;
        }
        return activeItemModel.value.tags.some(
            (tag) => tag.label === 'Type' && tag.value === 'image',
        );
    });

    // Computed property to sort placeholders in descending order by timestamp
    const sortedPlaceholders = computed(() => [...placeholderStore.savedPlaceholders].sort((a, b) => b.timestamp - a.timestamp, // Descending order (newest first)
    ));

    function onItemClick(item) {
        activeItemModel.value = item;
        placeholderStore.selectedSavedGuid = item.guid;
        placeholderStore.set_syncStorage({ [STORAGE.SELECTED_SAVED_ITEM]: item.guid });

        // For image type items, update the model properties to match the saved item
        if (isImageType.value) {
            // Extract size from tags
            const sizeTag = item.tags.find((tag) => tag.label === 'Size');
            if (sizeTag && sizeTag.value) {
                const dimensions = sizeTag.value.split('x');
                if (dimensions.length === 2) {
                    placeholderStore.model.imageWidth = parseInt(dimensions[0]);
                    placeholderStore.model.imageHeight = parseInt(dimensions[1]);
                }
            }

            // Set color
            placeholderStore.model.color = item.color || '#ffffff';
        }
    }

    const { emit } = useEventsBus();

    function onCopy(event) {
        navigator.clipboard.writeText(event).then(() => {
            emit(EMITS.COPY, { success: true });
        }).catch(() => {
            emit(EMITS.COPY, { success: false });
        });
    }

    function onDownloadClick() {
        if (!isImageType.value || !activeItemModel.value) return;

        const image = placeholderStore.canvas.toDataURL(activeItemModel.value.mimetype || 'image/png');
        const fileExtension = (activeItemModel.value.mimetype || 'image/png').split('/')[1];
        const link = document.createElement('a');
        const colorStr = activeItemModel.value.color.toLowerCase().replace(/^#/, '');

        // Get dimensions from the model which has been updated to match the selected item
        const width = placeholderStore.model.imageWidth;
        const height = placeholderStore.model.imageHeight;

        link.href = image;
        link.download = `placeholder-${width}-${height}-${colorStr}.${fileExtension}`;
        link.click();
    }

    watch(
        [
            () => placeholderStore.savedPlaceholders,
            () => placeholderStore.selectedSavedGuid,
        ],
        (newVal) => {
            try {
                if (newVal && newVal[0]?.length) {
                    placeholderStore.selectedSavedGuid = placeholderStore.selectedSavedGuid
                        || placeholderStore.savedPlaceholders[0]?.guid;

                    activeItemModel.value = placeholderStore.savedPlaceholders
                        .find((e) => e.guid === placeholderStore.selectedSavedGuid) || null;

                    // Update model properties for the selected image if it's an image type
                    if (isImageType.value && activeItemModel.value) {
                        // Same code as in onItemClick to update model properties
                        const item = activeItemModel.value;
                        const sizeTag = item.tags.find((tag) => tag.label === 'Size');
                        if (sizeTag && sizeTag.value) {
                            const dimensions = sizeTag.value.split('x');
                            if (dimensions.length === 2) {
                                placeholderStore.model.imageWidth = parseInt(dimensions[0]);
                                placeholderStore.model.imageHeight = parseInt(dimensions[1]);
                            }
                        }

                        // Set color
                        placeholderStore.model.color = item.color || '#ffffff';
                    }
                }
            } catch (error) {
                console.error(error);
            }
        },
        {
            immediate: true,
        },
    );

</script>

<style scoped lang="scss">
.saved-list {
    height: 420px;
    overflow: auto;
}

.placeholder-canvas-wrapper {
    height: 250px;
    width: 100%;
}
</style>
