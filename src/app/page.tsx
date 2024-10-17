"use client"

import MainView3D from "@/components/main-3d-view/MainView3D";
import styles from "./page.module.css"
import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { ResizeFollower } from "@/components/helpers/resize-follower/ResizeFollower";
import { RocketDataContextProvider, useRocketData } from "@/components/rocket-data-context/rocket-data-context";
import { TimelineSelector } from "@/components/timeline-selector/timeline-selector";
import { AltitudeIndicator } from "@/components/altitude-indicator/altitude-indicator";
import ArtificialHorizon from "@/components/artificial-horizon/artificial-horizon";
import { AttitudeReadout } from "@/components/attitude-readout/attitude-readout";
import { SerialMonitor } from "@/components/serial-monitor/serial-monitor";
import { SerialContextProvider } from "@/components/serial-context/serial-context";
import { RocketDataManager } from "@/components/rocket-data-manager/rocket-data-manager";
import { AccelerationReadout } from "@/components/acceleration-readout/acceleration-readout";
// import { TimelineSlider } from "@/components/timeline-slider/TimelineSlider";

export default function Trajectory() {
    
    const data = useRocketData();
    console.log(data);
    // const [ current, setCurrent ] = useState(data.length-1);


    useEffect(() => {

    }, []);



    return <RocketDataContextProvider>
        <SerialContextProvider>

            <main className={styles.main}>
                <MainView3D
                    // current={Math.floor(current)}
                    />

                <AccelerationReadout/>
                <RocketDataManager/>
                <TimelineSelector/>
                <AltitudeIndicator/>
                <AttitudeReadout/>
                <SerialMonitor/>
                {/* <ArtificialHorizon/> */}
            </main>
        </SerialContextProvider>
    </RocketDataContextProvider>
}