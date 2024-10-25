<template>
    <div class="container">
        <div class="container-inner"
            v-if="savedItem">
            <div class="text">
                {{ savedItem.text }}
            </div>
            <div class="icons">
                <button type="button"
                    @click="onDeleteClick()">
                    <v-icon :icon="mdiTrashCanOutline" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { EMITS, STORAGE } from '@/constants';
    import { mdiTrashCanOutline } from '@mdi/js'; // https://pictogrammers.com/library/mdi/
    import { usePlaceholderStore } from '@stores/placeholder';
    import useEventsBus from '@cmp/eventBus';

    const { emit } = useEventsBus();

    const placeholderStore = usePlaceholderStore();

    const props = defineProps({
        savedItem: {
            type: Object,
            required: true,
        },
    });

    async function onDeleteClick() {
        await placeholderStore.delete_syncStorageItem(props.savedItem.guid);

        const savedPlaceholdersFiltered = placeholderStore.savedPlaceholders
            .filter((e) => e.guid !== props.savedItem.guid);
        placeholderStore.savedPlaceholders = savedPlaceholdersFiltered;

        const guidArrFiltered = placeholderStore.savedPlaceholders.map((e) => e.guid);
        placeholderStore.set_syncStorage({ [STORAGE.SAVED_ITEMS]: guidArrFiltered });

        if (!guidArrFiltered?.length) {
            emit(EMITS.UPDATE_TAB, { id: 1 });
        }
    }
</script>

<style scoped lang="scss">
.container {
    padding: 10px 4px;

    &:hover {
        background-color: #eee;
    }

    &-inner {
        display: flex;

        > div:first-child {
            flex: 1;
        }
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

.icons {
    color: #666;
}
</style>
