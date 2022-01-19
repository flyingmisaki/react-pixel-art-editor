import {React, useRef, useEffect} from "react"
import './PixelCanvas.css'
import {useActiveTool} from "../../../hooks/useActiveTool"
import {useBrushColor} from "../../../hooks/useBrushColor"
import {useLayers} from "../../../hooks/useLayers"
import {useProjectSettings} from "../../../hooks/useProjectSettings"
import CanvasLayer from "./CanvasLayer/CanvasLayer"
// import PreviewLayer from "./PreviewLayer/PreviewLayer"
// import checkeredBackground from "../../../svg/checkeredBackground.svg"
import {getCanvasRelativePosition} from "../../../core/utils/coordinates"
import PreviewLayer from "./PreviewLayer/PreviewLayer"

export default function PixelCanvas() {
    const {setCanvasCursorPosition, previewLayerCanvasRef, width, height, scale} = useProjectSettings()
    const {layers, activeLayer} = useLayers()
    const {activeTool} = useActiveTool()
    const {brushColor, pushColorToHistory} = useBrushColor()

    const pixelCanvasRef = useRef(null)

    const previousMousePositionRef = useRef({x: null, y: null})

    // Sets up listeners for mouse events on the canvas
    useEffect(() => {
        // Don't set listeners up if no active layer
        if (!activeTool || !activeLayer || activeLayer.isLocked === true || !previewLayerCanvasRef.current) return

        const pixelCanvasElement = pixelCanvasRef.current

        const layerCanvasContext = activeLayer.canvasRef.current.getContext('2d')
        activeTool.canvasContext = layerCanvasContext

        const previewCanvasContext = previewLayerCanvasRef.current.getContext('2d')
        activeTool.previewCanvasContext = previewCanvasContext

        const handleMouseDown = function(event) {
            const clickCode = event.button
            const position = getCanvasRelativePosition(event, pixelCanvasRef, scale)
            if (position.x < 0 || position.x > width || position.y < 0 || position.y > height) return

            switch (clickCode) {
                case 0:
                    if (activeTool.usesColors) pushColorToHistory(brushColor)
                    activeTool.mouseDown(position, brushColor)
                    break
                default: break
            }
        }

        const handleMouseUp = function(event) {
            const clickCode = event.button
            const position = getCanvasRelativePosition(event, pixelCanvasRef, scale)
            if (position.x < 0 || position.x > width || position.y < 0 || position.y > height) return
            switch (clickCode) {
                case 0:
                    activeTool.mouseUp(position, brushColor)
                    break
                default: break
            }
            previewCanvasContext.clearRect(0, 0, width, height)
            activeLayer.onUpdate()
        }

        const handleMouseMove = function(event) {
            const position = getCanvasRelativePosition(event, pixelCanvasRef, scale)
            
            if (position.x < 0 || position.x > width || position.y < 0 || position.y > height) return

            const previousPosition = previousMousePositionRef.current

            if (previousPosition.x !== position.x || previousPosition.y !== position.y) {
                previewCanvasContext.clearRect(0, 0, width, height)
                if (!(position.x > width || position.x < 0 || position.y > height || position.y < 0)) {
                    activeTool.mouseMove(position, brushColor)
                }
                previousMousePositionRef.current = position
                setCanvasCursorPosition(position)
            }
        }

        // Set up listeners
        document.addEventListener("mousedown", handleMouseDown)
        document.addEventListener("mouseup", handleMouseUp)

        document.addEventListener("mousemove", handleMouseMove)

        if (pixelCanvasElement === null) return

        return () => {
        
            // Tear down listeners
            document.removeEventListener("mousedown", handleMouseDown)
            document.removeEventListener("mouseup", handleMouseUp)

            document.removeEventListener("mousemove", handleMouseMove)
        }
    }, [activeTool, activeLayer, scale, width, height, brushColor, pushColorToHistory, setCanvasCursorPosition, previewLayerCanvasRef]
    )

    const render = function() {
        const elementWidth = width * scale
        const elementHeight = height * scale

        const canvasStyle = {
            width: `${elementWidth}px`,
            height: `${elementHeight}px`
        }

        return (
            <div className="pixelCanvas" ref={pixelCanvasRef} style={canvasStyle}>
                {layers.map(layer => (
                    <CanvasLayer
                        key={layer.id} 
                        layer={layer} 
                        width={width} 
                        height={height}
                    />
                ))}
                <PreviewLayer/>
            </div>
        )
    }

    return render()
}