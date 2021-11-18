import React from "react"
import "./StatusBar.css"

import {colorToHexColor} from "../../core/utils/colors"

import {useBrushColor} from "../../hooks/useBrushColor"
import {useActiveTool} from "../../hooks/useActiveTool"

export default function NavBar() {
    
    const [activeTool] = useActiveTool()
    const [brushColor] = useBrushColor()

    const render = function() {
        return (
            <div>Tool: {activeTool?.name ?? "none"}, Color: {colorToHexColor(brushColor)}, Cursor x, y: {"X"}, {"Y"}</div>
        )
    }

    return render()
}