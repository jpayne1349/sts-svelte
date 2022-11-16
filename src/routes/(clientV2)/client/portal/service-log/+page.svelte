<script>

    import { sessionStore } from '../../stores'


</script>

<div class="container" >
	<section>

			<div class="information-row">
				<p class="label">Active Links:</p>
                <!-- loop through active links -->
                {#each $sessionStore.service_log.active_links as link}
				<p class="data">{link}</p>
                {/each}
			</div>

            <div class="information-row">
				<p class="label">Preview Links:</p>
                <!-- loop through active links -->
                {#each $sessionStore.service_log.preview_links as link}
				<p class="data">{link}</p>
                {/each}
			</div>
		

		<div class="information-row">
			<p class="label">Codebase/Repo:</p>

			<p class="data">{$sessionStore.service_log.code_repo}</p>
		</div>

		<div class="information-row events">
			<p class="label events">Event Log</p>
            <!-- TODO: might have to sort these chronologically, not sure yet. -->
			{#each $sessionStore.service_log.events as event}
                {event.title}
            {/each}

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
		border-bottom: 1px solid var(--bar-blue);
		align-items: center;
		font-size: 16px;
	}
    .information-row.events {
        flex-direction: column;
        align-items: flex-start;
    }
	.label {
		font-family: openSans-light;
		margin-right: 5px;
		font-size: 16px;
		position: relative;
	}
    .label.events {
        font-family: openSans-regular;
    }
	.data {
		font-family: openSans-medium;
		font-size: 16px;
	}
	.text-link {
		font-family: openSans-bolditalic;
        text-decoration: underline;
		background-color: transparent;
		color: var(--dark-blue);
		box-shadow: none;
		padding: 0;
		margin: 25px 0 0 15px;
        position: relative;	
	}
	.edit-button {
		background-color: transparent;
		box-shadow: none;
		padding: 0;
		margin: 0 0 0 auto;
	}
	.edit-button img {
		width: 20px;
	}

@media only screen and (max-width: 500px) {
    
}

</style>