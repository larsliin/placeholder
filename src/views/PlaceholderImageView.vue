<template>
    <div class="placeholder-container">
        <PlaceholderImage />
    </div>
</template>

<script setup>
    import PlaceholderImage from '@/components/image/PlaceholderImage.vue';
    import { onMounted } from 'vue';
    import { usePlaceholderStore } from '@stores/placeholder';
    import { PLACEHOLDER } from '@/constants';

    const placeholderStore = usePlaceholderStore();

    onMounted(async () => {
        try {
            // Load both images and wait for them to be loaded
            const [
                color,
                width,
                height,
                mimetype] = await Promise.all([
                    placeholderStore.get_syncStorage('color'),
                    placeholderStore.get_syncStorage('width'),
                    placeholderStore.get_syncStorage('height'),
                    placeholderStore.get_syncStorage('mimetype'),
                ]);

            placeholderStore.model.imageWidth = width || PLACEHOLDER.CANVAS.width;
            placeholderStore.model.imageHeight = height || PLACEHOLDER.CANVAS.height;
            placeholderStore.model.color = color || PLACEHOLDER.CANVAS.swatches[0][0];
            placeholderStore.model.mimetype = mimetype || PLACEHOLDER.MIME_TYPES[0].value;

            placeholderStore.model.paragraphCount = PLACEHOLDER.TEXT.paragraphCount;
            placeholderStore.model.wordCount = PLACEHOLDER.TEXT.wordCount;
        } catch (error) {
            console.error(error);
        }
    });

</script>

<style scoped lang="scss">
</style>
