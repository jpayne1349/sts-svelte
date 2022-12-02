
<script>


</script>


<a id='button' href='/contact-us' >
    <div id='text'>Contact Us</div>
    <div id='icon' >
        <svg id="curly" viewBox="0 0 24 28" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <defs>
                <text id="text-z63l18mwym-1" font-family="OpenSans-Regular, Open Sans" font-size="29" font-weight="normal" fill="#898F99">
                    <tspan x="237.125" y="53">{'{}'}</tspan>
                </text>
                <filter x="-13.6%" y="-2.6%" width="118.2%" height="110.3%" filterUnits="objectBoundingBox" id="filter-z63l18mwym-2">
                    <feOffset dx="-1" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                    <feGaussianBlur stdDeviation="0.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
                    <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
                </filter>
            </defs>
            <g id="Homepage-desktop" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" fill-opacity="1">
                <g id="Homepage" transform="translate(-360.000000, -474.000000)" fill="#898F99">
                    <g  transform="translate(125.000000, 442.000000)">
                        <use filter="url(#filter-z63l18mwym-2)" xlink:href="#text-z63l18mwym-1"></use>
                        <use xlink:href="#text-z63l18mwym-1"></use>
                    </g>
                </g>
            </g>
        </svg>
    </div>
</a>

<style>
    #button {
        display: flex;
        font-family: openSans-light;
        color: white;
        width: 17vw;
        text-decoration: none;
        font-size: 1.7vw;
        background: #3c5071;
        box-shadow: 0px 1px 2px black;
        border-radius: 5px;
        padding: 5px;
        line-height: 3vw;
        justify-content: space-between;
        margin-right: 10px;
        cursor: pointer;
        transition: all 0.2s;
    }
    #button:hover {
      transform: translateY(1px);
    
    }
    #text {
        margin-left: 5px;
    }

    #icon {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #curly {
        height: 2vw;
        margin-right: 5px;
        
        padding-right: 2px;
        margin-top: 1px;
    }

    @media only screen and (max-width: 615px) {
       #button {
            width: 40vw;
            box-shadow: -1px 0.5px 0 0 #121E31;
            font-size: 4vw;
            padding: 10px;
            line-height: 5vw;
        }  
        #curly {
            height: 3vw;
        }
    }

</style>