"use strict";

self.onmessage = async event => {
    const message = event.data;

    if (message.type !== "process") {
        return;
    }

    const startTime = performance.now();

    try {
        const result = processQrCode(
            message.bitmap,
            message.manualModuleCount,
            message.maxDimension ?? 900
        );

        message.bitmap.close();

        self.postMessage({
            type: "result",
            ...result,
            elapsedMs: performance.now() - startTime
        });
    } catch (error) {
        message.bitmap?.close();

        self.postMessage({
            type: "error",
            message: error instanceof Error
                ? error.message
                : String(error)
        });
    }
};

function processQrCode(
    bitmap,
    manualModuleCount,
    maxDimension
) {
    sendProgress("Preparing image...");

    const source = renderScaledImage(bitmap, maxDimension);
    const grayscale = convertToGrayscale(source.imageData.data);

    sendProgress("Calculating threshold...");

    const threshold = calculateOtsuThreshold(grayscale);
    const binary = thresholdImage(grayscale, threshold);

    sendProgress("Locating QR bounds...");

    const bounds = findDarkBounds(
        binary,
        source.width,
        source.height
    );

    if (!bounds) {
        throw new Error("No QR-code region was detected.");
    }

    /*
     * Integral images allow rectangular sums in constant time.
     * Each module can therefore be classified from an area average
     * rather than nine or more individual sample reads.
     */
    const integral = buildIntegralImage(
        binary,
        source.width,
        source.height
    );

    sendProgress("Estimating module size...");

    const runEstimates = detectFinderRunCandidates(
        binary,
        source.width,
        source.height,
        bounds
    );

    const candidateCounts = manualModuleCount
        ? [manualModuleCount]
        : determineCandidateModuleCounts(bounds, runEstimates);

    sendProgress(
        `Testing ${candidateCounts.length} candidate grid(s)...`
    );

    let best = null;

    for (const moduleCount of candidateCounts) {
        const candidate = searchGridCoarseToFine({
            integral,
            width: source.width,
            height: source.height,
            bounds,
            moduleCount
        });

        if (!best || candidate.score > best.score) {
            best = candidate;
        }
    }

    if (!best || best.score < 0.78) {
        throw new Error(
            "A reliable QR grid could not be detected. " +
            "Try specifying the module count manually."
        );
    }

    return {
        matrix: best.matrix,
        moduleCount: best.moduleCount,
        score: best.score,
        threshold
    };
}

function renderScaledImage(bitmap, maxDimension) {
    const scale = Math.min(
        1,
        maxDimension / Math.max(bitmap.width, bitmap.height)
    );

    const width = Math.max(
        1,
        Math.round(bitmap.width * scale)
    );

    const height = Math.max(
        1,
        Math.round(bitmap.height * scale)
    );

    const canvas = new OffscreenCanvas(width, height);

    const context = canvas.getContext(
        "2d",
        {
            alpha: false,
            willReadFrequently: true
        }
    );

    context.drawImage(bitmap, 0, 0, width, height);

    return {
        width,
        height,
        imageData: context.getImageData(0, 0, width, height)
    };
}

function convertToGrayscale(rgba) {
    const pixelCount = rgba.length / 4;
    const grayscale = new Uint8Array(pixelCount);

    for (
        let pixelIndex = 0, rgbaIndex = 0;
        pixelIndex < pixelCount;
        pixelIndex++, rgbaIndex += 4
    ) {
        /*
         * Integer approximation of Rec. 601 luminance:
         *
         * 0.299R + 0.587G + 0.114B
         *
         * Integer arithmetic is faster than repeated floating-point
         * multiplication on large image buffers.
         */
        grayscale[pixelIndex] =
            (
                77 * rgba[rgbaIndex] +
                150 * rgba[rgbaIndex + 1] +
                29 * rgba[rgbaIndex + 2]
            ) >> 8;
    }

    return grayscale;
}

function calculateOtsuThreshold(grayscale) {
    const histogram = new Uint32Array(256);

    for (let i = 0; i < grayscale.length; i++) {
        histogram[grayscale[i]]++;
    }

    let totalWeightedSum = 0;

    for (let value = 0; value < 256; value++) {
        totalWeightedSum += value * histogram[value];
    }

    let backgroundCount = 0;
    let backgroundSum = 0;
    let maximumVariance = -1;
    let bestThreshold = 127;

    for (let value = 0; value < 256; value++) {
        backgroundCount += histogram[value];

        if (backgroundCount === 0) {
            continue;
        }

        const foregroundCount =
            grayscale.length - backgroundCount;

        if (foregroundCount === 0) {
            break;
        }

        backgroundSum += value * histogram[value];

        const backgroundMean =
            backgroundSum / backgroundCount;

        const foregroundMean =
            (
                totalWeightedSum - backgroundSum
            ) / foregroundCount;

        const difference =
            backgroundMean - foregroundMean;

        const variance =
            backgroundCount *
            foregroundCount *
            difference *
            difference;

        if (variance > maximumVariance) {
            maximumVariance = variance;
            bestThreshold = value;
        }
    }

    return bestThreshold;
}

