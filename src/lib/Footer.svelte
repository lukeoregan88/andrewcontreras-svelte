<script>
	import { page } from '$app/stores';

	const year = new Date().getFullYear();

	const fnavs = [
		{
			title: 'Privacy Policy',
			href: '/privacy-policy'
		},
		{
			title: 'Cookies',
			href: '/cookies'
		}
	];

	$: url = $page.url.href;
	$: routeId = $page.url.pathname;
</script>

<footer class="site-footer">
	<nav class="footer-menu">
		<ul>
			{#each fnavs as { title, href }}
				<li>
					<a {href} class:active={href === '/' ? routeId === '/' : url.includes(href)} {title}
						>{title}</a
					>
				</li>
			{/each}
			<li><a href="/">Andrew Contreras Gibson &copy; {year}</a></li>
		</ul>
	</nav>
</footer>

<style lang="scss">
	.site-footer {
		background-color: #ffffff;
		color: #000000;
		padding: 1rem 0 100px 0;
		@media screen and (min-width: 768px) {
			padding: 1rem 0;
		}
	}

	.footer-menu {
		display: flex;
		justify-content: center;
		ul {
			display: flex;
			list-style: none;
			padding: 0;
			margin: 0;
			flex-direction: column;
			@media (min-width: 992px) {
				flex-direction: row;
			}
			li {
				margin: 0 0.5rem;
				text-align: center;
				a {
					color: var(--color-white);
					text-decoration: none;
					padding: 10px;
					display: block;
					&:hover {
						text-decoration: underline;
					}
					&.active {
						text-decoration: underline;
					}
				}
			}
		}
	}
</style>
