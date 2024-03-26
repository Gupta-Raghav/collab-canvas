import { useEffect, useRef, useState } from "react"

export const useDraw = (onDraw : ({ctx, currentPoint, prevPoint}: Draw) => void)=>{
    const [mouseDown, setMouseDown] = useState(false)
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const prevPoint = useRef<null | Point>(null)

    const onMouseDown = () => setMouseDown(true);

    const onClear = () => {
      const canvas = canvasRef.current
      if(!canvas) return

      const ctx = canvas.getContext('2d')

      if(!ctx)return 

      ctx.clearRect(0,0,canvas.width, canvas.height)

    }

    useEffect(() => {
    //   first
    const moveHandler = (e:MouseEvent) => {
        if(!mouseDown) return
        // let x = e.clientX;
        // let y = e.clientY;
        // console.log({x:e.clientX, y:e.clientY})
        
        const currentPoint = computeCanvasPoint(e)
        // console.log({x:currentPoint?.rectX, y:currentPoint?.rectX})
        const ctx = canvasRef.current?.getContext('2d')
        if (!ctx || !currentPoint) return

        onDraw({ ctx, currentPoint, prevPoint: prevPoint.current })
        prevPoint.current = currentPoint

      }

      const computeCanvasPoint = (e: MouseEvent) => {
        const canvas = canvasRef.current
        if(!canvas) return

        const rect = canvas.getBoundingClientRect()
        const x = e.clientX -rect.left
        const y = e.clientY - rect.top

        return {x, y}
      }

      const mouseUpHandler = () =>{
        setMouseDown(false);
        prevPoint.current = null
      }

      //an event listener
      canvasRef.current?.addEventListener('mousemove', moveHandler);
      window.addEventListener('mouseup', mouseUpHandler)
      return () => {
        // remove the listener
      canvasRef.current?.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseup', mouseUpHandler)
      }
    }, [onDraw])
    
    return {canvasRef,onMouseDown,onClear}

}