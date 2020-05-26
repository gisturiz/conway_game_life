import produce from 'immer';
import React, { useCallback, useRef, useState } from 'react';

// Set grid dimensions
const numRows = 30;
const numCols = 30;

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

// Clear grid. OnClick
const generateEmptyGrid = () => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
        rows.push(Array.from(Array(numCols), () => 0))
    }

    return rows;
}

export default function Canvas() {

    // Game running state
    const [running, setRunning] = useState(false);

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

        setTimeout(runSimulation, 50);
    }, []);

    // Grid state
    const [grid, setGrid] = useState(() => {
        return generateEmptyGrid();
    })

    // Setting random grid function. OnClick
    const generateRandomGrid = () => {
        const rows = [];
        for (let i = 0; i < numRows; i++) {
            rows.push(Array.from(Array(numCols), () => Math.random() > 0.8 ? 1 : 0))
        }
    
        setGrid(rows);
    }

    return (
        <div>
            <div className="left-section">
                <div className="canvas-section">

                    <h3>Generation #</h3>
                    <div className="canvas-sub">
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${numCols}, 20px)`
                        }}>
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
                                            width: 20,
                                            height: 20, backgroundColor: grid[i][k] ? '#067df7' : undefined,
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
                <div className="preset-section">
                    <button>Preset 1</button>
                    <button>Preset 2</button>
                    <button>Preset 3</button>
                </div>
            </div>
        </div>
    )
}
