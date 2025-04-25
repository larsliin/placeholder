<template>
    <v-container>
        <v-row>
            <v-col
                cols="6">
                <PlaceholderImageForm />
            </v-col>
            <v-col
                cols="6">
                <PlaceholderImageCanvas />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <div class="button-container">
                    <div class="buttons-wrapper">
                        <v-btn
                            color="blue-darken-1"
                            variant="tonal"
                            class="mr-2"
                            @click="onSaveClick()">
                            DOWNLOAD
                        </v-btn>
                        <v-btn
                            color="blue-darken-1"
                            variant="flat"
                            :disabled="kbSize >= 8"
                            @click="saveToStorage()">
                            SAVE
                        </v-btn>
                    </div>
                    <div class="err-msg"
                        :class="{ visible: kbSize >= 8 }">
                        {{ kbSize }}KB (8KB limit exceeded)
                    </div>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
    import { EMITS, STORAGE } from '@/constants';
    import { usePlaceholderStore } from '@stores/placeholder';
    import { v4 as uuidv4 } from 'uuid';
    import { ref, toRaw, computed } from 'vue';
    import useEventsBus from '@cmp/eventBus';
    import PlaceholderImageForm from './PlaceholderImageForm.vue';
    import PlaceholderImageCanvas from './PlaceholderImageCanvas.vue';

    const placeholderStore = usePlaceholderStore();
    const { emit } = useEventsBus();
    const kbSize = ref(0);

    // Calculate storage size
    const calculateStorageSize = () => {
        // Get file type from mimetype
        const fileType = placeholderStore.model.mimetype.split('/')[1];
        
        const imageObject = {
            guid: uuidv4(),
            timestamp: Date.now(),
            color: placeholderStore.model.color || '#ffffff',
            imageWidth: placeholderStore.model.imageWidth,
            imageHeight: placeholderStore.model.imageHeight,
            mimetype: placeholderStore.model.mimetype,
            text: `${placeholderStore.model.imageWidth}x${placeholderStore.model.imageHeight}`,
            tags: [
                {
                    label: 'Type',
                    value: 'image',
                },
                {
                    label: 'Width',
                    value: placeholderStore.model.imageWidth,
                },
                {
                    label: 'Height',
                    value: placeholderStore.model.imageHeight,
                },
                {
                    label: 'Color',
                    value: placeholderStore.model.color || '#ffffff',
                },
                {
                    label: 'Format',
                    value: fileType,
                },
            ],
        };

        // calculate size
        const jsonString = JSON.stringify(imageObject);
        const size = new Blob([jsonString]).size / 1024;
        kbSize.value = Math.round(size * 100) / 100;

        return imageObject;
    };

    // Compute storage size whenever relevant properties change
    computed(() => {
        if (placeholderStore.model.color
            && placeholderStore.model.imageWidth
            && placeholderStore.model.imageHeight) {
            calculateStorageSize();
        }
        return [
            placeholderStore.model.color,
            placeholderStore.model.imageWidth,
            placeholderStore.model.imageHeight,
        ];
    });

    // Save image settings to storage
    async function saveToStorage() {
        const imageObject = calculateStorageSize();

        if (kbSize.value >= 8) {
            return; // Size limit exceeded
        }

        try {
            const savedObj = await placeholderStore.get_syncStorage(STORAGE.SAVED_ITEMS);

            // Add to store's saved placeholders
            placeholderStore.savedPlaceholders.push(toRaw({ ...imageObject }));

            // Save image object to storage
            await placeholderStore.set_syncStorage({ [imageObject.guid]: imageObject });

            // Update saved items array in storage
            const arr = savedObj ? [...savedObj, imageObject.guid] : [imageObject.guid];
            await placeholderStore.set_syncStorage({ [STORAGE.SAVED_ITEMS]: arr });

            // Show success message
            emit(EMITS.SAVE, { success: true });
        } catch (error) {
            console.error(error);
            emit(EMITS.SAVE, { success: false });
        }
    }

    // on click save
    function onSaveClick() {
        const image = placeholderStore.canvas.toDataURL(placeholderStore.model.mimetype);
        const fileExtension = placeholderStore.model.mimetype.split('/')[1];
        const link = document.createElement('a');
        const colorStr = placeholderStore.model.color.toLowerCase().replace(/^#/, '');

        link.href = image;
        link.download = `placeholder-${placeholderStore.model.imageWidth}-${placeholderStore.model.imageHeight}-${colorStr}.${fileExtension}`;
        link.click();
    }
</script>

<style scoped lang="scss">
.button-container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.buttons-wrapper {
    display: flex;
    justify-content: flex-end;
}

.err-msg {
    color: rgb(var(--v-theme-error));
    font-size: 12px;
    text-align: right;
    margin-top: 4px;
    visibility: hidden;

    &.visible {
        visibility: visible;
    }
}
</style>
