<script>

    import { Timestamp } from 'firebase/firestore';

    export let description;
    export let type;
    export let time;

let timestamp_string = time.toDate();
timestamp_string = String(timestamp_string);

let displayed_date = timestamp_string.slice(4,10);

let displayed_time = timestamp_string.slice(16,21);


</script>


<div class='event-container'>

    <p class='desc' >{description}</p>

    <div class='info-row'>
    
    <p class='timestamp'>{displayed_date}, {displayed_time}</p>

    <div class='type' class:billing={type=='billing'}>{type}</div>
    
    </div>

</div>

<style>

.event-container {

    display: flex;
    flex-direction: column;
    width: 100%;
    border-left: 1px solid var(--bar-blue);
    margin-top: 15px;
    padding: 0px 10px;
    /* border-radius: 5px; */
    
}
.desc {
    font-family: openSans-medium;
    font-size: 0.9em;
}

.info-row {
    display: flex;
    font-family: openSans-regular;
    font-size: 12px;
    justify-content: space-between;
    margin: 4px 0;
    align-items: center;
}
.timestamp {
    color: var(--bar-blue);
}
.type {
    padding: 2px 5px;
    border-radius: 5px;
    background-color: #6c92c328;
    border: 1px solid var(--button-light-blue);
    color: var(--button-light-blue);
    font-family: openSans-semibold;
    font-size: 8px;
}
.type.billing {
    background-color: #7aa66f1e;
    border: 1px solid var(--global-green);
    color: var(--global-green);
    
    }

@media only screen and (max-width: 500px) {
    .desc {
        font-size: 14px;
    }
}


</style>