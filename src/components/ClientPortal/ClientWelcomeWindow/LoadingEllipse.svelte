<script>
</script>

<div class="lds-ellipsis">
	<div />
	<div />
	<div />
	<div />
</div>

<style>
	.lds-ellipsis {
    display: inline-block;
    position: relative;
    width: 12vw;
    height: 1vh;
	}
	.lds-ellipsis div {
    position: absolute;
    top: 0.3vh;
    width: 0.3vw;
    height: 0.3vw;
    border-radius: 50%;
    background: #3c7040;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
	}
	.lds-ellipsis div:nth-child(1) {
		left: 3vw;
		animation: lds-ellipsis1 0.6s infinite;
	}
	.lds-ellipsis div:nth-child(2) {
		left: 3vw;
		animation: lds-ellipsis2 0.6s infinite;
	}
	.lds-ellipsis div:nth-child(3) {
		left: 6vw;
		animation: lds-ellipsis2 0.6s infinite;
	}
	.lds-ellipsis div:nth-child(4) {
		left: 9vw;
		animation: lds-ellipsis3 0.6s infinite;
	}
	@keyframes lds-ellipsis1 {
		0% {
			transform: scale(0);
		}
		100% {
			transform: scale(1);
		}
	}
	@keyframes lds-ellipsis3 {
		0% {
			transform: scale(1);
		}
		100% {
			transform: scale(0);
		}
	}
	@keyframes lds-ellipsis2 {
		0% {
			transform: translate(0, 0);
		}
		100% {
			transform: translate(3vw, 0);
		}
	}
</style>
