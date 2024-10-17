import { AbsoluteUIComponent } from "../absolute-ui-component/AbsoluteUIComponent";
import { HoldableButton } from "../helpers/holdable-button/holdable-button";
import { useCurrentIndex, useRocketData, useRocketDataClear } from "../rocket-data-context/rocket-data-context";
import styles from "./rocket-data-manager.module.css"


// function PauseIcon() {
//     return <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" strokeLinecap="round" strokeLinejoin="round" fill="#ffffff" height="1em">
//         <rect x={8} y={6} width={2} height={12}></rect>
//         <rect x={14} y={6} width={2} height={12}></rect>
//     </svg>
// }

// function FrameAdvanceIcon() {
//     return <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" strokeLinecap="round" strokeLinejoin="round" fill="#ffffff" height="1em">
//             <path d="M 5 6 L 14 12 L 5 18 z"/>
//             <rect x={14} y={6} width={2} height={12}></rect>
//     </svg>
// }
// function FrameReverseIcon() {
//     return <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" strokeLinecap="round" strokeLinejoin="round" fill="#ffffff" height="1em">
//             <path d="M 19 6 L 10 12 L 19 18 z"/>
//             <rect x={8} y={6} width={2} height={12}></rect>
//     </svg>
// }



// function HoldabaleButton({ onClick } : { onClick })


export function RocketDataManager() {

    const clear = useRocketDataClear();
    // const data = useRocketData();
    // const [ current, setCurrent ] = useCurrentIndex();

    return <AbsoluteUIComponent x={0.8} y={0.3}>
        <div 
        className={styles.main}
        style={{
            fontSize: `24px`
        }}>
            
            <button
                    onClick={() => {
                        // serial.clear();
                        clear();
                    }}
                >Clear Data</button>
        </div>

    </AbsoluteUIComponent>
}