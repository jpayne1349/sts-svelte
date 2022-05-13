<!-- TODO: if firebase init fails, the contact container should error out. and the node server should contact us to fix.. -->

<!-- TODO: create the terms of service and privacy policy -->

<!-- TODO: we should actually write a test to check if the form is working, and send an error some other way. -->

<!-- TODO: setup an email trigger off the firebase document creation -->

<script>

import ServicesContainer from '../components/ServicesContainer/ServicesContainer.svelte';
import PricingContainer from '../components/PricingContainer/PricingContainer.svelte';
import ContactContainer from '../components/ContactContainer/ContactContainer.svelte';
import LandingContainer from '../components/LandingView/LandingContainer.svelte';


</script>

<LandingContainer />

<ServicesContainer />
<PricingContainer />
<ContactContainer />

