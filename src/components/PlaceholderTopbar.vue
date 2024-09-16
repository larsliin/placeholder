<template>
    <v-container>
        <v-row>
            <v-col
                cols="6">
                <span class="text-h5">Placeholder</span>
            </v-col>
            <v-col
                cols="6"
                class="text-right">
                <!--
                mdiWhiteBalanceSunny
                mdiWeatherNight
                mdiThemeLightDark
                -->
                <v-btn
                    size="xsmall"
                    :icon="mdiWhiteBalanceSunny"
                    @click="onThemeClick()" />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
    import { mdiWhiteBalanceSunny } from '@mdi/js';
    import { usePlaceholderStore } from '@stores/placeholder';
    import { onMounted } from 'vue';
    import { useTheme } from 'vuetify';

    const placeholderStore = usePlaceholderStore();

    const theme = useTheme();

    onMounted(async () => {
        const themeResp = await placeholderStore.get_syncStorage('theme');

        placeholderStore.theme = themeResp;

        theme.global.name.value = placeholderStore.theme ? placeholderStore.theme : 'light';
    });

    function onThemeClick() {
        if (!placeholderStore.theme || placeholderStore.theme === 'light') {
            placeholderStore.theme = 'dark';
        } else {
            placeholderStore.theme = 'light';
        }
        placeholderStore.set_syncStorage({ theme: placeholderStore.theme });

        theme.global.name.value = placeholderStore.theme;
    }
</script>
<style lang="scss" scoped>

</style>
