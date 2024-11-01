<template>
    <span>{{ tag.label }}: {{ tag.value }}</span>
</template>

<script setup>
    defineProps({
        tag: {
            type: Object,
            required: true,
        },
    });
</script>

<style scoped lang="scss">
    span {
        background-color: #DFEEF2;
        border-radius: 4px;
        border: 1px solid #A7D5E0;
        color: #6c6cc4;
        display: inline-block;
        font-size: 11px;
        line-height: 1;
        padding: 3px 6px;
        pointer-events: none;
        user-select: none;
    }
</style>
