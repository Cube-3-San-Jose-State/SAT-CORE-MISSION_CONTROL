import { AbsoluteUIComponent } from "../absolute-ui-component/AbsoluteUIComponent";
import { useCurrentData } from "../rocket-data-context/rocket-data-context";
import styles from "./altitude-indicator.module.css";





export function AltitudeIndicator() {
    const current = useCurrentData();
    return <AbsoluteUIComponent x={0.5} y={0} alignX={1}>
        <div className={styles.main}>
            <table>
                <tr>
                    <th className={styles.label}>Sea</th>
                    <td>{((current?.position.y ?? 0)).toFixed(1)}</td>
                    <th>m</th>
                </tr>
                <tr>
                    <th className={styles.label}>V<sub>alt</sub></th>
                    <td>{(current?.velocity.y ?? 0).toFixed(2)}</td>
                    <th>m/s</th>
                </tr>
            </table>
        </div>
    </AbsoluteUIComponent>

}
