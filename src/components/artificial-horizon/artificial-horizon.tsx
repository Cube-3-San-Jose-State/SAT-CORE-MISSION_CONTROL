import { Fragment, useMemo } from "react";
import { WidgetGroup } from "../Widget";
import { AbsoluteUIComponent } from "../absolute-ui-component/AbsoluteUIComponent";
import { Quart, useCurrentData } from "../rocket-data-context/rocket-data-context";
import { Euler, Quaternion } from "three";
import { DEG_TO_RAD, METERS_TO_FEET, RAD_TO_DEG, ROOT_2 } from "../helpers/util/math";



function useQuaternion(x:Quart) {
    return useMemo(() => {
        return new Quaternion(x.x, x.y, x.z, x.w);
    }, [x.x, x.y, x.z, x.w]);
}

/**
 * Artificial horizon, inspired by aircraft.
 * @returns 
 */
export default function ArtificialHorizon() {


    const M_T_FT = METERS_TO_FEET;
    const R_T_D = RAD_TO_DEG;
    const D_T_R = DEG_TO_RAD;
    const RT_2 = ROOT_2;

    // let [pitch, setPitch] = useState(0);
    // let [roll, setRoll] = useState(0);
    // roll = roll ?? 0;
    // pitch = pitch ?? 0;

    const current = useCurrentData();

    const orientation = useQuaternion(current?.orientation ?? { x: 0, y: 0, z: 0, w: 1});
    const euler = useMemo(() => {
        const a = new Euler(0, 0, 0, "ZYX");
        a.setFromQuaternion(orientation);
        return a;
    }, [orientation]);
    const roll = euler.x * R_T_D;
    const pitch = euler.z * R_T_D;
    // let altitude = 0;

    const pitchTicks = [];
    for(let angle = -36; angle <= 36; angle ++) {
        let width = 2;
        let hasText = false;
        if(angle % 4 == 0) {
            width = 10;
            hasText = true;
        }else if(angle % 2 == 0) {
            width = 8;
            // hasText = true;
        }
        pitchTicks.push({value: angle * 2.5, width: width, hasText: hasText});
    }

    const pitchScale = 1;

    const minRoll = -30;
    const maxRoll = 30;
    const rollTickDist = 16;

    const rollTicks = [];
    for(let angle = minRoll; angle <= maxRoll; angle += 10) {
        let width = 2;
        if(angle % 30 == 0) {
            width = 2;
        }else if(angle % 10 == 0) {
            width = 1;
        }
        rollTicks.push({value: angle * Math.PI / 180, width: width});
    }

    let pitchSetpointLocation;
    // 10 * 10 + y*y < rollTickDist - 2 ^ 2
    // if(pitchSetpoint != null){
    //     pitchSetpointLocation = Math.min(Math.max(-(pitchSetpoint - pitch) * pitchScale, -Math.sqrt((rollTickDist - 1) * (rollTickDist - 1) - 100)), 16);
    // }
    
    return (
        <AbsoluteUIComponent aspect={1} width={200} x={0.5} y={0.7}>
            <svg style={{width: "100%", height: "100%"}} viewBox="20 20 40 40" xmlns="http://www.w3.org/2000/svg" strokeLinecap="round" strokeLinejoin="round" stroke="black" width="128px">
            
            {/* Pitch Indicator Clipping */}
            <clipPath id="roll-pitch-clip">
                <circle cx="40" cy="40" r={rollTickDist-2}></circle>
                <rect x={0} y={40} width={80} height={40} rx={10}></rect>
            </clipPath>
            {/* Artificial Horizon Clipping */}
            <clipPath id="artificial-horizon-clip">
                {/* <rect x={20} y={20} width={40} height={40} rx={10}></rect> */}

                <circle cx="40" cy="40" r="20"></circle>
            </clipPath>
            
            <g clipPath="url(#artificial-horizon-clip)">
                <g transform={`rotate(${-roll}, 40, 40)`} strokeWidth="0.15" >
                    {/* Artificial Horizon */}
                    <g>
                        <rect x={0} y={-80+pitch * pitchScale} width={80} height={160} stroke="none" fill="#77ccff"></rect>
                        <rect x={0} y={40+pitch * pitchScale} width={80} height={160} stroke="none" fill="#9e532e"></rect>
                    </g>


                    {/* Rolled Pitch Indicator */}
                    <path fill="none" d={`M 40 ${40-rollTickDist + 0.5} L 39.5 ${40-rollTickDist + 1.5} L 40.5 ${40-rollTickDist + 1.5} L 40 ${40-rollTickDist + 0.5}`}></path>
                    
                    {/* Pitch Setpoint Indicator */}
                    {(pitchSetpointLocation != null ? 
                        <g>
                            <path fill="none" d={`M 30 ${pitchSetpointLocation + 40} L 29 ${pitchSetpointLocation + 39.5} L 29 ${pitchSetpointLocation + 40.5} L 30 ${pitchSetpointLocation + 40}`}></path>
                            <path fill="none" d={`M 50 ${pitchSetpointLocation + 40} L 51 ${pitchSetpointLocation + 39.5} L 51 ${pitchSetpointLocation + 40.5} L 50 ${pitchSetpointLocation + 40}`}></path>    
                        </g> : <></>
                    )}
                    
            
                    {/* // Pitch Indicator */}
                    <g clipPath="url(#roll-pitch-clip)">
                        {
                            pitchTicks.map((tick, i) => {
                                return (<Fragment key={i}>
                                    <path d={`M ${40 - tick.width / 2} ${-(tick.value - pitch) * pitchScale + 40} L ${40 + tick.width / 2} ${-(tick.value - pitch) * pitchScale + 40}`}></path>
                                    {
                                        (tick.hasText ? 
                                            <>
                                                <text stroke="none" x={42 + tick.width / 2} y={-(tick.value - pitch) * pitchScale + 40} textAnchor="start" dominantBaseline="central" fontSize="2px">{tick.value}</text>
                                                <text stroke="none" x={38 - tick.width / 2} y={-(tick.value - pitch) * pitchScale + 40} textAnchor="end" dominantBaseline="central" fontSize="2px">{tick.value}</text>
                                            </> 
                                            : 
                                            <></>)
                                    }
                                </Fragment>)
                            })
                        }
                    </g>
                </g>

            </g>
            {/* Roll Indicator */}
            <g fill="none" strokeWidth="0.2">
                <path d={`M ${rollTickDist * Math.sin(minRoll * Math.PI / 180) + 40} ${- rollTickDist * Math.cos(minRoll * Math.PI / 180) + 40} A ${rollTickDist} ${rollTickDist} 0 0 1 ${rollTickDist * Math.sin(maxRoll * Math.PI / 180) + 40} ${- rollTickDist * Math.cos(maxRoll * Math.PI / 180) + 40}`}></path>
                {
                    rollTicks.map((tick, key) => {
                        return <path key={key} d={`M ${rollTickDist * Math.sin(tick.value) + 40} ${- rollTickDist * Math.cos(tick.value) + 40} L ${(rollTickDist + tick.width) * Math.sin(tick.value) + 40} ${- (rollTickDist + tick.width) * Math.cos(tick.value) + 40}`}></path>
                
                    })
                }
                {/* {#each rollTicks as tick}
                <path d={`M ${rollTickDist * Math.sin(tick.value) + 40} ${- rollTickDist * Math.cos(tick.value) + 40} L ${(rollTickDist + tick.width) * Math.sin(tick.value) + 40} ${- (rollTickDist + tick.width) * Math.cos(tick.value) + 40}`}></path>
                {/each} */}
            </g>
            {/* Roll Setpoint Indicator */}
            {
                // (rollSetpoint != null ? 
                //     <g transform={`rotate(${-rollSetpoint}, {}, 40)`}>
                //         <path d={`M 40 ${40-rollTickDist - 2.5} L 39.5 ${40-rollTickDist-2.5 -1} L 40.5 ${40-rollTickDist- 2.5- 1} L 40 ${40-rollTickDist -2.5}`} strokeWidth="0.2" stroke="black" fill="none"></path>
                //     </g> : <></>)
            }
            {/* // Center Crosshair */}
            <g strokeWidth="0.28" fill="none">
                <path d="M 37 40 L 39.5 40"></path>
                <path d="M 43 40 L 40.5 40"></path>
                <path d="M 39.5 40 L 39.5 41"></path>
                <path d="M 40.5 40 L 40.5 41"></path>
                {/* <circle cx="40" cy="40" r="1"></circle> */}
            </g>
            
            {/* // Altitude Indicator */}
            {/* <g>
                <rect x="65" y="38" width="10" height="4" strokeWidth="0.15" fill="none" stroke="black"></rect>
                <text stroke="none" x="74" y="40" textAnchor="end" dominantBaseline="central" fontSize="2px">{(altitude).toFixed(2)}</text>
            </g> */}
        </svg>
        </AbsoluteUIComponent>)
}
