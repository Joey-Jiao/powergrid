/**
 * IEEE 754 Floating Point Representation
 *
 * Terminology:
 * - k : number of bits in exponent field
 * - n : number of bits in fraction field
 * - K : 规格化情况下阶码的个数
 * - N : 尾数的个数
 * - e : value where exponent field is treated as an unsigned integer
 * - E : e after bias (e - bias)
 * - Bias : 2^(k-1) - 1
 * - f : frac | 未经处理的小数值 | [0, 1)
 * - M : Mantissa | 经过处理后的小数值 | [0, 1) (denorm), [1, 2) (norm)
 * - V : result value in decimal | 使用十进制表示的结果
 */

interface FloatAnalysis {
    k: number
    n: number
    Bias: number
    K: number
    N: number
    eRange: { min: number; max: number }
    ERange: { min: number; max: number }
    normalized: {
        min: number
        max: number
        values: number[]
    }
    denormalized: {
        min: number
        max: number
        values: number[]
    }
    positiveValues: number[]
    allValues: number[]
}

/**
 * Analyze IEEE 754 floating point representation for given bit configuration
 */
function analyze(k: number, n: number): FloatAnalysis {
    const Bias = Math.pow(2, k - 1) - 1
    const K = Math.pow(2, k) - 2  // 规格化阶码个数 (排除全0和全1)
    const N = Math.pow(2, n)      // 尾数个数

    const eMin = 1
    const eMax = Math.pow(2, k) - 2
    const EMin = eMin - Bias
    const EMax = eMax - Bias
    const denormE = 1 - Bias

    // Generate all possible frac values: f ∈ [0, 1)
    const fracArr: number[] = []
    for (let i = 0; i < N; i++) {
        fracArr.push(i / Math.pow(2, n))
    }

    // 规格化数: V = 2^E * M, where M = 1 + f ∈ [1, 2)
    const normArr: number[] = []
    for (let E = EMin; E <= EMax; E++) {
        const pow2E = Math.pow(2, E)
        for (const f of fracArr) {
            const M = 1 + f
            normArr.push(pow2E * M)
        }
    }

    // 非规格化数: V = 2^(1-Bias) * M, where M = f ∈ [0, 1)
    const denormArr: number[] = []
    const pow2DenormE = Math.pow(2, denormE)
    for (const f of fracArr) {
        const M = f
        denormArr.push(pow2DenormE * M)
    }

    const positiveValues = [...normArr, ...denormArr].sort((a, b) => a - b)
    const allValues = [
        ...positiveValues,
        ...positiveValues.map(v => -v)
    ].sort((a, b) => a - b)

    const nonZeroNorm = normArr.filter(x => x > 0)
    const nonZeroDenorm = denormArr.filter(x => x > 0)

    return {
        k,
        n,
        Bias,
        K,
        N,
        eRange: { min: eMin, max: eMax },
        ERange: { min: EMin, max: EMax },
        normalized: {
            min: nonZeroNorm.length > 0 ? Math.min(...nonZeroNorm) : 0,
            max: nonZeroNorm.length > 0 ? Math.max(...nonZeroNorm) : 0,
            values: normArr,
        },
        denormalized: {
            min: nonZeroDenorm.length > 0 ? Math.min(...nonZeroDenorm) : 0,
            max: nonZeroDenorm.length > 0 ? Math.max(...nonZeroDenorm) : 0,
            values: denormArr,
        },
        positiveValues,
        allValues,
    }
}

export { analyze }
export type { FloatAnalysis }
