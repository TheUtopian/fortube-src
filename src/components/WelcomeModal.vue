<template>
	<Transition name="fade">
		<div id="welcome-modal" ref="welcomeModal" v-show="opened" @click="close" class="modal-overlay">
			<div class="modal">
				<div class="body">
					<h2>{{content.header}}</h2>
					<p>{{(content.content)}}</p>
					<ol>
						<li>{{content.rules[0]}}</li>
						<li>{{content.rules[1]}}</li>
						<li>{{content.rules[2]}}</li>
						<li>{{content.rules[3]}}</li>
						<li>{{content.rules[4]}}</li>
					</ol>
					<p>{{(content.congrat)}}</p>
					<hr>
					<div class="row">
						<div class="col-auto">
							<select class="lang-select btn btn-outline-default" v-model="lang">
								<option v-for="{value, text} of langList" :key="value" :value="value">{{text}}</option>
							</select>
						</div>
						<div class="col"></div>
						<div class="col-auto">
							<button type="button" class="btn btn-success" @click="getMatured">{{content.btn}}</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Transition>
</template>

<script>
import db from '@/db'

export default {
	name: 'CWelcome',
	props: ['content'],
	emits: ['changeLang', 'open'],
	expose: ['show'],
	data() {
		return {
			opened: localStorage.getItem('matured') != '1',
			lang: localStorage.getItem('lang'),
			langList: [
				{value: 'en', text: 'English'},
				{value: 'ru', text: 'Русский'},
			]
		}
	},
	watch: {
		opened: {
			handler(value) {
				this.$emit('change', value);
			},
			immediate: true,
		},
		lang(value) {
			db.content(value).then(content => {
				localStorage.setItem('lang', value)
	
				this.$emit('changeLang', content)
			})
		}
	},
	methods: {
		show() {
			this.opened = true;
		},
		close(event) {
			if (localStorage.getItem('matured') == '1' && event.target === this.$refs.welcomeModal) {
				this.opened = false;
			}
		},
		getMatured() {
			localStorage.setItem('matured', '1');
			this.opened = false;
		},
		setLang(lang) {
			db.content(lang).then(content => {
				this.lang = lang;
				localStorage.setItem('lang', lang)
	
				this.$emit('changeLang', content)
			})
		}
	},
}
</script>

<style lang="sass">
	#welcome-modal
		.body
			position: relative
			padding: var(--gutter)
			h2
				text-align: center
				margin-bottom: var(--gutter)

		.lang-select
			appearance: none

		.lang-menu
			position: absolute
			top: var(--gutter)
			left: var(--gutter)
			display: flex
			.lang-item
				background: none
				border: none
				color: var(--bs-body-color)
				height: 48px
				padding: 0 .75rem
				text-align: center	
				text-decoration: none
				user-select: none
				opacity: .625
				&:hover, &.active
					// background: #546de5
					opacity: 1
				&:last-child
			margin-right: 0
</style>