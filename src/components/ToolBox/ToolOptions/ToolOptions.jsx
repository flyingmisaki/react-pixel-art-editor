import React from "react"
import {ChromePicker} from "react-color"
import {useBrushColor} from "../../../hooks/useBrushColor"
import {useActiveTool} from "../../../hooks/useActiveTool"
import "./ToolOptions.css"
import {colorToCanvasColor} from "../../../core/utils/colors"

export default function ToolOptions() {
    const {brushColor, setBrushColor, colorHistory} = useBrushColor()
    const [activeTool] = useActiveTool()

    const renderRecentColor = function(color) {
        const isActive = color === brushColor
        const className = isActive ? "selected" : null
        return (
            <div className="colorButtonContainer">
                <button 
                    style={{background: colorToCanvasColor(color)}}
                    onClick={() => setBrushColor(color)}
                    className={className}
                />
            </div>
            
        )
    }

    const render = function() {
        return (
            <div className="toolOptions">
                <div className="option">
                    <div className="optionTitle">Color</div>
                    <ChromePicker
                        color={brushColor}
                        onChange={(color) => setBrushColor(color.rgb)}
                    />
                </div>
                <div className="option">
                    <div className="optionTitle">Recent Colors</div>
                    <div className="recentColors">
                        {colorHistory.map(renderRecentColor)}
                    </div>
                </div>
                <div className="option">
                    <div className="optionTitle">Stroke Options</div>

                </div>
            </div>
        )
    }

    return render()
}