import { AbsoluteUIComponent } from "../absolute-ui-component/AbsoluteUIComponent";
import { useCurrentData } from "../rocket-data-context/rocket-data-context";
import styles from "./acceleration-readout.module.css";





export function AccelerationReadout() {
    const current = useCurrentData();
    const acceleration = current?.acceleration ?? { x: NaN, y: NaN, z: NaN };
    const velocity = current?.velocity ?? { x: NaN, y: NaN, z: NaN };

    return <AbsoluteUIComponent x={0} y={0.8} alignX={0}>
        <div className={styles.main}>
            <table>
                <tr>
                    <th className={styles.label}>A<sub>x</sub></th>
                    <td>{(acceleration.x).toFixed(2)}</td>
                    <th>m/s<sup>2</sup></th>
                </tr>
                <tr>
                    <th className={styles.label}>A<sub>y</sub></th>
                    <td>{(acceleration.y).toFixed(2)}</td>
                    <th>m/s<sup>2</sup></th>
                </tr>
                <tr>
                    <th className={styles.label}>A<sub>z</sub></th>
                    <td>{(acceleration.z).toFixed(2)}</td>
                    <th>m/s<sup>2</sup></th>
                </tr>
                <tr className={styles.spacer}></tr>
                <tr>
                    <th className={styles.label}>V<sub>x</sub></th>
                    <td>{(velocity.x).toFixed(2)}</td>
                    <th>m/s</th>
                </tr>
                <tr>
                    <th className={styles.label}>V<sub>y</sub></th>
                    <td>{(velocity.z).toFixed(2)}</td>
                    <th>m/s</th>
                </tr>
                <tr>
                    <th className={styles.label}>V<sub>z</sub></th>
                    <td>{(velocity.y).toFixed(2)}</td>
                    <th>m/s</th>
                </tr>
            </table>
        </div>
    </AbsoluteUIComponent>

}
