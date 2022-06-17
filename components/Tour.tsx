//import "shepherd.js/dist/css/shepherd.css";
import React, { useEffect } from "react";
import { new_script } from "./helpers/scriptLoader"
import $ from 'jquery';
//import draggable from 'jquery-ui/ui/widgets/draggable';



function CustomTour({ slug }) {

    useEffect(() => {
        (async () => {
            await new_script("../shepherd.min.js");
            await new_script("../jquery.min.js");
            await new_script("../jquery-ui.js");
            await new_script("../jquery.ui.touch-punch.js");

            if (slug === '4bda4814-a2b1-4c4f-b102-eda5181bd0f8' || slug === 'e0c38e50-cbb3-455f-ae16-d737fc624b24' || slug === '7adbaaff-0e03-41b4-a2e1-81b40fd56dfc') {
                await import(`../shepherd/${slug}_shepherd.js`)
            }
            window["amber_ref"] = () => {
                $("#amber_ref").toggle("slow");
                $("#amber_ref" + "_btn").toggle();
            }
        })()
    }, [slug]);


    return (<> </>);
}

export default CustomTour;
