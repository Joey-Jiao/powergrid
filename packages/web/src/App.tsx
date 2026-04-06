import {float, integer} from 'powergrid-engine'

function App() {
    // Example: test engine integration
    const floatAnalysis = float.analyze(4, 3)
    const addTable = integer.addition(4)

    return (
        <div>
            <h1>PowerGrid</h1>

            <h2>IEEE 754 (4 exp, 3 mantissa)</h2>
            <pre>{JSON.stringify(floatAnalysis, null, 2)}</pre>

            <h2>4-bit Integer Range</h2>
            <p>[{addTable.min}, {addTable.max}]</p>
        </div>
    )
}

export default App
