<template>
    <v-row>
        <v-col
            cols="6">
            <v-text-field
                density="compact"
                label="Placeholder Width"
                :hide-details="true"
                type="number"
                v-model.number="placeholderStore.model.imageWidth" />
        </v-col>
        <v-col
            cols="6">
            <v-text-field
                density="compact"
                :hide-details="true"
                label="Placeholder Height"
                type="number"
                v-model.number="placeholderStore.model.imageHeight" />
        </v-col>
    </v-row>
    <v-row>
        <v-col
            cols="12">
            <v-color-picker
                class="d-inline"
                density="compact"
                v-model="placeholderStore.model.color"
                :hide-details="true"
                @update:modelValue="onColorUpdate($event)"
                hide-sliders
                hide-canvas
                :swatches="PLACEHOLDER.CANVAS.swatches"
                show-swatches
                :rounded="true"
                width="100"
                :modes="['hex']" />
        </v-col>
    </v-row>
    <v-row>
        <v-col
            cols="12">
            <v-radio-group
                :hide-details="true"
                density="comfortable"
                v-model="placeholderStore.model.mimetype"
                @update:modelValue="onMimeTypeUpdate($event)"
                inline>
                <template v-for="type in PLACEHOLDER.MIME_TYPES" :key="type.value">
                    <v-radio
                        class="radiobutton"
                        :label="type.label"
                        :value="type.value" />
                </template>
            </v-radio-group>
        </v-col>
    </v-row>
</template>

<script setup>

    import { PLACEHOLDER, STORAGE } from '@/constants';
    import { usePlaceholderStore } from '@stores/placeholder';
    import { watch, computed } from 'vue';
    import { useDebounce } from '@vueuse/core';

    const placeholderStore = usePlaceholderStore();

    // save values in in synced storage
    // width
    const imageWidthRef = computed(() => placeholderStore.model.imageWidth);
    const debouncedCanvasWidth = useDebounce(imageWidthRef, 300);

    watch(debouncedCanvasWidth, (newVal) => {
        placeholderStore.set_syncStorage({ [STORAGE.IMAGE_WIDTH]: newVal });
    });

    // height
    const imageHeightRef = computed(() => placeholderStore.model.imageHeight);
    const debouncedCanvasHeight = useDebounce(imageHeightRef, 300);

    watch(debouncedCanvasHeight, (newVal) => {
        placeholderStore.set_syncStorage({ [STORAGE.IMAGE_HEIGHT]: newVal });
    });

    // color
    function onColorUpdate(event) {
        placeholderStore.set_syncStorage({ [STORAGE.IMAGE_COLOR]: event });
    }

    // mimetype
    function onMimeTypeUpdate(event) {
        placeholderStore.set_syncStorage({ [STORAGE.IMAGE_MIMETYPE]: event });
    }
</script>

<style scoped lang="scss">

:deep(.v-color-picker-edit) {
    margin-top: 0;
}
</style>
