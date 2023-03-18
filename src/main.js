import { createApp } from 'vue'
import db from './db'

import './sass/main.sass'

import App from './App.vue'

document.body.classList.toggle('dark', localStorage.getItem('darkmode'))

document.getElementById('theme-toggle-btn').addEventListener('click', () => {
	let current = document.body.classList.toggle('dark');
	localStorage.setItem('darkmode', current);
});

const app = createApp(App);

db.categories().then(categories => {
	app.config.globalProperties.categories = categories

	let lang = localStorage.getItem('lang');
	if (lang === null) {
		lang = navigator.language.indexOf('ru') === -1 ? 'en' : 'ru';
		localStorage.setItem('lang', lang);
	}

	return lang
}).then(db.content)
.then(content => {
	app.config.globalProperties.content = content
	app.mount('#app')
});