function thresholdImage(grayscale, threshold) {
    const binary = new Uint8Array(grayscale.length);

    for (let i = 0; i < grayscale.length; i++) {
        binary[i] = grayscale[i] <= threshold ? 1 : 0;
    }

    return binary;
}

function findDarkBounds(binary, width, height) {
    const rowCounts = new Uint32Array(height);
    const columnCounts = new Uint32Array(width);

    for (let y = 0; y < height; y++) {
        const rowOffset = y * width;

        for (let x = 0; x < width; x++) {
            if (binary[rowOffset + x] !== 0) {
                rowCounts[y]++;
                columnCounts[x]++;
            }
        }
    }

    const minimumRowDensity = Math.max(
        2,
        Math.floor(width * 0.01)
    );

    const minimumColumnDensity = Math.max(
        2,
        Math.floor(height * 0.01)
    );

    let left = 0;
    let right = width - 1;
    let top = 0;
    let bottom = height - 1;

    while (
        left < width &&
        columnCounts[left] < minimumColumnDensity
    ) {
        left++;
    }

    while (
        right >= 0 &&
        columnCounts[right] < minimumColumnDensity
    ) {
        right--;
    }

    while (
        top < height &&
        rowCounts[top] < minimumRowDensity
    ) {
        top++;
    }

    while (
        bottom >= 0 &&
        rowCounts[bottom] < minimumRowDensity
    ) {
        bottom--;
    }

    if (left > right || top > bottom) {
        return null;
    }

    return {
        left,
        right,
        top,
        bottom,
        width: right - left + 1,
        height: bottom - top + 1
    };
}

function buildIntegralImage(binary, width, height) {
    const stride = width + 1;

    /*
     * Uint32 is sufficient because the maximum sum is the total number
     * of pixels, which is far below 2^32 after downscaling.
     */
    const integral = new Uint32Array(
        (width + 1) * (height + 1)
    );

    for (let y = 1; y <= height; y++) {
        let runningRowSum = 0;
        const sourceOffset = (y - 1) * width;
        const targetOffset = y * stride;
        const previousOffset = (y - 1) * stride;

        for (let x = 1; x <= width; x++) {
            runningRowSum += binary[
                sourceOffset + x - 1
            ];

            integral[targetOffset + x] =
                integral[previousOffset + x] +
                runningRowSum;
        }
    }

    return {
        values: integral,
        stride
    };
}

function rectangleSum(integral, x1, y1, x2, y2) {
    const { values, stride } = integral;

    return (
        values[y2 * stride + x2] -
        values[y1 * stride + x2] -
        values[y2 * stride + x1] +
        values[y1 * stride + x1]
    );
}

function detectFinderRunCandidates(
    binary,
    width,
    height,
    bounds
) {
    const candidates = [];

    /*
     * Scan every second row. The 1:1:3:1:1 finder-pattern run ratio
     * provides a direct estimate of one module's pixel width.
     */
    for (
        let y = bounds.top;
        y <= bounds.bottom;
        y += 2
    ) {
        scanFinderRunsInRow(
            binary,
            width,
            y,
            bounds.left,
            bounds.right,
            candidates
        );
    }

    candidates.sort((a, b) => a - b);

    return candidates;
}

function scanFinderRunsInRow(
    binary,
    width,
    y,
    left,
    right,
    output
) {
    const runs = [];
    let currentValue = binary[y * width + left];
    let runStart = left;

    for (let x = left + 1; x <= right + 1; x++) {
        const value = x <= right
            ? binary[y * width + x]
            : 1 - currentValue;

        if (value === currentValue) {
            continue;
        }

        runs.push({
            value: currentValue,
            length: x - runStart
        });

        currentValue = value;
        runStart = x;
    }

    for (let i = 0; i <= runs.length - 5; i++) {
        const group = runs.slice(i, i + 5);

        if (
            group[0].value !== 1 ||
            group[1].value !== 0 ||
            group[2].value !== 1 ||
            group[3].value !== 0 ||
            group[4].value !== 1
        ) {
            continue;
        }

        const total =
            group[0].length +
            group[1].length +
            group[2].length +
            group[3].length +
            group[4].length;

        const moduleSize = total / 7;
        const tolerance = moduleSize * 0.75;

        if (
            Math.abs(group[0].length - moduleSize) <= tolerance &&
            Math.abs(group[1].length - moduleSize) <= tolerance &&
            Math.abs(group[2].length - 3 * moduleSize) <=
                3 * tolerance &&
            Math.abs(group[3].length - moduleSize) <= tolerance &&
            Math.abs(group[4].length - moduleSize) <= tolerance
        ) {
            output.push(moduleSize);
        }
    }
}

