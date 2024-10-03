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
            <v-col
                cols="12">
                <v-row>
                    <v-col cols="12">
                        <v-btn
                            color="blue-darken-1"
                            variant="tonal"
                            @click="onSaveClick()">
                            DOWNLOAD
                        </v-btn>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
    import { usePlaceholderStore } from '@stores/placeholder';
    import PlaceholderImageForm from './PlaceholderImageForm.vue';
    import PlaceholderImageCanvas from './PlaceholderImageCanvas.vue';

    const placeholderStore = usePlaceholderStore();

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
