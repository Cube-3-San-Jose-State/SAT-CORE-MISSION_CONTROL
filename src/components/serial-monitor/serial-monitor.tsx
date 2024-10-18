"use client"
import { useMemo, useState } from "react";
import { AbsoluteUIComponent } from "../absolute-ui-component/AbsoluteUIComponent";
import styles from "./serial-monitor.module.css"
import { LogEntry, useSerial } from "../serial-context/serial-context";


function LogLine({ entry } : { entry: LogEntry }) {
    return <>
        {entry.msg}
        <br/>
    </>
}

function LogView() {
    const serial = useSerial();
    return <>
        {serial.logs.map((entry, i) => <LogLine key={i} entry={entry}/>)}
    </>
}

function leftpad(s: string, n: number, c: string) {
    while(s.length < n) {
        s = c + s;
    }
    return s;
}



function FrameLine({ frame } : { frame: Uint8Array }) {
    return <>
        {Array.from(frame).map(
            (byte, i) => 
                <span className={styles.byte} key={i}>0x{leftpad(byte.toString(16), 2, "0")}</span>
        )}
        <br/>
    </>
}

function FrameView() {
    const serial = useSerial();

    return <>
        {serial.frames.map((frame, i) => <FrameLine key={serial.frames.length - i} frame={frame}/>)}
    </>
}

export function SerialMonitor() {
    
    
    // const [ baudrate, setBaudrate ] = useState(115600);
    const serial = useSerial();
    
    // const lines = useMemo(() => {
    //    return serial.rawSerial.split("\n"); 
    // }, [serial.rawSerial]);
    return <AbsoluteUIComponent x={1} y={1} alignX={2} alignY={2}>
        <div className={styles.main}>
            <div className={styles["control-panel"]}>
                <button
                    onClick={() => {
                        serial.clear();
                    }}
                >Clear</button>
                <input className={styles["baud-rate"]} placeholder="115600"
                    value={isNaN(serial.baudrate) ? "" : serial.baudrate}
                    onChange={(e) => {
                        
                        serial.setBaudrate(parseInt(e.target.value.substring(0, 7)));
                    }}
                />
                <button
                    onClick={() => {
                        if(serial.connected) serial.disconnect();
                        else serial.connect();
                    }}
                >{serial.connected ? `Disconnect` : `Connect`}</button>
            </div>
            <div className={styles.output}>
                {/* <FrameView/> */}
                <LogView/>
            </div>
            {/* $  */}
            <input className={styles["serial-input"]}/>
        </div>

    </AbsoluteUIComponent>
}