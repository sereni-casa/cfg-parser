import React from 'react'

export function Tree(props) {
    const rootNode = props.rootNode

    function max(...items) {
        let max = 0
        for (let item of items)
            if (item > max)
                max = item
        return max
    }

    function traceBack(node, depth) {
        node.depth = depth
        if (node.yNode === null) {
            node.children = []
            return depth
        }
        if (node.zNode === null) {
            node.children = [node.yNode]
            node.yNode.isFirstChild = true
            node.yNode.isLastChild = true
            return max(depth, traceBack(node.yNode, depth + 1))
        }
        if (node.xStr[0] === "_")
            return max(depth, traceBack(node.yNode, depth), traceBack(node.zNode, depth))
        
        let firstNode = node.yNode
        node.children = [node.zNode]
        node.zNode.isFirstChild = false
        node.zNode.isLastChild = true
        while (firstNode.xStr[0] === "_") {
            node.children = [firstNode.zNode, ...node.children]
            firstNode.zNode.isFirstChild = false
            firstNode.zNode.isLastChild = false
            firstNode = firstNode.yNode
        }
        node.from = firstNode.from
        node.children = [firstNode, ...node.children]
        firstNode.isFirstChild = true
        firstNode.isLastChild = false
            
        return max(depth, traceBack(node.yNode, depth + 1), traceBack(node.zNode, depth + 1))
    }

    const maxDepth = traceBack(rootNode, 0)

    let nodes = [rootNode]
    let rows = []
    let rowsAtCol = []
    let i = 0
    while (i < nodes.length) {
        if (rows[nodes[i].depth] === undefined) {
            rows[nodes[i].depth] = <></>
            rowsAtCol[nodes[i].depth] = 0
        }
        if (nodes[i].xStr[0] !== "_") {
            if (rowsAtCol[nodes[i].depth] < nodes[i].from)
                rows[nodes[i].depth] = <>{rows[nodes[i].depth]}<td colSpan={nodes[i].from - rowsAtCol[nodes[i].depth]}></td></>
            rows[nodes[i].depth] = (<>
                {rows[nodes[i].depth]}<td key={i} colSpan={nodes[i].to - nodes[i].from} style={{textAlign: "center", verticalAlign: "top", padding: "0"}}>
                    {nodes[i].depth === 0 ? <></> : <table style={{width: "100%", height: "1em", borderSpacing: "0"}}><tbody><tr>
                        <td style={{width: "50%", borderTop: nodes[i].isFirstChild ? "none" : "1px solid", borderRight: "1px solid"}}></td>
                        <td style={{width: "50%", borderTop: nodes[i].isLastChild ? "none" : "1px solid"}}></td>
                    </tr></tbody></table>}
                    <div>&emsp;{nodes[i].children.length === 0 ? nodes[i].xStr.slice(1, -1) : nodes[i].xStr}&emsp;</div>
                    {nodes[i].children.length === 0 ? <></> : <table style={{width: "100%", height: "1em", borderSpacing: "0"}}><tbody><tr><td style={{width: "50%", borderRight: "1px solid"}}></td><td style={{width: "50%"}}></td></tr></tbody></table>}
                </td>
            </>)
            rowsAtCol[nodes[i].depth] = nodes[i].to
        }
        for (let child of nodes[i].children) 
            nodes.push(child)
        i ++
    }

    return <table style={{margin: "auto", borderSpacing: "0"}}>
        <tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{row}</tr>)}</tbody>
    </table>
}