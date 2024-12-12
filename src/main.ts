import './assets/themes/generated/theme.base.css';
import './assets/themes/generated/theme.additional.css';
import './assets/main.css';
import { app } from './app';

document.addEventListener('DOMContentLoaded', () => {
	document.querySelector('dx-license svg')?.closest('div')?.click();
});

app.mount('#app');
