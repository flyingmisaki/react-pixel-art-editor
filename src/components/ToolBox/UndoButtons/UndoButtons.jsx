import React from "react"
import "./UndoButtons.css"

import {BsArrowCounterclockwise, BsArrowClockwise} from "react-icons/bs"

import { useHistory } from "../../../hooks/useHistory.js"

export default function UndoButtons() {
    const {undo, redo, canUndo, canRedo} = useHistory()

    const render = function() {
        return (
            <div className="UndoButtons">
                <button className={`undoButton ${canUndo ? "" : "disabled"}`} onClick={undo}><BsArrowCounterclockwise/><div className="letter">z</div></button>
                <button className={`redoButton ${canRedo ? "" : "disabled"}`} onClick={redo}><BsArrowClockwise/><div className="letter">y</div></button>
            </div>
        )
    }
    return render()
}