import { Box, Environment, Line, OrbitControls } from "@react-three/drei";
import { useMemo } from "react";
import { Canvas } from "react-three-fiber";
import { Quaternion, Vector3 } from "three";
import { Quart, useCurrentData, useRocketData, Vec3 } from "../rocket-data-context/rocket-data-context";
import { useQuaternion, useVector3 } from "../helpers/util/three-react-hooks";






// function use

/**
 * Acceleration Indicator in 3D Viewport
 * @returns 
 */
function AccelerationIndicator() {

    // Get current data.
    const current = useCurrentData();
    
    // Default to zero if there is no current frame.
    const acceleration = useVector3(current?.acceleration ?? { x: 0, y: 0, z: 0});

    // Calculate points to draw acceleration direction arrow.
    const points = useMemo(() => {
        acceleration.normalize();
        acceleration.multiplyScalar(0.02);
        return [
            new Vector3(),
            acceleration
        ];
    }, [acceleration]);

    return <Line

        // scale={[f, f, f]}
        points={points} 
        color={"#fc1803"}
        lineWidth={3}  
    />
}



function VelocityIndicator() {
    // Get current data.
    const current = useCurrentData();

    // Default to zero if there is no current frame.
    const velocity = useVector3(current?.velocity ?? { x: 0, y: 0, z: 0});

    // Calculate points to draw velocity direction arrow.
    const points = useMemo(() => {
        velocity.normalize();
        velocity.multiplyScalar(0.02);
        return [
            new Vector3(),
            velocity
        ];
    }, [velocity]);

    return <Line

        // scale={[f, f, f]}
        points={points} 
        color={"#fc9403"}
        lineWidth={3}  
    />
}




/**
 * Orientation indicator
 * @returns 
 */
function OrientationIndicator() {
    // Get current data.
    const current = useCurrentData();

    // Default to no rotation if there is no current frame.
    const orientation = useQuaternion(current?.orientation ?? { x: 0, y: 0, z: 0, w: 1});

    // // Line Version of the orientation indicator
    // const points = useMemo(() => {
    //     // velocity.normalize();
    //     // velocity.multiplyScalar(0.02);
    //     return [
    //         new Vector3(),
    //         new Vector3(0.01, 0.00, 0),
    //     ];
    // }, []);
    // // console.log(points);
    // // console.log(offset);
    // return <Line
    //     quaternion={orientation}
    //     // scale={[f, f, f]}
    //     points={points} 
    //     color={"#fc9403"}
    //     lineWidth={3}  
    // />

    // Box Version of the orientation indicator
    return <mesh 
        quaternion={orientation}
        scale={[0.005,0.005,0.005]}
    >
        <boxGeometry/>
        <meshNormalMaterial/>
    </mesh>
}




// Linear units to three js linear units.
const SCALE = 0.01;
export default function MainView3D({  }) {

    // Use all the previous rocket data.
    const data = useRocketData();

    // Convert all previous position points into an array of THREE Vectors.
    const points = useMemo(() => {
        return data.map((d) => new Vector3(d.position.x * SCALE, d.position.y * SCALE, d.position.z * SCALE));
    }, [data]);

    // Use current frame.
    const current = useCurrentData();

    // Create an offset vector that is negative the current position. This makes it so the current position is always the origin/center.
    const curr = useMemo(() => {
        if(!current) return new Vector3();
        return new Vector3(-current.position.x * SCALE, -current.position.y * SCALE, -current.position.z * SCALE);
    }, [current]);

    

    return <Canvas
        linear
        gl={{
            logarithmicDepthBuffer: true
        }}
        camera={{fov: 75, near: 0.001, far: 1000, position: [0, 0, 2]}}
        >
        <OrbitControls makeDefault />
        <Environment files="/res/hdr/HDR_subdued_blue_nebulae_2k.hdr" background={true}/>
        <>
            {
                points.length > 1 ? <group position={curr}>
                <Line          
                    points={points} 
                    color={"#23aaff"}
                    lineWidth={3}  
                    />
            </group> : <></>

            }
        </>
        <VelocityIndicator/>
        <AccelerationIndicator/>
        <OrientationIndicator/>
    </Canvas>

}