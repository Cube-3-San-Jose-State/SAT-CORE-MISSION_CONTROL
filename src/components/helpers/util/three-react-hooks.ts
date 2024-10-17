import { Quart, Vec3 } from "@/components/rocket-data-context/rocket-data-context";
import { useMemo } from "react";
import { Quaternion, Vector3 } from "three";




/**
 * Converts and updates a Vec3 to a THREE Vector3.
 * This is so we don't need to reconstruct new THREE Vector3 every rerender.
 * @param x 
 * @returns 
 */
export function useVector3(x:Vec3) {
    return useMemo(() => {
        return new Vector3(x.x, x.y, x.z);
    }, [x.x, x.y, x.z]);
}

/**
 * Converts and updates a Quart to a THREE Quarternion.
 * This is so we don't need to reconstruct new THREE Quarternion every rerender.
 * @param x 
 * @returns 
 */
export function useQuaternion(x:Quart) {
    return useMemo(() => {
        return new Quaternion(x.x, x.y, x.z, x.w);
    }, [x.x, x.y, x.z, x.w]);
}