function determineCandidateModuleCounts(
    bounds,
    moduleSizeEstimates
) {
    const counts = new Set();
    const imageExtent = Math.max(bounds.width, bounds.height);

    if (moduleSizeEstimates.length > 0) {
        const medianModuleSize = median(moduleSizeEstimates);
        const estimatedCount = imageExtent / medianModuleSize;
        const nearest = nearestValidModuleCount(estimatedCount);

        addCandidateAndNeighbors(counts, nearest);
    }

    /*
     * Bounding-box estimate is retained as a fallback because a valid
     * finder run may not be found in a blurred or compressed image.
     */
    for (let version = 1; version <= 40; version++) {
        const count = 21 + 4 * (version - 1);
        const scale = imageExtent / count;

        if (scale >= 2 && scale <= imageExtent / 21) {
            /*
             * Only retain plausible versions near the normal QR scale
             * range. Later, cap the total number tested.
             */
            counts.add(count);
        }
    }

    const ordered = [...counts];

    /*
     * Rank by how close each count is to the finder-run estimate.
     * This usually reduces 40 possible versions to 3–7 candidates.
     */
    if (moduleSizeEstimates.length > 0) {
        const estimated =
            imageExtent / median(moduleSizeEstimates);

        ordered.sort(
            (a, b) =>
                Math.abs(a - estimated) -
                Math.abs(b - estimated)
        );
    }

    return ordered.slice(0, 7);
}

function addCandidateAndNeighbors(set, count) {
    for (const offset of [-8, -4, 0, 4, 8]) {
        const candidate = count + offset;

        if (isValidModuleCount(candidate)) {
            set.add(candidate);
        }
    }
}

function nearestValidModuleCount(value) {
    const version = Math.round((value - 21) / 4) + 1;
    const clampedVersion = Math.max(1, Math.min(40, version));

    return 21 + 4 * (clampedVersion - 1);
}

function isValidModuleCount(value) {
    return (
        value >= 21 &&
        value <= 177 &&
        (value - 21) % 4 === 0
    );
}

function median(values) {
    const middle = Math.floor(values.length / 2);

    if (values.length % 2 === 1) {
        return values[middle];
    }

    return (
        values[middle - 1] + values[middle]
    ) / 2;
}

function searchGridCoarseToFine(options) {
    const {
        integral,
        width,
        height,
        bounds,
        moduleCount
    } = options;

    const approximateScale =
        Math.min(bounds.width, bounds.height) / moduleCount;

    let best = {
        score: -Infinity,
        moduleCount,
        matrix: null,
        originX: bounds.left,
        originY: bounds.top,
        scale: approximateScale
    };

    /*
     * Stage 1: coarse search.
     *
     * 5 scales × 7 × 7 offsets = 245 evaluations, rather than
     * 25 × 19 × 19 = 9,025 evaluations for each QR version.
     */
    best = searchNeighborhood({
        ...options,
        centerScale: approximateScale,
        scaleRadius: approximateScale * 0.08,
        scaleSteps: 5,
        centerX: bounds.left,
        centerY: bounds.top,
        offsetRadius: approximateScale * 2,
        offsetSteps: 7,
        currentBest: best
    });

    /*
     * Stage 2: refine around the winning coarse position.
     */
    best = searchNeighborhood({
        ...options,
        centerScale: best.scale,
        scaleRadius: approximateScale * 0.02,
        scaleSteps: 5,
        centerX: best.originX,
        centerY: best.originY,
        offsetRadius: approximateScale * 0.5,
        offsetSteps: 7,
        currentBest: best
    });

    /*
     * Stage 3: submodule refinement.
     */
    best = searchNeighborhood({
        ...options,
        centerScale: best.scale,
        scaleRadius: approximateScale * 0.005,
        scaleSteps: 3,
        centerX: best.originX,
        centerY: best.originY,
        offsetRadius: approximateScale * 0.15,
        offsetSteps: 5,
        currentBest: best
    });

    return best;
}

