"use client"
import { useRef } from "react";



export function HoldableButton(props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & { onClick?: ()=>void}) {

    const { children, onClick = ()=>{},  ...rest } = props;

    const timeoutRef = useRef<NodeJS.Timeout>(null!);

    

    const repeat = () => {
        onClick();
        
        timeoutRef.current = setTimeout(repeatRef.current, 10);
    }

    const repeatRef = useRef(repeat);
    repeatRef.current = repeat;

    return <div {...rest} onMouseDown={() => {
        onClick();
        timeoutRef.current = setTimeout(repeatRef.current, 200);
    }}
    onMouseLeave={() => 
        clearTimeout(timeoutRef.current)
    }
    onMouseUp={() => {
        clearTimeout(timeoutRef.current);
    }}
    >
            {children}
    </div>
}
