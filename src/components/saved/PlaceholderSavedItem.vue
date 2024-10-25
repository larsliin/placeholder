<template>
    <div class="container">
        <div class="text"
            v-if="savedItem">
            {{ savedItem.text }}
        </div>
    </div>
</template>

<script setup>

    defineProps({
        savedItem: {
            type: Object,
            required: true,
        },
    });
</script>

<style scoped lang="scss">
.container {
    padding: 10px 4px;

    &:hover {
        background-color: #eee;
    }
}

.text {
    overflow: hidden;
   display: -webkit-box;
   -webkit-line-clamp: 2;
           line-clamp: 2;
   -webkit-box-orient: vertical;
   user-select: none;
}
</style>
