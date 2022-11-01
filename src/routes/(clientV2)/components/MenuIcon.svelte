<script>


</script>


<div class='menu-icon-container'>

    <div class='menu-icon-bar one'/>
    <div class='menu-icon-bar two'/>
    <div class='menu-icon-bar three'/>
    
</div>


<style>
    

    @media only screen and (max-width: 500px) {
        .menu-icon-container {
            display: flex;
            flex-direction: column;
            width: 6vw;
            height: 6vw;
            position:absolute;
            right: 10vw;
            top: 4vh;
            justify-content: space-around;
            cursor: pointer;
            user-select: none;
        }
        .menu-icon-bar{
            position: absolute;
            content: '';
            width: 100%;
            height: 3px;
            background-color: var(--dark-blue);
            border-radius: 5px;
            transition: all 0.5s;
        }
        .menu-icon-bar.one {
            transform: translateY(-8px);
        }
        .menu-icon-bar.three {
            transform: translateY(8px);
        }



    }

</style>