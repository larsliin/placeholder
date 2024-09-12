<template>
    <v-container>
        <v-row>
            <v-col
                cols="12">
                <span class="text-h5">Placeholder</span>
            </v-col>
        </v-row>
        <v-row>
            <v-col
                cols="6">
                <v-color-picker
                    class="d-inline"
                    v-model="backgroundColor"
                    hide-sliders
                    hide-canvas
                    :swatches="swatches"
                    show-swatches
                    :rounded="true"
                    width="100"
                    :modes="['hex', 'rgb']" />
                <v-text-field
                    label="Placeholder Width"
                    type="number"
                    v-model.number="canvasWidth" />
                <v-text-field
                    label="Placeholder Height"
                    type="number"
                    v-model.number="canvasHeight" />
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
                    @click="onButtonClick()">
                    DOWNLOAD
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
    import { onMounted, ref, watch } from 'vue';
    import { PLACEHOLDER_IMAGE } from '@/constants';

    const swatches = [
        ['#ffcb0e', '#f5e70c', '#f0ea22', '#c0d62f', '#FFFFFF'],
        ['#89c541', '#46b749', '#24af4b', '#2ab567', '#D3D3D3'],
        ['#10a1c5', '#197fbe', '#1c60ad', '#294b9f', '#808080'],
        ['#263a94', '#373491', '#613191', '#9f3c96', '#555555'],
        ['#c21b79', '#e71b4c', '#ed2227', '#ee3824', '#333333'],
        ['#f26324', '#f57a20', '#f79020', '#faac1a', '#000000'],
    ];
    const backgroundColor = ref(swatches[0][0]);

    const canvasWidth = ref(300);
    const canvasHeight = ref(250);
    const canvas = ref(null);

    function onButtonClick() {
        const canvasElement = canvas.value;
        const image = canvasElement.toDataURL('image/png'); // Convert canvas to data URL

        const link = document.createElement('a');
        link.href = image;
        link.download = 'canvas-image.png';
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
    const img = ref(null);

    const scale = ref(1);

    const canvasContainer = ref();
    function drawCanvas() {
        const ctx = canvas.value.getContext('2d');

        canvas.value.width = canvasWidth.value;
        canvas.value.height = canvasHeight.value;

        // console.log(canvasWidth.value / canvasContainer.value.clientWidth);

        // const overflow = canvasWidth.value / canvasContainer.value.clientWidth;
        // if (overflow > 1) {
        //     scale.value = 1 - (overflow - 1);
        // }

        // Fill the entire canvas with the dynamic background color
        ctx.fillStyle = backgroundColor.value;
        ctx.fillRect(0, 0, canvasWidth.value, canvasHeight.value);

        if (img.value) {
            const dims = getImageDims(img.value);
            const x = (canvasWidth.value - dims.width) / 2;
            const y = (canvasHeight.value - dims.height) / 2;

            ctx.drawImage(img.value, x, y, dims.width, dims.height);
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

    onMounted(() => {
        // Load the image only once during the component's lifecycle
        img.value = new Image();
        img.value.src = PLACEHOLDER_IMAGE.CANVAS.imagePath; // Replace with your image path

        // When the image loads, draw it for the first time
        img.value.onload = () => {
            drawCanvas(backgroundColor.value); // Initial draw with the background color
        };

        drawCanvas(backgroundColor.value);
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
</style>
