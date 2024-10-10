<template>
    <div class="container">
        <v-tabs
            v-model="tab"
            color="primary"
            grow>
            <v-tab
                :value="1">
                Image
            </v-tab>
            <v-tab
                :value="2">
                Text
            </v-tab>
        </v-tabs>
        <PlaceholderImageView v-if="tab === 1" />
        <PlaceholderTextView v-if="tab === 2" />
    </div>
</template>

<script setup>
    import PlaceholderImageView from '@/views/PlaceholderImageView.vue';
    import PlaceholderTextView from '@/views/PlaceholderTextView.vue';
    import { ref, onMounted, watch } from 'vue';
    import { usePlaceholderStore } from '@stores/placeholder';
    import { PLACEHOLDER } from '@/constants';

    const tab = ref();

    const placeholderStore = usePlaceholderStore();

    onMounted(async () => {
        try {
            // Load both images and wait for them to be loaded
            const [
                tabId,
                color,
                width,
                height,
                mimetype,
                wordCount,
                paragraphCount] = await Promise.all([
                    placeholderStore.get_syncStorage('tabId'),
                    placeholderStore.get_syncStorage('color'),
                    placeholderStore.get_syncStorage('width'),
                    placeholderStore.get_syncStorage('height'),
                    placeholderStore.get_syncStorage('mimetype'),
                    placeholderStore.get_syncStorage('wordCount'),
                    placeholderStore.get_syncStorage('paragraphCount'),
                ]);

            tab.value = tabId || 1;
            placeholderStore.model.imageWidth = width || PLACEHOLDER.CANVAS.width;
            placeholderStore.model.imageHeight = height || PLACEHOLDER.CANVAS.height;
            placeholderStore.model.color = color || PLACEHOLDER.CANVAS.swatches[0][0];
            placeholderStore.model.mimetype = mimetype || PLACEHOLDER.MIME_TYPES[0].value;

            placeholderStore.model.wordCount = wordCount || PLACEHOLDER.TEXT.wordCount;
            placeholderStore.model.paragraphCount = paragraphCount
                || PLACEHOLDER.TEXT.paragraphCount;
        } catch (error) {
            console.error(error);
        }
    });

    watch(tab, () => {
        placeholderStore.set_syncStorage({ tabId: tab.value });
    });
</script>

<style scoped lang="scss">
.container {
    height: 500px;
    position: relative;
    width: 760px;
}
</style>
