<template>
    <v-list-item
        v-if="savedItem"
        :active="selected">
        <template v-slot:title>
            {{ savedItem.text }}
        </template>
        <template v-slot:subtitle>
            <ul class="tags">
                <li v-for="(tag, index) in savedItem.tags" :key="index">
                    <v-chip size="small"
                        color="#020b63">
                        {{ tag.label }}: {{ tag.value }}
                    </v-chip>
                </li>
            </ul>
        </template>
        <template v-slot:append>
            <v-btn
                color="grey-darken-1"
                :icon="mdiTrashCanOutline"
                variant="text"
                size="small"
                @click="onDeleteClick()" />
        </template>
    </v-list-item>
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
    border-bottom: 1px solid transparent;

    &-inner {
        padding-top: 0;
        padding-bottom: 4px;
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

.v-list-item {
    padding-bottom: 6px;

    &.v-list-item--density-default:not(.v-list-item--nav).v-list-item--one-line {
        padding-inline: 10px;
    }
}

:deep(.v-list-item__content) {
    user-select: none;
}

</style>
