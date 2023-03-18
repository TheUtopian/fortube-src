<template>
<div class="sidebar">
	<h3 class="caption">
		<span>{{content.history}}<button type="button" class="btn btn-danger" :disabled="history.length == 0" @click="$emit('clear')">{{content.clear}}</button></span>
		<span>{{history.length}}</span>
	</h3>
	<ul class="history-list" ref="historyList" :class="{active: !is_category_active}">
		<li v-for="({rating, id, title}, i) of history" :key="i">
			<a :class="rating" :href="'https://www.youtube.com/watch?v='+id" target="_blank">{{title}}</a>
		</li>
	</ul>
	<ul class="category-list" :class="{active: is_category_active}">
		<li v-for="id of categories" :key="id">
			<button target="_blank" :disabled="category == id" @click="setCategory(id)">{{content.category[id]}}</button>
		</li>
	</ul>
	<button class="category-show-btn" :class="{active: is_category_active}" @click="is_category_active = !is_category_active">
		<div class="category-arrow"><svg width="24" height="24" viewBox="0 0 32 32" fill="currentColor"><path d="M 27.721991,23.326889 A 1.4652985,1.4652985 0 0 1 26.681629,22.901953 L 15.999603,12.205274 5.3175771,22.901953 A 1.471294,1.471294 0 1 1 3.2368532,20.821229 L 14.959241,9.0988412 a 1.4652985,1.4652985 0 0 1 2.080724,0 L 28.762353,20.821229 a 1.4652985,1.4652985 0 0 1 0,2.080724 1.4652985,1.4652985 0 0 1 -1.040362,0.424936 z"/></svg></div>
		<div class="category-caption">
			<span>{{content.categories}}</span>
			<span>{{content.category[category]}}</span>
		</div> 
	</button>
</div>
</template>

<script>
export default {
	props: {
		history: Array,
		content: Object
	},
	emits: ['change', 'clear'],
	data() {
		return {
			category: Number(localStorage.getItem('category')),
			is_category_active: false,
		}
	},
	methods: {
		setCategory(id) {
			this.is_category_active = false
			this.category = id
			localStorage.setItem('category', id)
			this.$emit('change', id)
		},
	},
	mounted() {
		const observer = new MutationObserver((records) => {
			records[0].target.scrollTo(0, 1073741824)
		})
		
		observer.observe(this.$refs.historyList, {childList: true})

		this.$emit('change', Number(localStorage.getItem('category')))
	},
}
</script>

<style lang="sass">
.sidebar
	--sidebar-bg: #ffffff
	--sidebar-hover-bg: #ececec
	--sidebar-disabled-color: #546de5
	--sidebar-max-height: 180px

	width: 100%
	max-height: var(--sidebar-max-height)
	line-height: 1
	background: var(--bs-body-bg)
	border: 1px solid var(--border-color)
	border-top: none
	border-bottom: none
	.category-show-btn
		display: flex
		width: 100%
		color: var(--bs-body-color)
		background-color: var(--sidebar-bg)
		margin: 0
		border: 1px solid var(--border-color)
		border-left: none
		border-right: none
		.category-caption
			display: flex
			flex-grow: 1
			padding: 12px 16px
			padding-left: 8px
			color: var(--bs-body-color)
			margin: 0
			font-size: 16px
			font-weight: bold
			justify-content: space-between
		.category-arrow
			flex-shrink: 0
			width: 40px
			background: none
			border: none
			padding: 8px
			border-radius: 20px
			transition: transform .2s ease
			color: var(--bs-body-color)
		&:hover, &:active
			background: var(--sidebar-hover-bg)
		&.active
			.category-arrow
				transform: rotate(180deg)
	.caption
		display: flex
		width: 100%
		padding: 12px 16px
		color: var(--bs-body-color)
		background-color: var(--sidebar-bg)
		margin: 0
		font-size: 16px
		font-weight: bold
		justify-content: space-between
		border: 1px solid var(--border-color)
		border-left: none
		border-right: none
		line-height: 1
		.btn
			--bs-btn-padding-y: .25rem
			--bs-btn-padding-x: .5rem
			--bs-btn-border-radius: .15rem
			--bs-btn-font-size: .75rem
			--bs-btn-line-height: 1
			
			margin: -.25rem 1rem
	ul
		height: 0
		background-color: var(--bs-body-bg)
		padding: 0
		list-style: inside none
		margin: 0
		transition: height .2s ease, padding .2s ease
		&.active
			height: calc(var(--sidebar-max-height) - 84px)
	.history-list
		overflow: auto
		a
			display: block
			padding: calc(var(--gutter)/3)
			color: var(--bs-body-color)
			text-decoration: none
			font-size: 14px
			border-left: 6px solid var(--sidebar-hover-bg)
			&.p
				// background-color: rgba(56, 103, 214,0.5)
				border-left-color: rgba(232, 65, 24,0.666)
				&:hover
					// background-color: rgba(56, 103, 214,0.666)
			&.n
				// background-color: rgba(232, 65, 24,0.5)
				border-left-color: rgba(56, 103, 214,0.666)
				&:hover
					// background-color: rgba(232, 65, 24,0.666)
			&:hover
				background-color: var(--sidebar-hover-bg)
	.category-list
		padding: 0
		overflow: hidden
		&.active
			padding: calc(var(--gutter)/3)
		li
			display: inline-block
		button
			display: block
			padding: calc(var(--gutter)/3)
			color: var(--bs-body-color)
			text-decoration: none
			font-size: 14px
			background: none
			border: none
			border-bottom: 4px solid var(--bs-body-color)
			margin: calc(var(--gutter)/4)
			&:disabled
				cursor: default
				color: var(--sidebar-disabled-color)
				border-color: var(--sidebar-disabled-color)
				&:hover
					background: none
			&:hover
				background-color: var(--sidebar-hover-bg)

body.dark .sidebar
	--sidebar-bg: #202020
	--sidebar-hover-bg: #ffffff1f
	--sidebar-disabled-color: #f5cd79

@media (min-width: 992px)
	.sidebar
		--sidebar-max-height: 360px

@media (min-width: 1200px)
	.sidebar
		--sidebar-max-height: 450px

@media (min-width: 1400px)
	.sidebar
		--sidebar-max-height: 540px
</style>