<template>
    <v-list-item
        v-if="savedItem"
        :active="selected"
        @click="$emit(EMITS.CLICK, savedItem)">
        <template v-slot:prepend v-if="isImageType">
            <div class="thumbnail-container">
                <canvas ref="thumbnailCanvas" class="thumbnail-canvas"></canvas>
            </div>
        </template>
        <template v-slot:title>
            {{ savedItem.text }}
        </template>
        <template v-slot:subtitle>
            <ul class="tags">
                <li v-for="(tag, index) in savedItem.tags" :key="index">
                    <v-chip size="small"
                        color="#020b63">
                        {{ tag.label }}: {{ tag.value }}
                    </v-chip>
                </li>
            </ul>
        </template>
        <template v-slot:append>
            <v-btn
                color="grey-darken-1"
                :icon="mdiTrashCanOutline"
                variant="text"
                size="small"
                @click="onDeleteClick()" />
        </template>
    </v-list-item>
</template>

<script setup>
    import { EMITS, STORAGE, PLACEHOLDER } from '@/constants';
    import { mdiTrashCanOutline } from '@mdi/js'; // https://pictogrammers.com/library/mdi/
    import { usePlaceholderStore } from '@stores/placeholder';
    import useEventsBus from '@cmp/eventBus';
    import { ref, computed, onMounted, watch } from 'vue';
    import { isHexBelow50Percent } from '@/shared/utils/colors';

    const { emit } = useEventsBus();
    const placeholderStore = usePlaceholderStore();
    const thumbnailCanvas = ref(null);
    const imgBlack = ref(null);
    const imgWhite = ref(null);

    const props = defineProps({
        savedItem: {
            type: Object,
            required: true,
        },
        selected: {
            type: Boolean,
            default: false,
        },
    });

    // Determine if the item is an image type
    const isImageType = computed(() => {
        if (!props.savedItem || !Array.isArray(props.savedItem.tags)) {
            return false;
        }
        return props.savedItem.tags.some(
            (tag) => tag.label === 'Type' && tag.value === 'image',
        );
    });

    // Calculate image ratio dimensions for SVG placeholder icon
    function getImageDims(img, containerWidth, containerHeight) {
        const containerRatio = containerWidth / containerHeight;
        const imageWidth = img.width;
        const imageHeight = img.height;
        let width; let
            height;

        if (containerRatio < 1) {
            width = containerWidth;
            height = (imageHeight / imageWidth) * containerWidth;
        } else {
            width = (imageWidth / imageHeight) * containerHeight;
            height = containerHeight;
        }

        width /= 2;
        height /= 2;

        return { width, height };
    }

    // Draw the canvas thumbnail for image preview
    function drawThumbnailCanvas() {
        if (!thumbnailCanvas.value || !isImageType.value || !props.savedItem) return;

        const ctx = thumbnailCanvas.value.getContext('2d');
        const width = 50; // Small thumbnail width
        const height = 40; // Small thumbnail height
        const color = props.savedItem.color || '#ffffff';
        const isColorDark = isHexBelow50Percent(color);

        // Set canvas dimensions
        thumbnailCanvas.value.width = width;
        thumbnailCanvas.value.height = height;

        // Fill with background color
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);

        // Add gradient
        const centerX = isColorDark ? width : 0;
        const centerY = isColorDark ? 0 : height;
        const radius = Math.min(width, height) * 1;
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);

        // Define gradient color stops
        const gradientStart = isColorDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)';
        const gradientEnd = isColorDark ? 'rgba(255, 255, 255, 0)' : 'rgba(0, 0, 0, 0)';
        gradient.addColorStop(0, gradientStart);
        gradient.addColorStop(1, gradientEnd);

        // Apply gradient
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Draw placeholder icon
        const image = isColorDark ? imgWhite.value : imgBlack.value;
        if (image) {
            const dims = getImageDims(image, width, height);
            const x = (width - dims.width) / 2;
            const y = (height - dims.height) / 2;
            ctx.drawImage(image, x, y, dims.width, dims.height);
        }
    }

    // Function to load SVG images
    const loadImage = (src) => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (error) => reject(error);
        img.src = src;
    });

    // Load SVG icons on mount and draw the canvas
    onMounted(async () => {
        if (isImageType.value) {
            // Create Blobs from the SVGs and convert them to URLs
            const blobBlack = new Blob([PLACEHOLDER.CANVAS.svgBlack], { type: 'image/svg+xml' });
            const urlBlack = URL.createObjectURL(blobBlack);

            const blobWhite = new Blob([PLACEHOLDER.CANVAS.svgWhite], { type: 'image/svg+xml' });
            const urlWhite = URL.createObjectURL(blobWhite);

            try {
                // Load both images and wait for them to be loaded
                const [loadedImgBlack, loadedImgWhite] = await Promise.all([
                    loadImage(urlBlack),
                    loadImage(urlWhite),
                ]);

                // Assign the loaded images to refs
                imgBlack.value = loadedImgBlack;
                imgWhite.value = loadedImgWhite;

                // Draw the canvas once images are loaded
                drawThumbnailCanvas();
            } catch (error) {
                console.error('Error loading images:', error);
            }
        }
    });

    // Watch for changes in the selected state to refresh the canvas if needed
    watch(() => props.selected, () => {
        if (isImageType.value) {
            setTimeout(() => {
                drawThumbnailCanvas();
            }, 0);
        }
    });

    async function onDeleteClick() {
        // Get the item to be deleted
        const deletedItemGuid = props.savedItem.guid;

        // Delete the item from storage
        await placeholderStore.delete_syncStorageItem(deletedItemGuid);

        // Find the index of the deleted item
        const deletedIndex = placeholderStore.savedPlaceholders.findIndex(
            (e) => e.guid === deletedItemGuid,
        );

        // Determine new selected index if necessary
        let newSelectedIndex = 0;
        if (placeholderStore.selectedSavedGuid === deletedItemGuid) {
            newSelectedIndex = Math.max(deletedIndex - 1, 0);
        } else {
            // Find current selected index if it wasn't the deleted item
            const currentSelectedIndex = placeholderStore.savedPlaceholders.findIndex(
                (e) => e.guid === placeholderStore.selectedSavedGuid,
            );
            // If selected item is after deleted item, adjust index
            newSelectedIndex = currentSelectedIndex > deletedIndex
                ? Math.max(currentSelectedIndex - 1, 0)
                : currentSelectedIndex;
        }

        // Modify the array using splice to preserve object references
        // This is key to preventing re-rendering of all thumbnails
        placeholderStore.savedPlaceholders.splice(deletedIndex, 1);

        // Update the selected guid
        if (placeholderStore.savedPlaceholders.length) {
            placeholderStore.selectedSavedGuid = placeholderStore
                .savedPlaceholders[newSelectedIndex].guid;
            placeholderStore.set_syncStorage({
                [STORAGE.SELECTED_SAVED_ITEM]: placeholderStore.selectedSavedGuid,
            });
        } else {
            placeholderStore.selectedSavedGuid = null;
            placeholderStore.delete_syncStorageItem(STORAGE.SELECTED_SAVED_ITEM);
        }

        // Update the saved items array in storage
        const guidArrFiltered = placeholderStore.savedPlaceholders.map((e) => e.guid);
        placeholderStore.set_syncStorage({ [STORAGE.SAVED_ITEMS]: guidArrFiltered });

        // If no items left, update tab
        if (!guidArrFiltered?.length) {
            emit(EMITS.UPDATE_TAB, { id: 1 });
        }
    }

</script>

<style scoped lang="scss">
.container {
    border-bottom: 1px solid transparent;

    &-inner {
        padding-top: 0;
        padding-bottom: 4px;
        display: flex;

        > div:first-child {
            flex: 1;
        }
    }
}

.text {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
            line-clamp: 2;
    -webkit-box-orient: vertical;
    user-select: none;
}

.icons {
    color: #666;
}

.tags {
    margin-top: 6px;
    gap: 6px;
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    padding-left: 0;
}

.v-list-item {
    padding-bottom: 6px;

    &.v-list-item--density-default:not(.v-list-item--nav).v-list-item--one-line {
        padding-inline: 10px;
    }
}

:deep(.v-list-item__content) {
    user-select: none;
}

.thumbnail-container {
    width: 50px;
    height: 40px;
    overflow: hidden;
    border-radius: 4px;
    background-image: url('../../assets/images/canvas-bg.png');
    background-repeat: repeat;
    border: 1px solid #ddd;
    margin-right: 10px;
}

.thumbnail-canvas {
    width: 100%;
    height: 100%;
    object-fit: contain;
}
</style>
