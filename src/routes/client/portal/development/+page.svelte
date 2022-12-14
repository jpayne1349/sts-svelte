<script>
	import { sessionStore } from '../../stores';
	import Event from '../Event.svelte';
</script>

<div class="container">
	<section>
		<div class="information-row">
			<p class="label">Active Links:</p>
			<!-- loop through active links -->
			{#each $sessionStore.service_log.active_links as link, index}
				<a class="service-link" href={link}>Production/Public</a>
			{/each}
		</div>

		<div class="information-row">
			<p class="label">Preview Links:</p>
			<!-- loop through active links -->
			{#each $sessionStore.service_log.preview_links as link, index}
				<a class="service-link" href={link}>Latest Update</a>
			{/each}
		</div>

		<div class="information-row">
			<p class="label">Codebase/Repo:</p>

			<p class="data">
				{#if $sessionStore.service_log.code_repo}
					<a class="service-link" href={$sessionStore.service_log.code_repo}>Public Project Files</a
					>
				{/if}
			</p>
		</div>

		<div class="information-row events">
			<p class="label events">Event Log</p>
			<div class="hide-scrollbar">
				<div class="events-container">
					{#each $sessionStore.service_log.events as event}
						<Event description={event.description} type={event.type} time={event.time} />
					{/each}
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	.container {
		margin-bottom: 4vh;
		box-shadow: var(--box-shadow);
		position: relative;
	}
	section {
		padding: 15px 0;
		margin-bottom: 30px;
	}
	.information-row {
		display: flex;
		padding: 15px 0;
		border-bottom: 1px solid var(--bar-color);
		align-items: center;
		font-size: 16px;
	}
	.information-row.events {
		flex-direction: column;
		align-items: center;
	}
	.label {
		font-family: openSans-light;
		margin-right: 5px;
		font-size: 16px;
		position: relative;
	}
	.label.events {
		font-family: openSans-regular;
		align-self: flex-start;
		position: static;
	}
	.data {
		font-family: openSans-medium;
		font-size: 16px;
	}
	.hide-scrollbar {
		width: 100%;
		box-sizing: content-box;
		overflow-x: hidden;
	}
	.events-container {
		display: flex;
		flex-direction: column;
		width: calc(100% + 15px);
		align-items: center;
		max-height: 300px;
		overflow-y: scroll;
	}
	.service-link {
		color: var(--link);
		font-family: openSans-light;
		text-decoration: underline;
	}

	@media only screen and (max-width: 500px) {
		.events-container {
			width: 100%;
		}
	}
</style>
