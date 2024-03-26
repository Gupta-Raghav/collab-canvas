'use client'

import {FC, useState} from 'react'
import { useDraw } from '../hooks/useDraw'
import ColorPicker from 'react-pick-color';
import { FaEraser } from "react-icons/fa";

interface PageProps {}

const page: FC<PageProps> = ({}) => {

  const {canvasRef, onMouseDown, onClear} = useDraw(drawline)
  const [color, setColor] = useState<string>('#000')
  function drawline({prevPoint, currentPoint, ctx}:Draw) {
    
    const lineColor = color
    const lineWidth = 5

    let startPoint = prevPoint ?? currentPoint
    ctx.beginPath()
    ctx.lineWidth  = lineWidth
    ctx.strokeStyle = lineColor
    ctx.moveTo(startPoint.x, startPoint.y)
    ctx.lineTo(currentPoint.x, currentPoint.y)
    ctx.stroke()

    ctx.fillStyle = lineColor
    ctx.beginPath()
    ctx.arc(startPoint.x, startPoint.y, 2,0, 2*Math.PI)
    ctx.fill()



  }

  return (
    <div className='h-screen flex justify-center items-center'>
     <div className="flex flex-col gap-10 pr-10">
     <ColorPicker color={color} className="self-start" onChange={(e) => setColor(e.hex)} />
      <button type='button' className='flex justify-between items-center w-fit gap-2 p-2 rounded-md border border-black' onClick={onClear}>
        Clear <FaEraser />
      </button>
     </div>
      <canvas onMouseDown={onMouseDown} ref={canvasRef} height={750} width={500} className='border border-black rounded-md'/>
    </div>
  )
}

export default page