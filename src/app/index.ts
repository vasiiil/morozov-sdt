import { createApp } from 'vue';
import App from './App.vue';
import { router } from './providers/router';
import devexpressConfig from 'devextreme/core/config';
devexpressConfig({
	editorStylingMode: 'outlined',
});

export const app = createApp(App).use(router);
