<template>
    <div class="container" :class="{ selected }">
        <div class="container-inner"
            v-if="savedItem">
            <div>
                <div class="text">{{ savedItem.text }}</div>
                <ul class="tags">
                    <li v-for="(tag, index) in savedItem.tags" :key="index">
                        <PlaceholderTag
                            :tag="tag" />
                    </li>
                </ul>
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
    import PlaceholderTag from '@/components/saved/PlaceholderTag.vue';

    const { emit } = useEventsBus();

    const placeholderStore = usePlaceholderStore();

    const props = defineProps({
        savedItem: {
            type: Object,
            required: true,
        },
        selected: {
            type: Boolean,
            default: false,
        },
    });

    async function onDeleteClick() {
        await placeholderStore.delete_syncStorageItem(props.savedItem.guid);

        const savedPlaceholdersFiltered = placeholderStore.savedPlaceholders
            .filter((e) => e.guid !== props.savedItem.guid);

        // find the index of the current selected guid
        let index = 0;
        if (placeholderStore.selectedSavedGuid === props.savedItem.guid) {
            index = Math.max(placeholderStore.savedPlaceholders
                .findIndex((e) => e.guid === props.savedItem.guid) - 1, 0);
        }

        placeholderStore.savedPlaceholders = savedPlaceholdersFiltered;

        // update the selected guid
        if (placeholderStore.savedPlaceholders.length) {
            placeholderStore.selectedSavedGuid = placeholderStore.savedPlaceholders[index].guid;
            placeholderStore.set_syncStorage({
                [STORAGE.SELECTED_SAVED_ITEM]: placeholderStore.selectedSavedGuid,
            });
        } else {
            placeholderStore.selectedSavedGuid = null;
            placeholderStore.delete_syncStorageItem(STORAGE.SELECTED_SAVED_ITEM);
        }

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
    border-bottom: 1px solid transparent;

    &:hover {
        background-color: rgb(245, 245, 245);
    }

    &.selected {
        background-color: rgb(245, 245, 245);
        border-bottom: 1px solid rgba(0, 0, 0, .38);
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

.tags {
    margin-top: 6px;
    column-gap: 6px;
    display: flex;
    list-style: none;
}
</style>
