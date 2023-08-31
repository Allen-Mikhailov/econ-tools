const readline = require('readline');
const { stdout, stdin } = require("process");

readline.emitKeypressEvents(stdin);

function createMatrix(x, y)
{
    const matrix = new Array(y);
    for (let i = 0; i < matrix.length; i++) {
        matrix[i] = new Array(x);
    } 
    return matrix
}

exports.createMatrix = createMatrix

const tlCorner = "┌"
const trCorner = "┐"
const blCorner = "└"
const brCorner = "┘"

const vLine    = "│"
const hLine    = "─"

const topT     = "┴"
const botttomT = "┬"
const rightT   = "├"
const leftT    = "┤"

const _4 = "┼"

function getEdge(x, y, width, height)
{
    // Edged
    if (x == 0 && y == 0)
        return tlCorner
    if (x == 0 && y == height-1)
        return blCorner
    if (x == width-1 && y == 0)
        return trCorner
    if (x == width-1 && y == height-1)
        return brCorner


    if (x == 0)
        return rightT
    if (x == width-1)
        return leftT
    if (y == 0)
        return botttomT
    if (y == height-1)
        return topT

    return _4
}

function createEdgeLine(spacingArray, y, height)
{
    const width = spacingArray.length

    let lineStr = ""
    for (let x = 0; x < width; x++)
    {
        lineStr += getEdge(x, y, width+1, height+1)

        for (let i = 0; i < spacingArray[x]; i++)
        {
            lineStr += hLine
        }
    }
    lineStr += getEdge(width, y, width+1, height+1)

    return lineStr
}

function createSpaceLine(spacingArray)
{
    const width = spacingArray.length

    let lineStr = ""
    for (let x = 0; x < width; x++)
    {
        lineStr += vLine

        for (let i = 0; i < spacingArray[x]; i++)
        {
            lineStr += " "
        }
    }
    lineStr += vLine

    return lineStr
}

function createContentLine(spacingArray, content, spacing)
{
    const width = spacingArray.length

    let lineStr = ""
    for (let x = 0; x < width; x++)
    {
        lineStr += vLine

        for (let i = 0; i < spacing; i++)
            lineStr += " "

        lineStr += content[x]

        for (let i = 0; i < spacingArray[x]-spacing-content[x].length; i++)
        {
            lineStr += " "
        }
    }
    lineStr += vLine

    return lineStr
}

function drawGrid(grid)
{
    const width = grid[0].length
    const height = grid.length
    
    let gridStr = ""
    const spacing = 1

    // Spacing Array
    const spacingArray = []
    for (let x = 0; x < width; x++)
    {
        let largestStr = 0
        for (let y = 0; y < height; y++)
        {
            if (largestStr < grid[y][x].length)
                largestStr = grid[y][x].length
        }

        spacingArray.push(spacing*2 + largestStr)
    }

    for (let y = 0; y < height; y++)
    {
        // Line
        gridStr += createEdgeLine(spacingArray, y, height) + "\n"
        for (let i = 0; i < spacing; i++)
            gridStr += createSpaceLine(spacingArray, y, height) + "\n"

        gridStr += createContentLine(spacingArray, grid[y], spacing) + "\n"

        for (let i = 0; i < spacing; i++)
            gridStr += createSpaceLine(spacingArray, y, height) + "\n"
        // gridStr += "\n"
    }
    gridStr += createEdgeLine(spacingArray, height, height) + "\n"

    return gridStr
}

function loadGrid(grid)
{
    function onKeypress(str, key)
    {
        key = key || {}
        
        if (key.sequence == '\x03')
            stdin.pause()
    }

    stdin.setRawMode( true );
    stdin.resume();

    const drawMatrix = createMatrix(grid.length, grid[0].length)

    stdin.on("keypress", onKeypress)
    console.log(drawGrid(grid))
}

exports.loadGrid = loadGrid