<template>
    <v-container>
        <v-row>
            <v-col cols="6">
                <v-row>
                    <v-col cols="12">
                        <div class="saved-list"
                            v-if="placeholderStore.savedPlaceholders.length">
                            <PlaceholderSavedItem
                                v-for="(item, index) in placeholderStore.savedPlaceholders"
                                :key="index"
                                :savedItem="item"
                                @click="onItemClick(item)" />
                        </div>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="6">
                <TextareaField
                    v-model="activeItemModel.text"
                    :icon="mdiContentCopy"
                    @click="onCopy($event)" />
                <TextField
                    :icon="mdiContentCopy"
                    v-model="activeItemModel.url"
                    @click="onCopy($event)" />
            </v-col>
        </v-row>

    </v-container>
</template>

<script setup>
    import { ref, watch } from 'vue';
    import { usePlaceholderStore } from '@stores/placeholder';
    import PlaceholderSavedItem from '@/components/saved/PlaceholderSavedItem.vue';
    import TextareaField from '@/components/formFields/textareaField.vue';
    import TextField from '@/components/formFields/textField.vue';
    import { EMITS } from '@/constants';
    import useEventsBus from '@cmp/eventBus';
    import { mdiContentCopy } from '@mdi/js';

    const placeholderStore = usePlaceholderStore();

    const activeItemModel = ref({
        text: '',
        url: '',
    });

    function onItemClick(item) {
        activeItemModel.value.text = item.text;
        activeItemModel.value.url = item.url;
    }

    const { emit } = useEventsBus();

    function onCopy(event) {
        navigator.clipboard.writeText(event).then(() => {
            emit(EMITS.COPY, { success: true });
        }).catch(() => {
            emit(EMITS.COPY, { success: false });
        });
    }

    watch(() => placeholderStore.savedPlaceholders, (newVal) => {
        if (newVal && newVal.length) {
            onItemClick(placeholderStore.savedPlaceholders[0]);
        }
    }, {
        immediate: true,
    });

</script>

<style scoped lang="scss">
.saved-list {
    height: 420px;
    overflow: auto;
}
</style>
