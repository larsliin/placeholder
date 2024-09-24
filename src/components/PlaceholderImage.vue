<template>
    <v-container>
        <v-row>
            <v-col
                cols="6">
                <v-row>
                    <v-col
                        cols="12"><v-color-picker
                        class="d-inline"
                        density="compact"
                        v-model="backgroundColor"
                        :hide-details="true"
                        @update:modelValue="onColorUpdate($event)"
                        hide-sliders
                        hide-canvas
                        :swatches="PLACEHOLDER.CANVAS.swatches"
                        show-swatches
                        :rounded="true"
                        width="100"
                        :modes="['hex', 'rgb']" />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col
                        cols="6">
                        <v-text-field
                            density="compact"
                            label="Placeholder Width"
                            :hide-details="true"
                            type="number"
                            @update:modelValue="onWidthUpdate($event)"
                            v-model.number="canvasWidth" />
                    </v-col>
                    <v-col
                        cols="6">
                        <v-text-field
                            density="compact"
                            :hide-details="true"
                            label="Placeholder Height"
                            type="number"
                            @update:modelValue="onHeightUpdate($event)"
                            v-model.number="canvasHeight" />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col
                        cols="12">
                        <v-radio-group
                            :hide-details="true"
                            density="comfortable"
                            v-model="mimeType"
                            @update:modelValue="onMimeTypeUpdate($event)"
                            inline>
                            <template v-for="type in mimeTypes" :key="type.value">
                                <v-radio
                                    class="radiobutton"
                                    :label="type.label"
                                    :value="type.value" />
                            </template>
                        </v-radio-group>
                    </v-col>
                </v-row>
            </v-col>
            <v-col
                cols="6">
                <div class="canvas-container">
                    <canvas ref="canvas"></canvas>
                </div>
            </v-col>
        </v-row>
        <v-row>
            <v-col
                cols="12">
                <v-btn
                    color="blue-darken-1"
                    variant="tonal"
                    @click="onSaveClick()">
                    DOWNLOAD
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
    import { onMounted, ref, watch } from 'vue';
    import { PLACEHOLDER } from '@/constants';
    import useColors from '@cmp/colors';
    import { usePlaceholderStore } from '@stores/placeholder';

    const backgroundColor = ref(PLACEHOLDER.CANVAS.swatches[0][0]);

    const canvasWidth = ref(PLACEHOLDER.CANVAS.width);
    const canvasHeight = ref(PLACEHOLDER.CANVAS.height);
    const mimeTypes = ref([
        {
            label: 'Png',
            value: 'image/png',
        },
        {
            label: 'Jpeg',
            value: 'image/jpg',
        },
        {
            label: 'Gif',
            value: 'image/gif',
        },
    ]);
    const mimeType = ref(mimeTypes.value[0].value);
    const canvas = ref(null);

    const placeholderStore = usePlaceholderStore();

    function onColorUpdate(event) {
        placeholderStore.set_syncStorage({ color: event });
    }

    function onWidthUpdate(event) {
        placeholderStore.set_syncStorage({ width: event });
    }

    function onHeightUpdate(event) {
        placeholderStore.set_syncStorage({ height: event });
    }

    function onMimeTypeUpdate(event) {
        placeholderStore.set_syncStorage({ mimetype: event });
    }

    function onSaveClick() {
        const canvasElement = canvas.value;
        const image = canvasElement.toDataURL(mimeType.value); // Convert canvas to data URL
        const fileExtension = mimeType.value.split('/')[1];
        const link = document.createElement('a');
        const colorStr = backgroundColor.value.toLowerCase().replace(/^#/, '');
        link.href = image;
        link.download = `placeholder-${canvasWidth.value}-${canvasHeight.value}-${colorStr}.${fileExtension}`;
        link.click();
    }

    function getImageDims(img) {
        // Calculate aspect ratios
        const containerRatio = canvasWidth.value / canvasHeight.value;

        const imageWidth = img.width;
        const imageHeight = img.height;

        let width;
        let height;

        if (containerRatio < 1) {
            // Container is wider relative to its height
            width = canvasWidth.value;
            height = (imageHeight / imageWidth) * canvasWidth.value;
        } else {
            // Container is taller relative to its width
            width = (imageWidth / imageHeight) * canvasHeight.value;
            height = canvasHeight.value;
        }

        width /= 2;
        height /= 2;

        return { width, height };
    }
    const imgBlack = ref(null);
    const imgWhite = ref(null);

    const colors = useColors();

    function drawCanvas() {
        const ctx = canvas.value.getContext('2d');
        const isHexBelow50Percent = colors.isHexBelow50Percent(backgroundColor.value);

        canvas.value.width = canvasWidth.value;
        canvas.value.height = canvasHeight.value;

        // Fill the entire canvas with the dynamic background color
        ctx.fillStyle = backgroundColor.value;
        ctx.fillRect(0, 0, canvasWidth.value, canvasHeight.value);

        // gradient

        // Calculate the center of the canvas
        const centerX = isHexBelow50Percent ? canvasWidth.value : 0;
        const centerY = isHexBelow50Percent ? 0 : canvasHeight.value;

        // Set the radius to fit within the canvas (half of the smallest dimension)
        const radius = Math.min(canvasWidth.value, canvasHeight.value) * 1;

        // Create a radial gradient centered in the canvas
        // Parameters: createRadialGradient(x0, y0, r0, x1, y1, r1)
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);

        // Define gradient color stops
        const gradientStart = isHexBelow50Percent ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)';
        const gradientEnd = isHexBelow50Percent ? 'rgba(255, 255, 255, 0)' : 'rgba(0, 0, 0, 0)';
        gradient.addColorStop(0, gradientStart);
        gradient.addColorStop(1, gradientEnd);

        // Use the gradient to fill the canvas
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvasWidth.value, canvasHeight.value);

        // placeholder image
        const image = isHexBelow50Percent ? imgWhite.value : imgBlack.value;

        if (image) {
            const dims = getImageDims(image);
            const x = (canvasWidth.value - dims.width) / 2;
            const y = (canvasHeight.value - dims.height) / 2;

            ctx.drawImage(image, x, y, dims.width, dims.height);
        }
    }

    const resizeCanvas = () => {
        // Apply the new dimensions to the canvas
        canvas.value.width = canvasWidth.value;
        canvas.value.height = canvasHeight.value;

        // Redraw the canvas with the new dimensions
        drawCanvas();
    };

    watch([canvasWidth, canvasHeight], () => {
        resizeCanvas();
    });

    watch(backgroundColor, () => {
        drawCanvas();
    });

    // Function to create a promise that resolves when an image is loaded
    const loadImage = (src) => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (error) => reject(error);
        img.src = src;
    });

    onMounted(async () => {
        // Create Blobs from the SVGs and convert them to URLs
        const blobBlack = new Blob([PLACEHOLDER.CANVAS.svgBlack], { type: 'image/svg+xml' });
        const urlBlack = URL.createObjectURL(blobBlack);

        const blobWhite = new Blob([PLACEHOLDER.CANVAS.svgWhite], { type: 'image/svg+xml' });
        const urlWhite = URL.createObjectURL(blobWhite);

        try {
            // Load both images and wait for them to be loaded
            const [loadedImgBlack, loadedImgWhite, color, width, height, mimetype] = await Promise.all([
                loadImage(urlBlack),
                loadImage(urlWhite),
                placeholderStore.get_syncStorage('color'),
                placeholderStore.get_syncStorage('width'),
                placeholderStore.get_syncStorage('height'),
                placeholderStore.get_syncStorage('mimetype'),
            ]);

            // Assign the loaded images to refs
            imgBlack.value = loadedImgBlack;
            imgWhite.value = loadedImgWhite;

            if (color) {
                backgroundColor.value = color;
            }

            if (width) {
                canvasWidth.value = width;
            }

            if (height) {
                canvasHeight.value = height;
            }

            if (mimetype) {
                mimeType.value = mimetype;
            }

            // Call your drawCanvas function with the loaded images
            drawCanvas(backgroundColor.value);
        } catch (error) {
            console.error('Error loading images:', error);
        }
    });
</script>
<style lang="scss" scoped>
.canvas-container {
    height: 100%;
    position: relative;
    width: 100%;

    canvas {
        left: 50%;
        max-height: 100%;
        max-width: 100%;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
    }
}
:deep(.v-color-picker-edit) {
    margin-top: 0;
}
</style>
