import produce from 'immer';
import React, { useCallback, useRef, useState } from 'react';

// Set grid dimensions
const numRows = 70;
const numCols = 70;

const operations = [
    [0, 1],
    [0, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
    [-1, -1],
    [1, 0],
    [-1, 0]
]

export default function Canvas() {

    // Game running state
    const [running, setRunning] = useState(false);

    // Generation state
    const [generation, setGeneration] = useState(0)

    const runningRef = useRef(running);
    runningRef.current = running;

    // Simulation logic
    const runSimulation = useCallback(() => {
        if (!runningRef.current) {
            return
        }

        setGrid((g) => {
            return produce(g, gridCopy => {
                for (let i = 0; i < numRows; i++) {
                    for (let j = 0; j < numCols; j++) {
                        let neighbors = 0;
                        operations.forEach(([x, y]) => {
                            const newI = i + x;
                            const newJ = j + y;
                            if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                                neighbors += g[newI][newJ]
                            }
                        })
                        if (neighbors < 2 || neighbors > 3) {
                            gridCopy[i][j] = 0;
                        } else if (g[i][j] === 0 && neighbors === 3) {
                            gridCopy[i][j] = 1;
                        }
                    }
                }
            });
        });
        setGeneration(generation => generation + 1)
        setTimeout(runSimulation, 50);
    }, []);

    const generateEmptyGrid = () => {
        setGeneration(0);

        if(running){
            setRunning(false)
        };

        const rows = [];

        for (let i = 0; i < numRows; i++) {
            rows.push(Array.from(Array(numCols), () => 0))
        };

        return rows;
    }

    // Grid state
    const [grid, setGrid] = useState(() => {
        return generateEmptyGrid();
    })

    // Setting random grid function OnClick
    const generateRandomGrid = () => {
        
        setGeneration(0);

        if(running){
            setRunning(false)
        };

        const rows = [];

        for (let i = 0; i < numRows; i++) {
            rows.push(Array.from(Array(numCols), () => Math.random() > 0.8 ? 1 : 0))
        }

        setGrid(rows);
    }

    // Clear grid OnClick
    

    return (
        <div>
            <div className="left-section">
                <div className="canvas-section">

                    <h3>Generation # {generation}</h3>
                    <div className="canvas-sub">
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${numCols}, 10px)`
                        }}>
                            {/* Polpulate grid */}
                            {grid.map((rows, i) =>
                                rows.map((col, k) =>
                                    <div
                                        key={`${i}-${k}`}
                                        onClick={() => {
                                            const newGrid = produce(grid, gridCopy => {
                                                gridCopy[i][k] = grid[i][k] ? 0 : 1;
                                            })
                                            setGrid(newGrid)
                                        }}
                                        style={{
                                            width: 10,
                                            height: 10, backgroundColor: grid[i][k] ? '#067df7' : undefined,
                                            border: 'solid 1px black'
                                        }}
                                    />)
                            )}
                        </div>

                        <div className="canvas-buttons">
                            <button onClick={() => {
                                setRunning(!running);
                                if (!running) {
                                    runningRef.current = true;
                                    runSimulation();
                                }
                            }}>{running ? 'Stop' : 'Start'}</button>
                            <button onClick={() => generateRandomGrid()}>Random</button>
                            <button onClick={() => setGrid(generateEmptyGrid())}>Clear</button>
                        </div>
                    </div>
                </div>
                {/* Take care of presets */}
                {/* <div className="preset-section">
                    <button>Preset 1</button>
                    <button>Preset 2</button>
                    <button>Preset 3</button>
                </div> */}
            </div>
        </div>
    )
}
