import { useEffect, useRef } from "react";
import { AbsoluteUIComponent } from "../absolute-ui-component/AbsoluteUIComponent";

interface Point {
    x: number;
    y: number;
}
export interface GraphDataset {
    color: string;
    data: number[];
};

export interface GraphArguments {
    sets: GraphDataset[]
};


interface GraphInfo {
    tick: Point,
    window: {
        min: Point,
        max: Point
    }
}


function generateTickMarks(min: number, max: number, tick: number) {
    const out : number[] = [];
    max = tick * Math.floor(max/tick);
    min = tick * Math.ceil(min/tick);
    for(let i = min; i <= max; i += tick) out.push(i);
    return out;
}

// function map(x: number, imin:number, imax:number, b)
function mapper(imin: number, imax:number, omin: number, omax: number) {
    const inputWidth = imax - imin;
    const outputWidth = omax - omin;
    const ratio = outputWidth / inputWidth;
    return (x : number) => {
        return ratio * (x - imin) + omin;
    }
}

function pointMapper(imin : Point, imax : Point, omin : Point, omax : Point) {
    const ratioX = (imax.x - imin.x) / (omax.x - omin.x);
    const ratioY = (imax.y - imin.y) / (omax.y - omin.y);
    return (x : Point) => {
        return {
            x: ratioX * (x.x - imin.x) + omin.x,
            y: ratioY * (x.y - imin.y) + omin.y,
        };
    }
}


function Graph(props : GraphArguments) {


    const setsRef = useRef<GraphDataset[]>([]);
    setsRef.current = props.sets;
    const canvasRef = useRef<HTMLCanvasElement>(null!);

    useEffect(() => {
        const render = () => {
            const sets = setsRef.current;
            const ctx = canvasRef.current.getContext("2d");
            if(!ctx) return;
            // const xMap = mapper(-5, 5, -5, 5);
            const graphWindow = {
                min: {
                    x: -5, y: -5
                },
                max: {
                    x: 5, y: 5
                }
            };
            const xTicks =  generateTickMarks(graphWindow.min.x, graphWindow.max.x, 1);
            const canvasSize = {
                x: 300,
                y: 150,
            };
            const map = pointMapper(graphWindow.min, graphWindow.max, { x: 0, y: 0 }, canvasSize);

            ctx.clearRect(0, 0, canvasSize.x, canvasSize.y);

            xTicks.forEach((tick) => {
                const p = map({ x:tick, y: 0});
                ctx.moveTo(p.x, 0);
                ctx.lineTo(p.x, canvasSize.y);
            });



        };
        requestAnimationFrame(() => {
            render();
        });
    }, [props.sets]);




    return <canvas ref={canvasRef}>
        
    </canvas>
}

export function GraphView() {
    return <AbsoluteUIComponent >
        <Graph/>
    </AbsoluteUIComponent>
}