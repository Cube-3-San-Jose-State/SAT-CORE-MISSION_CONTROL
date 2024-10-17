"use client"

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { Quaternion, Vector3 } from "three";
import { velocity } from "three/webgpu";

export interface Vec3 {
    x: number, y: number, z: number
};

export interface Quart {
    w: number, x: number, y: number, z: number
}

export interface RocketData {
    position: Vec3;
    velocity: Vec3;
    acceleration: Vec3;
    orientation: Quart;

    localAngularRates: Vec3;

    verticalSpeed: number;
    // worldAngularRates: Vec3;

    time: number;
};



const RocketDataContext = createContext({
    data: [] as RocketData[],
    setData: (() => {}) as Dispatch<SetStateAction<RocketData[]>>,
    clearData: () => {},

    current: 0,
    setCurrent: (() => {}) as Dispatch<SetStateAction<number>>,

    realtime: false,
    setRealtime: (() => {}) as Dispatch<SetStateAction<boolean>>,
});



/**
 * Sample position data
 * @param t 
 * @returns 
 */
function parametricFunction(t:number) {
    return { 
        x: 0.1 * Math.cos(10*t), 
        y: t, 
        z: 0.1 * Math.sin(10*t) 
    };
}
/**
 * Sample velocity data
 * @param t 
 * @returns 
 */
function parametricFunctionV(t:number) {
    return { 
        x: -Math.sin(10*t), 
        y: 1, 
        z: Math.cos(10*t) 
    };
}

/**
 * Sample acceleration data
 * @param t 
 * @returns 
 */
function parametricFunctionA(t:number) {
    return { 
        x: -10 * Math.cos(10*t), 
        y: 0, 
        z: -10 * Math.sin(10*t) 
    };
}


/**
 * Generate Test Data.
 * @returns 
 */
function generateTestData() {
    const out = [];
    // Fwd
    const fwd = new Vector3(1, 0, 0);
    for(let i = 0; i <= 1.0; i +=0.001) {
        const orientation = new Quaternion();
        // Calculate linear data
        const p = parametricFunction(i);
        const a = parametricFunctionA(i);
        const v = parametricFunctionV(i);
        
        // SCaling
        p.x *= 1000;
        p.y *= 1000;
        p.z *= 1000;

        // Scaling
        a.x /= 1000;
        a.y /= 1000;
        a.z /= 1000;

        // normalize acceleration directions
        const b = new Vector3(-a.x, -a.y, -a.z).clone().normalize();
        // make the oirentation the directorion of the acceleration (as if it was a rocket shooting backwards)
        orientation.setFromUnitVectors(fwd, b);

        // Append the data to the array.
        out.push({
            position: p,
            velocity: v,
            acceleration: a,
            orientation,
            
            localAngularRates: { x: NaN, y: NaN, z: NaN },

            verticalSpeed: v.y,

            utc: i * 100
        });
    }
    return out;
}



/**
 * Use the data from the flight history of the rocket.
 * @returns 
 */
export function useRocketData() {
    const { data } = useContext(RocketDataContext);
    return data;
}

/**
 * Provides a function that cam be used to append new flight data.
 * @returns 
 */
export function useAddRocketData() {
    const { setData } = useContext(RocketDataContext);
    return (newData: RocketData) => {
        setData((old) => old.concat([newData]));
        // if(current >= data.length-1) setCurrent((i) => i+1);
    };
}

/**
 * Use the data from the current frame.
 * @returns 
 */
export function useCurrentData() {
    const { data, current, realtime } = useContext(RocketDataContext);
    // if(current < 0) return 
    if(data.length == 0) return null;
    if(realtime) return data[data.length-1];
    // if(current < 0 || data.length <= current) return null;
    return data[current];
}

/**
 * Use the index of the current frame.
 * @returns 
 */
export function useCurrentIndex(){
    const { current, realtime, data } = useContext(RocketDataContext);
    if(realtime) return data.length - 1;
    return current;
}

/**
 * Provides a function to change the current index by an amount.
 * @returns 
 */
export function useChangeCurrentIndex() {
    const { current, setCurrent, realtime, data, setRealtime } = useContext(RocketDataContext);
    return (changeAmount : number ) => {
        if(realtime) {
            if(changeAmount < 0) {
                setCurrent(data.length-1 + changeAmount);
                setRealtime(false);
            }
        }else {
            const newAmount = current + changeAmount;
            if(data.length-1 <= newAmount) {
                setRealtime(true);
            }else{
                setCurrent(Math.max(newAmount, 0));
            }
        }
    }
}

/**
 * Use the realtime setting. If it is realtime, then the current frame will update as new data is appended.
 * @returns 
 */
export function useRealtime() : [ boolean, Dispatch<SetStateAction<boolean>> ]{
    const { realtime, setRealtime } = useContext(RocketDataContext);

    return [ realtime, setRealtime ]
}

/**
 * Provides a function to clear the rocket data.
 * @returns 
 */
export function useRocketDataClear() {
    const { clearData } = useContext(RocketDataContext);
    return clearData;
}

/**
 * Context Provider that provides data to components that use rocket data.
 * @param param0 
 * @returns 
 */
export function RocketDataContextProvider({ children } : { children : ReactNode }) {

    // Rocket Data is a state that is an array of RocketData[] 
    // Test data
    const [ data, setData ] = useState(generateTestData() as unknown as RocketData[]);

    // No test data
    // const [ data, setData ] = useState([] as RocketData[]);
    
    // Current frame index
    const [ current, setCurrent ] = useState(data.length-1);

    // Whether we update with new data. Default to true.
    const [ realtime, setRealtime ] = useState(true);

    // Clear data function.
    const clearData = () => {
        setData([]);
        setCurrent(0);
        setRealtime(true);
    }

    return <RocketDataContext.Provider value={{
        data,
        setData,
        current,
        setCurrent,
        clearData,
        realtime,
        setRealtime
    }}>
        {children}
    </RocketDataContext.Provider>

}