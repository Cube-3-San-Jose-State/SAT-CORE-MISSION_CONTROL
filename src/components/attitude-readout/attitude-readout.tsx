import { useMemo } from "react";
import { AbsoluteUIComponent } from "../absolute-ui-component/AbsoluteUIComponent";
import { Quart, useCurrentData, Vec3 } from "../rocket-data-context/rocket-data-context";
import styles from "./attitude-readout.module.css";
import { Euler, Quaternion, Vector3 } from "three";
import { useQuaternion } from "../helpers/util/three-react-hooks";
import { RAD_TO_DEG } from "../helpers/util/math";







// const RAD_TO_DEG = RAD_TO_DEG;
/**
 * Readout of attitude and angular rate data.
 * @returns 
 */
export function AttitudeReadout() {
    const current = useCurrentData();
    const orientation = useQuaternion(current?.orientation ?? { x: 0, y: 0, z:0, w: 0 });
    const rates = current?.localAngularRates ?? { x: 0, y: 0, z:0 };
    const euler = useMemo(() => {
        const euler = new Euler(0,0,0, "YZX");
        euler.setFromQuaternion(orientation);
        return euler;
    }, [orientation]);

    return <AbsoluteUIComponent x={0} y={0.5}>
        <div className={styles.main}>
            <table>
                <tr>
                    <th className={styles.label}>Roll</th>
                    <td>{(euler.x * RAD_TO_DEG).toFixed(2)}</td>
                    <th>°</th>
                </tr>
                <tr>
                    <th className={styles.label}>Pitch</th>
                    <td>{(euler.z * RAD_TO_DEG).toFixed(2)}</td>
                    <th>°</th>
                </tr>
                <tr>
                    <th className={styles.label}>Heading</th>
                    <td>{(euler.y * RAD_TO_DEG).toFixed(2)}</td>
                    <th>°</th>
                </tr>
                <tr className={styles.spacer}></tr>
                <tr>
                    <th className={styles.label}>V<sub>r</sub></th>
                    <td>{(rates.x * RAD_TO_DEG).toFixed(2)}</td>
                    <th>°/s</th>
                </tr>
                <tr>
                    <th className={styles.label}>V<sub>p</sub></th>
                    <td>{(rates.z * RAD_TO_DEG).toFixed(2)}</td>
                    <th>°/s</th>
                </tr>
                <tr>
                    <th className={styles.label}>V<sub>y</sub></th>
                    <td>{(rates.y * RAD_TO_DEG).toFixed(2)}</td>
                    <th>°/s</th>
                </tr>
            </table>

        </div>
    </AbsoluteUIComponent>

}
