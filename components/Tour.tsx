import "shepherd.js/dist/css/shepherd.css";
import React, { CSSProperties, useEffect } from "react";
import { new_script } from "./helpers/scriptLoader"
import $ from 'jquery';
//import draggable from 'jquery-ui/ui/widgets/draggable';


function Start(props) {

    return (
        <button style={STARTTOURStyle}>
            {svgIcon}
        </button>
    );
}
const STARTTOURStyle: CSSProperties = {
    position: "absolute",
    right: 0,
    bottom: "4px",
    background: "none",
    padding: 0,
    border: "none",
};
const svgIcon = (
    <svg
        width="72"
        height="108"
        viewBox="0 0 72 108"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M32 0C14.3269 0 0 14.3269 0 32C0 49.6731 14.3269 64 32 64H67V100C67 104.418 70.5817 108 75 108H360C364.418 108 368 104.418 368 100V8C368 3.58172 364.418 0 360 0H67.4842H67H32Z"
            fill="#FF4842"
        />
        <path
            d="M49.5593 19H24.2527C22.5129 19 21.1052 20.35 21.1052 22L21.0894 49L27.416 43H49.5593C51.2991 43 52.7226 41.65 52.7226 40V22C52.7226 20.35 51.2991 19 49.5593 19ZM30.5793 37H27.416V34H30.5793V37ZM30.5793 32.5H27.416V29.5H30.5793V32.5ZM30.5793 28H27.416V25H30.5793V28ZM40.0693 37H35.3243C34.4544 37 33.7426 36.325 33.7426 35.5C33.7426 34.675 34.4544 34 35.3243 34H40.0693C40.9392 34 41.6509 34.675 41.6509 35.5C41.6509 36.325 40.9392 37 40.0693 37ZM44.8143 32.5H35.3243C34.4544 32.5 33.7426 31.825 33.7426 31C33.7426 30.175 34.4544 29.5 35.3243 29.5H44.8143C45.6842 29.5 46.3959 30.175 46.3959 31C46.3959 31.825 45.6842 32.5 44.8143 32.5ZM44.8143 28H35.3243C34.4544 28 33.7426 27.325 33.7426 26.5C33.7426 25.675 34.4544 25 35.3243 25H44.8143C45.6842 25 46.3959 25.675 46.3959 26.5C46.3959 27.325 45.6842 28 44.8143 28Z"
            fill="white"
        />
    </svg>
);

function CustomTour({ slug }) {

    useEffect(() => {
        new_script("../shepherd.min.js");
        new_script("../jquery.min.js").then(() => {
            new_script("../jquery-ui.js");
            new_script("../jquery.ui.touch-punch.js");
            if (slug === '4bda4814-a2b1-4c4f-b102-eda5181bd0f8' || slug === 'e0c38e50-cbb3-455f-ae16-d737fc624b24' || slug === '7adbaaff-0e03-41b4-a2e1-81b40fd56dfc') {
                import(`../shepherd/${slug}_shepherd.js`)//.then(res => console.log(res))
            }
            window["amber_ref"] = () => {
                $("#amber_ref").toggle("slow");
                $("#amber_ref" + "_btn").toggle();
            }
        });


        return document
            .getElementById("soundBtn")
            .removeEventListener("click", () => { });
    }, []);



    return (
        <>
            {/* <script src="../shepherd/shepherd.min.js "></script > */}
            {/* <ShepherdTour steps={[]} tourOptions={tourOptions}>
                <TourMethods>
                    {(tourContext) => <Start startTour={tourContext} setTour={setTour} />}
                </TourMethods>
            </ShepherdTour> */}
            {/* <Start /> */}
        </>
    );
}

export default CustomTour;
