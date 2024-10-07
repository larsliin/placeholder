<template>
    <div>
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
    import { ref } from 'vue';

    const tab = ref();
</script>

<style>
    @import "./scss/helpers.scss";
</style>
<style scoped lang="scss">
div {
    width: 760px;
}</style>
