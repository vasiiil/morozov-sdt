<script setup lang="ts">
import { RouterView } from 'vue-router'
import { locale as dxLocale, loadMessages } from 'devextreme/localization';
import ruMessages from 'devextreme/localization/messages/ru.json';
import DefaultLayout from './layouts/DefaultLayout.vue';

dxLocale('ru');
loadMessages(ruMessages);
</script>

<template>
  <default-layout>
    <router-view />
  </default-layout>
</template>

<style scoped></style>
