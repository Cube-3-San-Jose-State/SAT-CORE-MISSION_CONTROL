"use client"
import { ReactNode, useState } from "react";
import styles from "./ui-component.module.css"




interface AbsoluteUIComponentArgs {
    x?: number,
    y?: number,

    alignX?: 0|1|2,
    alignY?: 0|1|2,
    // width? number,

    children: ReactNode
};


/**
 * Wrapper around all ui components. 
 * It is positioned absolutely.
 * X and Y are percentages of the current window width and height respectively. 
 * Align values of 0 align with the left/top. Align 1 will center the element. Align 2 will align with the right/bottom/
 * Width and height are determined by children.
 * 
 * @param param0 
 * @returns 
 */
export function AbsoluteUIComponent({ x, y, alignX, alignY, children } : AbsoluteUIComponentArgs) {

    const [ _x, setX ] = useState(x ?? 0);
    const [ _y, setY ] = useState(y ?? 0);
    // const [ _width, setWidth ] = useState(width);
    // const [ _height, setHeight ] = useState(height ?? 100);

    // let usedHeight = null;
    // if(aspect && _width) {
    //     usedHeight = _width * aspect;
    // }

    let xAlignValue = ``;
    let yAlignValue = ``;
    if(alignX == 0 || alignX == null) {
        xAlignValue = `0`;
    }else if(alignX == 1) {
        xAlignValue = `-50%`;
    }else if(alignX == 2) {
        xAlignValue = `-100%`;
    }
    if(alignY == 0 || alignY == null) {
        yAlignValue = `0`;
    }else if(alignY == 1) {
        yAlignValue = `-50%`;
    }else if(alignY == 2) {
        yAlignValue = `-100%`;
    }

    return <div
        className={styles.ui}
        style={{
            position: `absolute`,
            left: `${_x*100}%`,
            top: `${_y*100}%`,
            transform: `translate(${xAlignValue}, ${yAlignValue})`
        }}
    >
        {children}
    </div>

}