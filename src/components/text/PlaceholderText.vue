<template>
    <v-container>
        <v-row>
            <v-col
                cols="6">
                <PlaceholderTextForm />
            </v-col>
            <v-col
                cols="6">
                <PlaceholderTextOutput />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
    import PlaceholderTextOutput from './PlaceholderTextOutput.vue';
    import PlaceholderTextForm from './PlaceholderTextForm.vue';
</script>
