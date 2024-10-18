import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { useAddRocketData } from "../rocket-data-context/rocket-data-context";

// Log message from Astreus Board.
export interface LogEntry {
    msg: string
}

export const SerialContext = createContext/* <GamepadContextData> */({

    baudrate: 115200, 
    setBaudrate: ((()=>{}) as Dispatch<SetStateAction<number>>),

    reset() {},

    connected: false,
    // connecting: false,
    connect() {},
    disconnect() {},

    clear() {},
    frames: [] as Uint8Array[],
    logs: [] as LogEntry[],
});

/**
 * Use the serial context
 * @returns 
 */
export function useSerial() {
    return useContext(SerialContext);
}


/**
 * Parse the Astreus framing scheme.
 */
class FrameParser {
    START_OF_FRAME=0x01; // Frame start delimeter
    END_OF_FRAME=0x04; // Frame end delimeter
    ESCAPE=0x27; // Escape byte
    state: 0|1|2; // 0 = WAITING_FOR_START_OF_FRAME, 1 = PARSING_MESSAGE, 2 = AFTER_ESCAPE
    buffer: number[]; // Internal buffer containing current parse frame
    maxFrameSize: number; // Limit of frame size. Will reset and wait for next frame if this size is exceeded.
    constructor() {
        this.START_OF_FRAME=0x01; // Start of header
        this.END_OF_FRAME=0x04; // End of transmission
        this.ESCAPE=0x27;
        
        this.state = 0;
        this.buffer = []; // init to empty
        this.maxFrameSize = 128; // Max 128 bytes
    }

    /**
     * Process a single byte
     * @param byte 
     * @returns `true` if a full frame was parsed. `false` otherwise
     */
    parseByte(byte:number) {
        // Check which state were in
        switch(this.state) {
            case 0:
                // console.log(byte, "WAIT_START_OF_FRAME");
                if(byte == this.START_OF_FRAME) {
                    this.state = 1;
                    // i = 0;
                    this.buffer = []
                }
                return false;
            case 1:
                // console.log(byte, "PARSING_MESSAGE");
                if(byte == this.ESCAPE) {
                    this.state = 2;
                    return false;
                }else if(byte == this.END_OF_FRAME) {
                    this.state = 0;
                    return true;
                }
                if(this.buffer.length >= this.maxFrameSize) {
                    this.state = 0;
                    return false;
                }
                this.buffer.push(byte);
                return false;
            case 2:
                // console.log(byte, "AFTER_ESCAPE");
                this.state = 1;
                if(this.buffer.length >= this.maxFrameSize) {
                    this.state = 0;
                    return false;
                }
                this.buffer.push(byte);
                return false;
            };
            return false;
    }

    /**
     * Get the stored frame.
     * @returns 
     */
    getFrame() {
        return new Uint8Array(this.buffer);
    }
}


/**
 * Provide Serial configuration and data to all components
 * @param param0 
 * @returns 
 */
export function SerialContextProvider({ children } : { children : ReactNode }) {

    // const [ data, setData ] = useState(generateTestData() as unknown as RocketData[]);
    // const [ current, setCurrent ] = useState(data.length-1);
    const [ baudrate, setBaudrate ] = useState(115200);
    const [ connected, setConnected ] = useState(false);

    const [ frames, setFrames ] = useState([] as Uint8Array[]);
    const [ logs, setLogs ] = useState([] as LogEntry[]);

    const port = useRef<any>(null!);
    const reader = useRef<any>(null!);

    const addRocketData = useAddRocketData();

    const addRocketDataRef = useRef(addRocketData);
    addRocketDataRef.current = addRocketData;

    useEffect(() => {
        if(connected) {
            let loop = true;
            (async () => {
                // let remain = "";
                const parser = new FrameParser();
                while (loop) {
                    // Read Data
                    const { value } = await reader.current.read();

                    // Parse every byte.
                    for(let i = 0; i < value.length; i ++) {
                        // console.log(parser)
                        if(parser.parseByte(value[i])) {
                            // Create Data View from parsed frame.
                            let frame = parser.getFrame();
                            setFrames((old) => old.concat([frame]).slice(Math.max(old.length - 5, 0)));
                            let view = new DataView(frame.buffer);

                            // Get a float from the frame at index
                            const getFloat = (i:number) => view.getFloat32(i, true);

                            // Get a vector from the frame at index.
                            const getVector = (i:number) => {
                                return {
                                    x: getFloat(i),
                                    y: getFloat(i+4),
                                    z: getFloat(i+8),
                                }
                            }
                            
                            // Get a quarternion from the frame at index
                            const getQuart = (i:number) => {
                                return {
                                    x: getFloat(i),
                                    y: getFloat(i+4),
                                    z: getFloat(i+8),
                                    w: getFloat(i+12),
                                }
                            }
                            const NaNVector = {
                                x: NaN,
                                y: NaN,
                                z: NaN,
                            }
                            const identQuart = {
                                x: 0,
                                y: 0,
                                z: 0,
                                w: 1,
                            }


                            const parseDataFrame = () => {

                            }

                            // console.log(view.getFloat32(0, true), view.getFloat32(4, true), view.getFloat32(8, true), view.getFloat32(12, true));
                            if(frame[0] == 68) {
                                // console.log(frame);
                                if(frame.length < 81) continue;
                                // Check the backend code
                                addRocketDataRef.current({
                                    position: getVector(5),
                                    velocity: getVector(17),
                                    acceleration: getVector(29),
                                    // localAngularRates
                                    // utc: view.getFloat32(0, true),
                                    time: getFloat(1),
                                    orientation: getQuart(53),
                                    localAngularRates: getVector(69),
                                    verticalSpeed: NaN,
                                });
                            }else if(frame[0] == 76) {
                                // Log message.
                                const d = new TextDecoder();
                                const msg = d.decode(frame.slice(1));
                                setLogs((old) => old.concat([{
                                    msg
                                }]).slice(Math.max(old.length - 2000, 0)));

                            }
                        }
                    }
                }
            }) ();

            return () => {
                loop = false;
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connected]);

    const connect = async () => {
        try {
            console.log("Connecting to serial...");
            port.current = await (navigator as any).serial.requestPort();
            await port.current.open({ baudRate: baudrate });
            await port.current.setSignals({ dataTerminalReady: false, requestToSend: false });
            reader.current = port.current.readable.getReader();
            // writer.current = port.current.writable.getWriter();
            setConnected(true);
            console.log("Connect success");
            // return readWriteFromSerial();
        } catch (error) {
            console.error(error);
            setConnected(false);
        }
    }

    const disconnect = async () => {
        try {
            if (reader.current) {
                reader.current.cancel();
                // writer.current.abort();
                reader.current.releaseLock();
                // writer.current.releaseLock();
                port.current.close();
                port.current = undefined;
                reader.current = undefined;
                // writer.current = undefined;
                setConnected(false);
                // setIsDtrModeEnabled(false);
            }
        }
        catch (error) {
            console.error(error);
            setConnected(false);
        }
    }
    const reset = async () => {

    };

    const clear = () => {
        setFrames([]);
        setLogs([]);
    };
    
    
    return <SerialContext.Provider value={{
        baudrate, setBaudrate,
        connect, disconnect,
        connected,
        reset,
        clear,
        frames,
        logs
    }}>
        {children}
    </SerialContext.Provider>

}