function searchNeighborhood(options) {
    const {
        integral,
        width,
        height,
        moduleCount,
        centerScale,
        scaleRadius,
        scaleSteps,
        centerX,
        centerY,
        offsetRadius,
        offsetSteps,
        currentBest
    } = options;

    let best = currentBest;

    for (let scaleIndex = 0; scaleIndex < scaleSteps; scaleIndex++) {
        const scaleFraction =
            scaleSteps === 1
                ? 0
                : scaleIndex / (scaleSteps - 1);

        const scale =
            centerScale -
            scaleRadius +
            2 * scaleRadius * scaleFraction;

        for (let yIndex = 0; yIndex < offsetSteps; yIndex++) {
            const yFraction =
                offsetSteps === 1
                    ? 0
                    : yIndex / (offsetSteps - 1);

            const originY =
                centerY -
                offsetRadius +
                2 * offsetRadius * yFraction;

            for (
                let xIndex = 0;
                xIndex < offsetSteps;
                xIndex++
            ) {
                const xFraction =
                    offsetSteps === 1
                        ? 0
                        : xIndex / (offsetSteps - 1);

                const originX =
                    centerX -
                    offsetRadius +
                    2 * offsetRadius * xFraction;

                const finalX =
                    originX + moduleCount * scale;

                const finalY =
                    originY + moduleCount * scale;

                if (
                    originX < 0 ||
                    originY < 0 ||
                    finalX > width ||
                    finalY > height
                ) {
                    continue;
                }

                /*
                 * During grid search, score only structural QR regions.
                 * Do not construct the entire matrix for every candidate.
                 */
                const score = scoreGridStructure({
                    integral,
                    width,
                    height,
                    moduleCount,
                    originX,
                    originY,
                    scale
                });

                if (score > best.score) {
                    best = {
                        score,
                        moduleCount,
                        originX,
                        originY,
                        scale,
                        matrix: null
                    };
                }
            }
        }
    }

    if (best.matrix === null) {
        best.matrix = sampleEntireMatrix({
            integral,
            width,
            height,
            moduleCount,
            originX: best.originX,
            originY: best.originY,
            scale: best.scale
        });
    }

    return best;
}

function scoreGridStructure(options) {
    const {
        integral,
        moduleCount,
        originX,
        originY,
        scale
    } = options;

    let matches = 0;
    let total = 0;

    const testModule = (column, row, expected) => {
        const actual = sampleModule(
            integral,
            originX,
            originY,
            scale,
            column,
            row
        );

        if (actual === expected) {
            matches++;
        }

        total++;
    };

    scoreExpectedFinder(testModule, 0, 0);

    scoreExpectedFinder(
        testModule,
        moduleCount - 7,
        0
    );

    scoreExpectedFinder(
        testModule,
        0,
        moduleCount - 7
    );

    /*
     * Score timing patterns without sampling the full QR matrix.
     */
    for (
        let index = 8;
        index < moduleCount - 8;
        index++
    ) {
        const expected = index % 2 === 0 ? 1 : 0;

        testModule(index, 6, expected);
        testModule(6, index, expected);
    }

    return total === 0 ? 0 : matches / total;
}

function scoreExpectedFinder(testModule, startX, startY) {
    for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 7; x++) {
            const expected =
                x === 0 ||
                x === 6 ||
                y === 0 ||
                y === 6 ||
                (
                    x >= 2 &&
                    x <= 4 &&
                    y >= 2 &&
                    y <= 4
                )
                    ? 1
                    : 0;

            testModule(
                startX + x,
                startY + y,
                expected
            );
        }
    }
}

function sampleEntireMatrix(options) {
    const {
        integral,
        moduleCount,
        originX,
        originY,
        scale
    } = options;

    const matrix = new Array(moduleCount);

    for (let row = 0; row < moduleCount; row++) {
        const outputRow = new Array(moduleCount);

        for (
            let column = 0;
            column < moduleCount;
            column++
        ) {
            outputRow[column] = sampleModule(
                integral,
                originX,
                originY,
                scale,
                column,
                row
            );
        }

        matrix[row] = outputRow;
    }

    return matrix;
}

function sampleModule(
    integral,
    originX,
    originY,
    scale,
    column,
    row
) {
    /*
     * Sample the central 60% of the module. This avoids edge
     * antialiasing and neighboring-module contamination.
     */
    const margin = scale * 0.2;

    const x1 = Math.max(
        0,
        Math.floor(originX + column * scale + margin)
    );

    const y1 = Math.max(
        0,
        Math.floor(originY + row * scale + margin)
    );

    const x2 = Math.max(
        x1 + 1,
        Math.ceil(
            originX + (column + 1) * scale - margin
        )
    );

    const y2 = Math.max(
        y1 + 1,
        Math.ceil(
            originY + (row + 1) * scale - margin
        )
    );

    const area = (x2 - x1) * (y2 - y1);
    const darkPixels = rectangleSum(
        integral,
        x1,
        y1,
        x2,
        y2
    );

    return darkPixels / area >= 0.5 ? 1 : 0;
}

function sendProgress(message) {
    self.postMessage({
        type: "progress",
        message
    });
}
