<template>
    <v-row>
        <v-col
            cols="12">
            <v-text-field
                density="compact"
                :hide-details="true"
                label="Paragraph Count"
                type="number"
                :min="1"
                :max="50"
                v-model.number="placeholderStore.model.paragraphCount" />
        </v-col>
    </v-row>
    <v-row>
        <v-col
            cols="12">
            <v-text-field
                density="compact"
                :hide-details="true"
                label="Word Count"
                type="number"
                :min="1"
                :max="200"
                v-model.number="placeholderStore.model.wordCount" />
        </v-col>
    </v-row>
</template>

<script setup>
    import { usePlaceholderStore } from '@stores/placeholder';

    const placeholderStore = usePlaceholderStore();
</script>

<style scoped lang="scss">

</style>
