<script>
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';
	import Logo from '$lib/images/ac_logo.svg';

	const navs = [
		{
			title: 'About',
			href: '/about'
		},
		{
			title: 'Advertising',
			href: '/advertising'
		},
		{
			title: 'Music',
			href: '/music'
		},
		{
			title: 'Films',
			href: '/films'
		},
		{
			title: 'Documentaries',
			href: '/documentaries'
		},
		{
			title: 'Contact',
			href: '/contact'
		}
	];

	$: url = $page.url.href;
	$: routeId = $page.url.pathname;

	let menuOpen = false;
	function handleClick() {
		menuOpen = !menuOpen;
	}

	// Set the height of the global-lead
	//fallback is in css
	let headerHeight;
	let leadHeight;

	const setLeadHeight = () => {
		const header = document.querySelector('.site-header');
		headerHeight = header.offsetHeight;
		const homepageLead = document.querySelector('.global-lead');
		if (homepageLead) {
			const windowHeight = window.innerHeight;
			leadHeight = windowHeight - headerHeight;
			homepageLead.style.height = `${leadHeight}px`;
		}
	};

	onMount(() => {
		if (browser) {
			setLeadHeight();
			window.addEventListener('resize', setLeadHeight);
			window.onload = setLeadHeight;
		}
	});

	onDestroy(() => {
		if (browser) {
			window.removeEventListener('resize', setLeadHeight);
		}
	});
</script>

<div class="header-overlay">
	<header class="site-header">
		<div class="site-branding">
			<a href="/">
				<img src={Logo} alt="Andrew Contreras" class="custom-logo" />
			</a>
		</div>
		<nav class="main-navigation">
			<button on:click|stopPropagation={handleClick} aria-hidden="true">
				{#if menuOpen}
					Close Menu
				{:else}
					Open Menu
				{/if}
			</button>
			<ul class="main-menu" class:menuOpen>
				{#each navs as { title, href }}
					<li>
						<a {href} class:active={href === '/' ? routeId === '/' : url.includes(href)} {title}
							>{title}</a
						>
					</li>
				{/each}
			</ul>
		</nav>
	</header>
</div>

<style lang="scss">
	.header-overlay {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 100;
		height: auto;
		width: 100%;
		display: flex;
		align-items: flex-end;
		pointer-events: none;
		@media screen and (min-width: 768px) {
			position: sticky;
			left: 0;
			top: 0;
		}
	}
	.site-header {
		pointer-events: all;
		left: 0;
		position: sticky;
		top: 0;
		width: 100%;
		z-index: 20;
		display: flex;
		background-color: #000;
		.site-branding {
			background-color: #fff;
			width: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
			z-index: 300;
			@media screen and (min-width: 768px) {
				width: auto;
			}

			> a {
				display: flex;
				align-items: center;
			}
			.custom-logo {
				width: 100px;
				padding: 5px;
				//filter: brightness(0) invert(1);
				max-height: 70px;
			}
		}
	}

	.main-navigation {
		width: 100%;
		display: flex;
		justify-content: flex-end;
		align-items: stretch;

		button {
			width: 100%;
			background-color: transparent;
			border: none;
			z-index: 300;
			@media screen and (min-width: 768px) {
				display: none;
			}
		}

		ul {
			// display: flex;
			display: none;
			list-style: none;
			margin: 0;
			padding-left: 0;
			width: 100%;
			@media screen and (min-width: 768px) {
				display: flex;
			}
			&.menuOpen {
				@media screen and (max-width: 768px) {
					position: fixed;
					left: 0;
					top: 0;
					width: 100%;
					height: 100vh;
					background-color: rgba(0, 0, 0, 0.97);
					z-index: 200;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					padding: 30px;
				}
			}
		}

		li {
			position: relative;
			border: 1px solid #fff;
			display: flex;
			align-items: center;
			width: 100%;
			justify-content: center;

			&:hover {
				background-color: #fff;
				transition: background-color 0.5s ease;
				> a {
					color: #000;
				}
			}
			@media screen and (max-width: 768px) {
				border-left: 0;
				border-right: 0;
			}
		}

		a {
			display: block;
			text-decoration: none;
			padding: 10px;
			color: #ffffff;
			width: 100%;
			text-align: center;
			font-family: 'Gloock', serif;
			text-transform: uppercase;
		}

		// .current_page_item > a,
		// .current-menu-item > a,
		// .current_page_ancestor > a,
		// .current-menu-ancestor > a {
		// }
	}
</style>
