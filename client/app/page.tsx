'use client'

import {FC, useEffect, useState} from 'react'
import { useDraw } from '../hooks/useDraw'
import ColorPicker from 'react-pick-color';
import { FaEraser } from "react-icons/fa";
import {io} from 'socket.io-client'
import { drawLine } from '@/utils/drawLine';



const socket = io("http://localhost:3001/")

interface PageProps {}

const page: FC<PageProps> = ({}) => {

  const {canvasRef, onMouseDown, onClear} = useDraw(createLine)
  const [color, setColor] = useState<string>('#000')
  const [width, setwidth] = useState<number>(5)
  const eraseHandler = () => {
    setColor('#fff')
    setwidth(20)
  }

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')

    socket.emit('client-ready')

    socket.on('draw-line',  ({ prevPoint, currentPoint, color, width :DrawLineProps}) => {
      if(!ctx) return
      drawLine({prevPoint, currentPoint, ctx, color, width})
    })

    socket.on('clear', onClear)

    socket.on('get-canvas-state', ()=>{
      if (!canvasRef.current?.toDataURL()) return
      console.log('sending canvas state')
      socket.emit('canvas-state', canvasRef.current.toDataURL())
    })

    socket.on('canvas-state-from-server', (state: string) => {
      console.log('I received the state')
      const img = new Image()
      img.src = state
      img.onload = () => {
        ctx?.drawImage(img, 0, 0)
      }
    })
  
    return () => {
      socket.off('draw-line')
      socket.off('get-canvas-state')
      socket.off('canvas-state-from-server')
      socket.off('clear')
    }
  }, [canvasRef])
  


  function createLine({prevPoint, currentPoint, ctx}:Draw){
    socket.emit('draw-line', {prevPoint, currentPoint, color, width})
    drawLine({prevPoint, currentPoint, ctx, color, width})
  }


  return (
    <div className='h-screen flex justify-center items-center'>
     <div className="flex flex-col gap-10 pr-10">
     <ColorPicker color={color} className="self-start" onChange={(e) => setColor(e.hex)} />
     <div className='flex justify-between'>
     <button type='button' className='flex justify-between items-center w-fit gap-2 p-2 rounded-md border border-black' onClick={() => eraseHandler()}>
        Erase <FaEraser />
      </button>
      <button type='button' className='flex justify-between items-center w-fit gap-2 p-2 rounded-md border border-black' onClick={()=>socket.emit('clear')}>
        Clear 
      </button>
     </div>
     </div>
      <canvas onMouseDown={onMouseDown} ref={canvasRef} height={750} width={500} className='border border-black rounded-md'/>
    </div>
  )
}

export default page