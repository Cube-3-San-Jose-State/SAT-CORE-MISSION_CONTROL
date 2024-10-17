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




function parametricFunction(t:number) {
    return { 
        x: 0.1 * Math.cos(10*t), 
        y: t, 
        z: 0.1 * Math.sin(10*t) 
    };
}
function parametricFunctionV(t:number) {
    return { 
        x: -Math.sin(10*t), 
        y: 1, 
        z: Math.cos(10*t) 
    };
}

function parametricFunctionA(t:number) {
    return { 
        x: -10 * Math.cos(10*t), 
        y: 0, 
        z: -10 * Math.sin(10*t) 
    };
}

// function velocity


function generateTestData() {
    const out = [];
    const fwd = new Vector3(1, 0, 0);
    for(let i = 0; i <= 1.0; i +=0.001) {
        const orientation = new Quaternion();
        const p = parametricFunction(i);
        const a = parametricFunctionA(i);
        const v = parametricFunctionV(i);
        
        p.x *= 1000;
        p.y *= 1000;
        p.z *= 1000;

        a.x /= 1000;
        a.y /= 1000;
        a.z /= 1000;
        const b = new Vector3(-a.x, -a.y, -a.z).clone().normalize();
        orientation.setFromUnitVectors(fwd, b);
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



export function useRocketData() {
    const { data } = useContext(RocketDataContext);
    return data;
}

export function useAddRocketData() {
    const { setData, current, data, setCurrent } = useContext(RocketDataContext);
    return (newData: RocketData) => {
        setData((old) => old.concat([newData]));
        // if(current >= data.length-1) setCurrent((i) => i+1);
    };
}

export function useCurrentData() {
    const { data, current, realtime } = useContext(RocketDataContext);
    // if(current < 0) return 
    if(data.length == 0) return null;
    if(realtime) return data[data.length-1];
    // if(current < 0 || data.length <= current) return null;
    return data[current];
}

export function useCurrentIndex(){
    const { current, realtime, data } = useContext(RocketDataContext);
    if(realtime) return data.length - 1;
    return current;
}

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

export function useRealtime() : [ boolean, Dispatch<SetStateAction<boolean>> ]{
    const { realtime, setRealtime } = useContext(RocketDataContext);

    return [ realtime, setRealtime ]
}

export function useRocketDataClear() {
    const { clearData } = useContext(RocketDataContext);
    return clearData;
}

export function RocketDataContextProvider({ children } : { children : ReactNode }) {

    const [ data, setData ] = useState(generateTestData() as unknown as RocketData[]);
    // const [ data, setData ] = useState([] as RocketData[]);
    const [ current, setCurrent ] = useState(data.length-1);
    const [ realtime, setRealtime ] = useState(true);

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