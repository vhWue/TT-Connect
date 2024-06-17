import React from "react";
import Svg, { G, Rect, Defs, Stop } from "react-native-svg";

export function Bg_Rectangle() {
    return (
        <Svg width="390" height="626" viewBox="0 0 390 626" fill="none" xmlns="http://www.w3.org/2000/svg">
            <G filter="url(#filter0_d_599_634)">
                <Rect x="-222" y="6.35031" width="190" height="865" transform="rotate(-45 -222 6.35031)" fill="url(#paint0_linear_599_634)" fill-opacity="0.6" shape-rendering="crispEdges" />
            </G>
            <Defs>
                <filter id="filter0_d_599_634" x="-226" y="-128" width="753.998" height="753.998" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="2" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_599_634" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_599_634" result="shape" />
                </filter>
                <linearGradient id="paint0_linear_599_634" x1="-52.4002" y1="488.58" x2="-97.1258" y2="34.6035" gradientUnits="userSpaceOnUse">
                    <Stop stop-color="#FF2323" stop-opacity="0.65" />
                    <Stop offset="1" stop-color="#FF2323" stop-opacity="0" />
                </linearGradient>
            </Defs>
        </Svg>


    );
}