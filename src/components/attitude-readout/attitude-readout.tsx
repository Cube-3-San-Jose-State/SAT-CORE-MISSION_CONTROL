import { useMemo } from "react";
import { AbsoluteUIComponent } from "../absolute-ui-component/AbsoluteUIComponent";
import { Quart, useCurrentData, Vec3 } from "../rocket-data-context/rocket-data-context";
import styles from "./attitude-readout.module.css";
import { Euler, Quaternion, Vector3 } from "three";







function useVector3(x:Vec3) {
    return useMemo(() => {
        return new Vector3(x.x, x.y, x.z);
    }, [x.x, x.y, x.z]);
}


function useQuaternion(x:Quart) {
    return useMemo(() => {
        return new Quaternion(x.x, x.y, x.z, x.w);
    }, [x.x, x.y, x.z, x.w]);
}

const R_T_D = 180 /Math.PI;
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
                    <td>{(euler.x * R_T_D).toFixed(2)}</td>
                    <th>°</th>
                </tr>
                <tr>
                    <th className={styles.label}>Pitch</th>
                    <td>{(euler.z * R_T_D).toFixed(2)}</td>
                    <th>°</th>
                </tr>
                <tr>
                    <th className={styles.label}>Heading</th>
                    <td>{(euler.y * R_T_D).toFixed(2)}</td>
                    <th>°</th>
                </tr>
                <tr className={styles.spacer}></tr>
                <tr>
                    <th className={styles.label}>V<sub>r</sub></th>
                    <td>{(rates.x * R_T_D).toFixed(2)}</td>
                    <th>°/s</th>
                </tr>
                <tr>
                    <th className={styles.label}>V<sub>p</sub></th>
                    <td>{(rates.z * R_T_D).toFixed(2)}</td>
                    <th>°/s</th>
                </tr>
                <tr>
                    <th className={styles.label}>V<sub>y</sub></th>
                    <td>{(rates.y * R_T_D).toFixed(2)}</td>
                    <th>°/s</th>
                </tr>
            </table>

        </div>
    </AbsoluteUIComponent>

}
