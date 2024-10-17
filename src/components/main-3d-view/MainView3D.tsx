import { Box, Environment, Line, OrbitControls } from "@react-three/drei";
import { useMemo } from "react";
import { Canvas } from "react-three-fiber";
import { Quaternion, Vector3 } from "three";
import { Quart, useCurrentData, useRocketData, Vec3 } from "../rocket-data-context/rocket-data-context";









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

// function use


function AccelerationIndicator() {
    // const data = useRocketData();
    const current = useCurrentData();

    // const offset = useVector3(current?.position ?? { x: 0, y: 0, z: 0});
    // useEffect(()=>{offset.multiplyScalar(-1);}, [offset]);
    const acceleration = useVector3(current?.acceleration ?? { x: 0, y: 0, z: 0});

    const points = useMemo(() => {
        acceleration.normalize();
        acceleration.multiplyScalar(0.02);
        return [
            new Vector3(),
            acceleration
        ];
    }, [acceleration]);
    // console.log(points);
    // console.log(offset);
    return <Line

        // scale={[f, f, f]}
        points={points} 
        color={"#fc1803"}
        lineWidth={3}  
    />
}



function VelocityIndicator() {
    // const data = useRocketData();
    const current = useCurrentData();

    // const offset = useVector3(current?.position ?? { x: 0, y: 0, z: 0});
    // useEffect(()=>{offset.multiplyScalar(-1);}, [offset]);
    const velocity = useVector3(current?.velocity ?? { x: 0, y: 0, z: 0});

    const points = useMemo(() => {
        velocity.normalize();
        velocity.multiplyScalar(0.02);
        return [
            new Vector3(),
            velocity
        ];
    }, [velocity]);
    // console.log(points);
    // console.log(offset);
    return <Line

        // scale={[f, f, f]}
        points={points} 
        color={"#fc9403"}
        lineWidth={3}  
    />
}





function OrientationIndicator() {
    const current = useCurrentData();

    // const offset = useVector3(current?.position ?? { x: 0, y: 0, z: 0});
    // useEffect(()=>{offset.multiplyScalar(-1);}, [offset]);
    const orientation = useQuaternion(current?.orientation ?? { x: 0, y: 0, z: 0, w: 0});

    
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

    return <mesh 
        quaternion={orientation}
        scale={[0.005,0.005,0.005]}
    >
        <boxGeometry/>
        <meshNormalMaterial/>
    </mesh>
}




const SCALE = 0.01;
export default function MainView3D({  }) {

    const data = useRocketData();
    // current = current ?? data.length - 1;

    const points = useMemo(() => {
        // const out = [];
        // for(let i = 0; i <= 1.0; i +=0.01) {
        //     out.push(parametricFunction(i));
        // }
        return data.map((d) => new Vector3(d.position.x * SCALE, d.position.y * SCALE, d.position.z * SCALE));
    }, [data]);

    // let [ f, setF ] = useState(1.0);
    // const [ zoom, setZoom ] = useState(1.0);
    // const f = Math.pow(10, zoom / 1000);

    const current = useCurrentData();

    const curr = useMemo(() => {
        // console.log(data);
        if(!current) return new Vector3();
        // console.log(d);
        return new Vector3(-current.position.x * SCALE, -current.position.y * SCALE, -current.position.z * SCALE);
    }, [current]);

    

    return <Canvas
        linear
        gl={{
            logarithmicDepthBuffer: true
        }}
        camera={{fov: 75, near: 0.001, far: 1000, position: [0, 0, 2]}}
        // onWheel={(e) => {
        //     setZoom((z) => z + e.deltaY);
        // }}
        >
        <OrbitControls makeDefault />
        <Environment files="/res/hdr/HDR_subdued_blue_nebulae_2k.hdr" background={true}/>
        <>
            {
                points.length > 1 ? <group position={curr}>
                {/* <HeightMarkers f={f} curr={curr}/> */}
                {/* <Box/> */}
                <Line          
                    // scale={[f, f, f]}
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