<script>
	import '../global.css';
	import CookiePopup from './components/CookiePopup.svelte';
	import MobileNav from './components/MobileNav.svelte';
	import LogoIconOnly from './components/LogoIconOnly.svelte';
	import { fly } from 'svelte/transition';
	import { cookiePopupStore, sessionStore } from './client/stores';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import LogoNoIcon from './components/LogoNoIcon.svelte';

	// receives the policyCookieSet bool to halt the cookiepopup if necessary
	export let data;
	cookiePopupStore.set(data);

	let blurringBg = false;
    let inClientPortal = false;


	page.subscribe((data) => {
		if (browser) {
			
				if (data.url.pathname.includes('client')) {
					document.body.classList.add('client');
                    inClientPortal = true;
				} else {
					document.body.classList.remove('client');
                    inClientPortal = false;
				}
		}
	});

	let scrollY;
	let currentScroll;

	let scrollingUp = false;
	let scrollingDown = false;
	let navComponent;
	let clientPortalLink = '/client';

	// handling the navbar movement while scrolling
	$: {
		if (scrollY > currentScroll && !scrollingDown) {
			// scrollingDown
			if (scrollY < 150) {
				scrollingDown = false;
				scrollingUp = false;
			} else {
				scrollingDown = true;
				scrollingUp = false;
			}
		}

		if (scrollY < currentScroll && scrollingDown) {
			// scrollingUp
			scrollingDown = false;
			scrollingUp = true;
		}

		currentScroll = scrollY;
	}

	$: if($sessionStore.logged_in) {
		clientPortalLink = '/client/portal/overview';
	} else {
		clientPortalLink = '/client';
	}
</script>

<svelte:head>
    {#if inClientPortal}
        <meta name="theme-color" content="#FFFFFF" />
    {:else}
	<meta name="theme-color" content="#020d1f" />
    {/if}
</svelte:head>

<svelte:window bind:scrollY />

<div class="logo-wrapper">
	<a href="/" alt="South Texas Sofware Homepage"> <LogoIconOnly /> </a>
</div>

<nav class="navbar" class:show={scrollingUp} class:hide={scrollingDown}>
	<a class="desktop-link" href="/services" alt="Services">Services</a>
	<a class="desktop-link" href="/pricing" alt="Services">Pricing</a>

	<a class="logo-no-icon" href="/">
		<LogoNoIcon />
	</a>

	<a class="desktop-link" href="/contact-us" alt="Services">Contact</a>
	<a class="desktop-link" href={clientPortalLink} alt="Services">Client Portal</a>
	<MobileNav />
</nav>

<slot />

<CookiePopup />

<footer class="footer">
	<a href="https://southtexas.software/terms-of-use" class="footer-link ">Terms of Use</a>
	<a href="https://southtexas.software/privacy-policy" class="footer-link">Privacy Policy</a>

	<a href="https://southtexas.software/cookie-policy" class="footer-link optional">Cookie Policy</a>

	<a href="https://southtexas.software/contact-us" class="footer-link ">Contact</a>
</footer>

<style>
	.navbar {
		display: flex;
		height: 50px;
		justify-content: center;
		width: 100%;
		align-items: center;
		transition: transform 0.3s ease-in-out;
		z-index: 30;
		position: sticky;
		margin-top: 110px;
	}
	.navbar.show {
		top: 0;
		left: 0;
		transform: translateY(0);
		
	}
	.navbar.hide {
		transform: translateY(-100%);
	}
	.navbar a {
		font-family: openSans-medium;
		color: var(--text);
		margin: 0 25px;
		z-index: 50;
	}
	.logo-wrapper {
		position: absolute;
		width: 100%;
		padding-right: 50px;
		top: 0;
		left: 0;
		height: 15vh;
		background-color: transparent;
		z-index: 20;
		display: flex;
		justify-content: center;
	}
	.footer {
		display: flex;
		width: 700px;
		justify-content: space-around;
		margin: 3vh 0 5vh 0;
		user-select: none;
	}
	.footer-link {
		color: var(--text);
		font-size: 14px;
		font-family: openSans-semibold;
	}

	@media only screen and (max-width: 500px) {
		.navbar {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			margin-top: 0px;
			
		}

		.desktop-link,
		.logo-wrapper {
			display: none;
		}
		.footer {
			display: flex;
			width: 80vw;
			justify-content: space-around;
			margin: 7vh 0 3vh 0;
		}
		.footer-link {
			color: #858d9a;
			font-size: 3vw;
			font-family: openSans-semibold;
		}
		.footer-link.optional {
			display: none;
		}
	}
</style>
