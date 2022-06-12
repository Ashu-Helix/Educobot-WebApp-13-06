import React, { useEffect, useRef, useState } from 'react'
import { loadCanvasItems } from './helpers';
var ctext: any, startAnimating: any, resetAnim: any;
async function execFn(fnName: string, ctx: any, args: string) {
    // get passed arguments except first two (fnName, ctx)

    if (args.indexOf('\"') !== -1) {
        args = args.split("\"")[1]
    }
    if (args.indexOf('\'') !== -1) {
        args = args.split("\'")[1]
    }

    // execute the function with passed parameters and return result
    return await ctx[fnName].apply(ctx, [args]);
}

export default function Canvas({ command, className, id, handleReset, reset, setCommand, slug }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [ctx, setCtx] = useState<React.SetStateAction<any>>(null)
    const [ind, setind] = useState<number>(-1)
    const [cmd, setCmd] = useState<string[]>([])
    useEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.width = 800;
            canvasRef.current.height = 500;
        }

        let loadItems = loadCanvasItems(slug)
        ctext = loadItems?.ctext
        startAnimating = loadItems?.startAnimating
        resetAnim = loadItems?.reset
    }, [])
    useEffect(() => {
        if (canvasRef.current) {
            setCtx(canvasRef.current?.getContext("2d"))
        }
    }, [canvasRef.current])
    useEffect(() => {
        if (ctx && canvasRef?.current && canvasRef.current.width && canvasRef.current.height && startAnimating) {
            startAnimating(10, ctx, canvasRef?.current)
        }
    }, [ctx])
    useEffect(() => {
        if (reset === true) {
            resetAnim(ctx, canvasRef?.current)
            setind(-1)
            setCmd([])
            setCommand('')
            setTimeout(() => {
                handleReset(false)
            }, 1000)
        }
    }, [reset])
    useEffect(() => {
        if (command !== '' && window) {
            let command1 = command?.split('\n')
            setCmd(command1)
            setind(0)
        }
    }, [command])
    useEffect(() => {
        if (cmd?.length > 0 && cmd[ind]) {
            let fnName = cmd[ind].slice(0, cmd[ind].indexOf('('))
            let args = cmd[ind].slice(cmd[ind].indexOf('(') + 1, cmd[ind].indexOf(')'))
            new Promise((resolve, reject) => {
                return execFn(fnName, ctext, args).then(r => { return resolve(1) })
            }).then(r => { if (r) setind(ind + 1) })
        }
    }, [ind])

    return (<canvas ref={canvasRef} id={id} className={className} />)

}
