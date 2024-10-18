import { AbsoluteUIComponent } from "../absolute-ui-component/AbsoluteUIComponent";
import { HoldableButton } from "../helpers/holdable-button/holdable-button";
import { useChangeCurrentIndex, useCurrentIndex, useRealtime, useRocketData } from "../rocket-data-context/rocket-data-context";
import styles from "./timeline-selector.module.css"


function PauseIcon() {
    return <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" strokeLinecap="round" strokeLinejoin="round" fill="#ffffff" height="1em">
        <rect x={8} y={6} width={2} height={12}></rect>
        <rect x={14} y={6} width={2} height={12}></rect>
    </svg>
}

function FrameAdvanceIcon() {
    return <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" strokeLinecap="round" strokeLinejoin="round" fill="#ffffff" height="1em">
            <path d="M 5 6 L 14 12 L 5 18 z"/>
            <rect x={14} y={6} width={2} height={12}></rect>
    </svg>
}
function FrameReverseIcon() {
    return <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" strokeLinecap="round" strokeLinejoin="round" fill="#ffffff" height="1em">
            <path d="M 19 6 L 10 12 L 19 18 z"/>
            <rect x={8} y={6} width={2} height={12}></rect>
    </svg>
}



// function HoldabaleButton({ onClick } : { onClick })


export function TimelineSelector() {

    const data = useRocketData();
    // const [ current, setCurrent ] = useCurrentIndex();
    const current = useCurrentIndex();
    const changeCurrentIndex = useChangeCurrentIndex();
    const [realtime, setRealtime ] = useRealtime();

    return <AbsoluteUIComponent>
        <div 
        className={styles.main}
        style={{
            fontSize: `24px`
        }}>
            <div style={{
                fontFamily: `Roboto Mono, monospace`,
                fontSize: `16px`,
                marginBottom: `4px`
            }}>
                <span  style={{
                    color: `#8f8f8f`,
                    marginRight: `4px`,
                    fontSize: `12px`
                }}>
                    Frame 
                </span>
                {current}
                <i
                    style={{
                        color: `#8f8f8f`,
                        marginRight: `4px`,
                        fontSize: `12px`
                    }}
                >{(realtime ? ` (Live)` : ``)}</i>
            </div>
            {/* <input type="range" value={current} onChange={(e) => {
                setCurrent(Math.min(Math.max(Math.floor(parseInt(e.target.value)), 0), 99));
            }}/> */}
            
            <HoldableButton
                style={{
                    display: `inline`
                }}
                onClick={() => {
                    // setCurrent((c) => c-1);
                    changeCurrentIndex(-1);
                }}
            >
                <FrameReverseIcon/>
                </HoldableButton>
            <PauseIcon/>
            <HoldableButton
                style={{
                    display: `inline`
                }}
                onClick={() => {
                    // setCurrent((c) => c+1);
                    changeCurrentIndex(1);

                }}
            >
                <FrameAdvanceIcon/>
            </HoldableButton>
            <HoldableButton
                style={{
                    display: `inline`
                }}
                onClick={() => {
                    // setCurrent((c) => c+10);
                    changeCurrentIndex(10);

                }}
            >
                <FrameAdvanceIcon/>
            </HoldableButton>
            <span
                onClick={() => {
                    setRealtime(true);
                }}
            >

                <FrameAdvanceIcon/>
            </span>
        </div>

    </AbsoluteUIComponent>
}