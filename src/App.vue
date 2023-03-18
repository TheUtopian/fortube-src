<template>
	<button v-if="loaded" type="button" id="info-btn" class="btn btn-outline-default" @click="$refs.infoBtn.show()">
		<svg height="2.5em" width="2.5em" viewBox="0 0 24 24" fill="currentColor">
			<path d="m 11,6 v 2 h 2 V 6 Z m -1,4 -0.9999999,1 H 11 v 6 H 9.0000001 v 1 H 10 h 4 1 v -1 h -2 v -7 z" />
		</svg>
	</button>
	<div class="container-lg" v-show="loaded">
		<div class="row">
			<div class="col-12 col-lg">
				<SideBar :history="history" @change="categoryChanged" @clear="clearHistory" :content="content" />
			</div>
			<div class="col-12 col-lg-auto">
				<YouTube v-if="loading" :category="category" :paused="paused" @change="changed" @ready="playerLoaded" :content="content" />
			</div>
		</div>
	</div>
	<WelcomeModal v-if="loaded" ref="infoBtn" @change="opened" @change-lang="langChanged" :content="content.modal" />
</template>

<script>
import WelcomeModal from './components/WelcomeModal.vue'
import YouTube from './components/YouTube.vue'
import SideBar from './components/SideBar.vue'

const startBtn = document.getElementById('start-btn');

export default {
  name: 'App',
  components: {
    WelcomeModal,
		YouTube,
		SideBar
  },
	data() {
		const localHistory = localStorage.getItem('history')
		const history = localHistory ? JSON.parse(localHistory) : []

		return {
			content: this.content,
			history,
			category: Number(localStorage.getItem('category')),
			loading: false,
			loaded: false,
			paused: false,
		}
	},
	methods: {
		opened(state) {
			this.paused = state
		},
		playerLoaded() {
			this.loaded = true;
			startBtn.disabled = false;
			startBtn.hidden = true;
		},
		langChanged(content) {
			this.content = content
		},
		changed(video_data) {
			this.history.push(video_data)
			localStorage.setItem('history', JSON.stringify(this.history))
		},
		categoryChanged(id) {
			this.category = id;
		},
		clearHistory() {
			localStorage.removeItem('history')
			this.history.length = 0;
		}
	},
	created() {
		startBtn.disabled = false;

		startBtn.addEventListener('click', () => {
			startBtn.disabled = true;
			this.loading = true
		});
	}
}
</script>

<style lang="sass">
	#info-btn
		--bs-btn-padding-x: 0
		--bs-btn-padding-y: 0
		--bs-btn-border-radius: 48px

		position: absolute
		top: var(--gutter)
		right: var(--gutter)
		width: var(--btn-size)
		height: var(--btn-size)
		// background: #3498DB

	@media (max-width: 640px)
		#info-btn
			--gutter: 12px
			--btn-size: 36px
			font-size: 14px
</style>