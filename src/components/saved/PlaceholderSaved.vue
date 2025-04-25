<template>
    <v-container>
        <v-row>
            <v-col cols="6">
                <v-row>
                    <v-col cols="12">
                        <div class="saved-list"
                            v-if="placeholderStore.savedPlaceholders.length">
                            <v-list>
                                <PlaceholderSavedItem
                                    v-for="item in sortedPlaceholders"
                                    :selected="placeholderStore.selectedSavedGuid === item.guid"
                                    :key="item.guid"
                                    :savedItem="item"
                                    @click.stop="onItemClick(item)" />
                            </v-list>
                        </div>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="6">
                <template v-if="activeItemModel">
                    <TextareaField
                        v-model="activeItemModel.text"
                        :icon="mdiContentCopy"
                        @click="onCopy($event)" />
                </template>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
    import { EMITS, STORAGE } from '@/constants';
    import { mdiContentCopy } from '@mdi/js';
    import { ref, watch, computed } from 'vue';
    import { usePlaceholderStore } from '@stores/placeholder';
    import PlaceholderSavedItem from '@/components/saved/PlaceholderSavedItem.vue';
    import TextareaField from '@/components/formFields/TextareaField.vue';
    import useEventsBus from '@cmp/eventBus';

    const placeholderStore = usePlaceholderStore();

    const activeItemModel = ref();

    // Computed property to sort placeholders in descending order by timestamp
    const sortedPlaceholders = computed(() => [...placeholderStore.savedPlaceholders].sort((a, b) => b.timestamp - a.timestamp, // Descending order (newest first)
    ));

    function onItemClick(item) {
        activeItemModel.value = item;

        placeholderStore.selectedSavedGuid = item.guid;
        placeholderStore.set_syncStorage({ [STORAGE.SELECTED_SAVED_ITEM]: item.guid });
    }

    const { emit } = useEventsBus();

    function onCopy(event) {
        navigator.clipboard.writeText(event).then(() => {
            emit(EMITS.COPY, { success: true });
        }).catch(() => {
            emit(EMITS.COPY, { success: false });
        });
    }

    watch(
        [
            () => placeholderStore.savedPlaceholders,
            () => placeholderStore.selectedSavedGuid,
        ],
        (newVal) => {
            try {
                if (newVal && newVal[0]?.length) {
                    placeholderStore.selectedSavedGuid = placeholderStore.selectedSavedGuid
                        || placeholderStore.savedPlaceholders[0]?.guid;

                    activeItemModel.value = placeholderStore.savedPlaceholders
                        .find((e) => e.guid === placeholderStore.selectedSavedGuid) || null;
                }
            } catch (error) {
                console.error(error);
            }
        },
        {
            immediate: true,
        },
    );

</script>

<style scoped lang="scss">
.saved-list {
    height: 420px;
    overflow: auto;
}
</style>
