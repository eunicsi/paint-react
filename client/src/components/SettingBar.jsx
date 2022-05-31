import React from 'react';
import toolState from '../store/toolState';
import "../styles/toolbar.scss"

const SettingBar = () => {
    return (
        <div className="setting-bar">
            <label htmlFor="line-width">Line width</label>
            <input 
                onChange={(e) => toolState.setLineWidth(e.target.value)}
                id="line-width" 
                type="number" min={1} max={50} defaultValue={1}
            />
            <label htmlFor="stroke-color">Stroke color</label>
            <input 
                onChange={(e) => toolState.setStrokeColor(e.target.value)}
                id="stroke-color" 
                type="color"
            />
        </div>
    );
};

export default SettingBar;