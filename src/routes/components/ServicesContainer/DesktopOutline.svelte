<script>
	import { onMount } from "svelte";


	export let text;
	

</script>

<div id="mock-screen">
	<svg
		viewBox="0 0 686 443"
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"
	>
		<defs>
			<rect
				id="path-rrplus2zo2-1"
				x="1.55431223e-15"
				y="0"
				width="651.615496"
				height="408.517811"
				rx="25"
			/>
			<filter
				x="-4.0%"
				y="-6.1%"
				width="108.0%"
				height="112.7%"
				filterUnits="objectBoundingBox"
				id="filter-rrplus2zo2-2"
			>
				<feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1" />
				<feGaussianBlur stdDeviation="8.5" in="shadowOffsetOuter1" result="shadowBlurOuter1" />
				<feColorMatrix
					values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0"
					type="matrix"
					in="shadowBlurOuter1"
				/>
			</filter>
		</defs>
		<g id="Homepage-desktop" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
			<g id="Homepage" transform="translate(-99.000000, -1680.000000)">
				<g id="services-cont" transform="translate(60.000000, 1557.000000)">
					<g id="mock-screen" transform="translate(56.000000, 139.000000)">
						<g id="Rectangle">
							<use
								fill="black"
								fill-opacity="1"
								filter="url(#filter-rrplus2zo2-2)"
								xlink:href="#path-rrplus2zo2-1"
							/>
							<use fill="#A1ADC1" fill-rule="evenodd" xlink:href="#path-rrplus2zo2-1" />
						</g>
						<path
							d="M25,0 L626.615496,0 C640.422615,-2.53632657e-15 651.615496,11.1928813 651.615496,25 L651.615496,28.9658105 L651.615496,28.9658105 L1.55431223e-15,28.9658105 L1.55431223e-15,25 C-1.36572143e-16,11.1928813 11.1928813,2.53632657e-15 25,0 Z"
							id="Rectangle"
							fill="#647289"
						/>
						<ellipse
							id="Oval"
							fill="#44905E"
							cx="62.6948664"
							cy="14.9823158"
							rx="6.16670817"
							ry="5.99292632"
						/>
						<ellipse
							id="Oval"
							fill="#907F44"
							cx="42.1391725"
							cy="14.9823158"
							rx="6.16670817"
							ry="5.99292632"
						/>
						<ellipse
							id="Oval"
							fill="#904444"
							cx="22.6112633"
							cy="14.9823158"
							rx="6.16670817"
							ry="5.99292632"
						/>
					</g>
				</g>
			</g>
		</g>
	</svg>

	{#if text}
		<div id="text-container">
			<div id="title">Custom Web Development</div>
			<div id="examples">
				<p class="row">Small Business Sites</p>
				<p class="row">Weddings & Events</p>
				<p class="row">Blogs, etc.</p>
			</div>
		</div>
	{/if}
</div>

<style>
	#mock-screen {
		width: 35vw;
        position: relative;
	}
    #text-container {
        position: absolute;
        top: 0;
        left: 0;
        padding-left: 3vw;
        padding-top: 4vw;
        width: 32vw;
        color: #3F4042;
        text-align: center;
    }
    #title {
        font-family: openSans-medium;
        font-size: 2vw;
    }
    #examples {
        margin-top: 10px;
        font-size: 1.5vw;
    }
    .row {
        font-family: openSans-light;
        line-height: 4vw;
    }
	@media only screen and (max-width: 615px) {
		#mock-screen {
			width: 100%;
		}
        #text-container {
            width: 100%;
			padding-top: 45px;
			padding-left: 0;
        }
        #title {
            font-size: 5.4vw;
        }  
        .row {
            line-height: 10vw;
            font-size: 4.5vw;
        }
	}
</style>
