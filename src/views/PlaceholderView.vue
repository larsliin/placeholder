<template>
    <div class="placeholder-container">
        <PlaholderTopbar />
        <PlaceholderImage />
    </div>
</template>

<script setup>
    import PlaholderTopbar from '@/components/PlaceholderTopbar.vue';
    import PlaceholderImage from '@/components/PlaceholderImage.vue';
</script>

<style scoped lang="scss">
.placeholder-container {
    width: 800px;
}
</style>
