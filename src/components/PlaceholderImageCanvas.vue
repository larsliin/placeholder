<template>
    <div class="canvas-container">
        <canvas ref="canvas"></canvas>
    </div>
</template>

<script setup>
    import { onMounted, ref, watch } from 'vue';
    import { PLACEHOLDER } from '@/constants';
    import useColors from '@cmp/colors';
    import { usePlaceholderStore } from '@stores/placeholder';

    const placeholderStore = usePlaceholderStore();

    // calculate image ratio dimensions
    function getImageDims(img) {
        // Calculate aspect ratios
        const containerRatio = placeholderStore.model.imageWidth
            / placeholderStore.model.imageHeight;

        const imageWidth = img.width;
        const imageHeight = img.height;

        let width;
        let height;

        if (containerRatio < 1) {
            // Container is wider relative to its height
            width = placeholderStore.model.imageWidth;
            height = (imageHeight / imageWidth) * placeholderStore.model.imageWidth;
        } else {
            // Container is taller relative to its width
            width = (imageWidth / imageHeight) * placeholderStore.model.imageHeight;
            height = placeholderStore.model.imageHeight;
        }

        width /= 2;
        height /= 2;

        return { width, height };
    }
    const imgBlack = ref(null);
    const imgWhite = ref(null);

    const colors = useColors();

    const canvas = ref();
    placeholderStore.canvas = canvas;

    function drawCanvas() {
        const ctx = canvas.value.getContext('2d');
        const isHexBelow50Percent = colors.isHexBelow50Percent(placeholderStore.model.color);

        canvas.value.width = placeholderStore.model.imageWidth;
        canvas.value.height = placeholderStore.model.imageHeight;

        // Fill the entire canvas with the dynamic background color
        ctx.fillStyle = placeholderStore.model.color;
        ctx.fillRect(0, 0, placeholderStore.model.imageWidth, placeholderStore.model.imageHeight);

        // gradient
        // Calculate position
        const centerX = isHexBelow50Percent ? placeholderStore.model.imageWidth : 0;
        const centerY = isHexBelow50Percent ? 0 : placeholderStore.model.imageHeight;

        // Set the radius to fit within the canvas (half of the smallest dimension)
        const radius = Math.min(
            placeholderStore.model.imageWidth,
            placeholderStore.model.imageHeight,
        ) * 1;

        // Create a radial gradient
        // Parameters: createRadialGradient(x0, y0, r0, x1, y1, r1)
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);

        // Define gradient color stops
        const gradientStart = isHexBelow50Percent ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)';
        const gradientEnd = isHexBelow50Percent ? 'rgba(255, 255, 255, 0)' : 'rgba(0, 0, 0, 0)';
        gradient.addColorStop(0, gradientStart);
        gradient.addColorStop(1, gradientEnd);

        // Use the gradient to fill the canvas
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, placeholderStore.model.imageWidth, placeholderStore.model.imageHeight);

        // placeholder image
        const image = isHexBelow50Percent ? imgWhite.value : imgBlack.value;

        if (image) {
            const dims = getImageDims(image);
            const x = (placeholderStore.model.imageWidth - dims.width) / 2;
            const y = (placeholderStore.model.imageHeight - dims.height) / 2;

            ctx.drawImage(image, x, y, dims.width, dims.height);
        }
    }

    const resizeCanvas = () => {
        // Apply the new dimensions to the canvas
        canvas.value.width = placeholderStore.model.imageWidth;
        canvas.value.height = placeholderStore.model.imageHeight;

        // Redraw the canvas with the new dimensions
        drawCanvas();
    };

    watch([
        () => placeholderStore.model.imageWidth,
        () => placeholderStore.model.imageHeight,
    ], () => {
        resizeCanvas();
    });

    watch(() => placeholderStore.model.color, () => {
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
            const [
                loadedImgBlack,
                loadedImgWhite,
            ] = await Promise.all([
                loadImage(urlBlack),
                loadImage(urlWhite),
            ]);

            // Assign the loaded images to refs
            imgBlack.value = loadedImgBlack;
            imgWhite.value = loadedImgWhite;

            // Call your drawCanvas function with the loaded images
            drawCanvas(placeholderStore.model.color);
        } catch (error) {
            console.error('Error loading images:', error);
        }
    });
</script>

<style scoped lang="scss">
.canvas-container {
    height: 100%;
    position: relative;
    width: 100%;
    background-image: url('../assets/images/canvas-bg.png');
    background-repeat: repeat;
    border: 1px solid #ddd;

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
