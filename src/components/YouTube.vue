<template>
	<div id="ytplayer"></div>
	<div class="row p-3">
		<div class="col"><p class="description">{{ video.views.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ' ') }} {{video.views == 1 ? content.view : content.views}}</p></div>
		<div class="col-auto">
			<div class="row">
				<div class="col"><RateButton type="plus" @click="next('p')" :remaining="timer.rate"/></div>
				<div class="col"><RateButton type="default" @click="next('e')" :remaining="timer.skip"/></div>
				<div class="col"><RateButton type="minus" @click="next('n')" :remaining="timer.rate"/></div>
			</div>
		</div>
	</div>
</template>

<script>
import Timer from '@/Timer'
import db from '@/db'
import RateButton from './RateButton.vue';

export default {
	name: 'YouTube',
	components: {RateButton},
	props: {
		category: Number,
		paused: Boolean,
		content: Object
	},
	emits: ['ready', 'change', 'error'],
	data() {
		return {
			timer: new Timer(),
			video: {id: 0, views: 0},
			player: null,
		}
	},
	watch: {
		paused(state) {
			if (state) {
				this.player.pauseVideo();
			} else {
				this.player.playVideo();
			}
		}
	},
	created() {
		db.video(this.category).then(video => {
			window.onYouTubeIframeAPIReady = () => {
				this.player = new window.YT.Player('ytplayer', {
					width: null,
					height: null,
					videoId: video.id,
					playerVars: {
						origin: location.origin,
						modestbranding: '1',
						// disablekb: '1',
						iv_load_policy: '3',
						rel: '0',
						autoplay: this.paused ? '0' : '1',
						showinfo: '0'
					},
					events: {
						'onReady': () => {
							this.video = video
							this.$emit('ready')
						},
						'onStateChange': (e) => {
							this.timer.stop()
							if (e.data == window.YT.PlayerState.BUFFERING) {
								if (this.paused) {
									this.player.pauseVideo()
								}
							}
							if (e.data == window.YT.PlayerState.PLAYING) {
								this.timer.start(e.target.getDuration() / 64)
							}
						},
						'onError': () => this.next('n')
					}
				})
			}

			const script = document.createElement('script')
			script.src = 'https://www.youtube.com/iframe_api'

			document.head.appendChild(script)
		});
	},
	beforeUnmount() {
		this.rate('e')
	},
	methods: {
		next(rating) {
			this.timer = new Timer()

			this.rate(rating)

			db.video(this.category).then(video => {
				const current_video = this.player.getVideoData()
	
				if (current_video.title.length) {
					this.$emit('change', {
						id: current_video.video_id,
						title: current_video.title,
						rating: rating
					});
				}

				this.player.loadVideoById(video.id)
				this.video = video
			}).catch(() => {
				this.next('e')
			})
		},
		rate(rating) {
			db.rateVideo(this.video.id, rating)
		},
	}
}
</script>

<style lang="sass">
.description
	padding: 0
	margin-bottom: 0
	font-size: 24px
	line-height: var(--btn-size)

#ytplayer
	--ytplayer-width: calc(100vw - var(--gutter))

	display: block
	width: var(--ytplayer-width)
	height: calc(var(--ytplayer-width)*9/16)
	min-width: 360px
	min-height: 202.5px

@media (min-width: 992px)
	#ytplayer
		--ytplayer-width: 640px

@media (min-width: 1200px)
	#ytplayer
		--ytplayer-width: 800px

@media (min-width: 1400px)
	#ytplayer
		--ytplayer-width: 960px
</style>