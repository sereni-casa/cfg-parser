import React, { Fragment } from "react"
import { Modal, Tab, Table } from 'semantic-ui-react'
import { MyButton } from "./MyButton"
import { Tree } from "./Tree"

export function OutputPane(props) {
  // complex to simple (without "|")
  let simpleRules = []
  for (let rule of props.rules) {
    const ruleParts = rule.split(" -> ")
    const ruleLeft = ruleParts[0]
    for (let ruleRight of ruleParts[1].split(" | ")) {
      simpleRules.push([ruleLeft, ruleRight])
    }
  }
  
  // multiple to binary
  let binaryRules = []
  simpleRules.forEach((rule, ruleIndex) => {
    const items = rule[1].split(" ")
    if (items.length === 1) {
      binaryRules.push([rule[0], items[0], ""])
    } else {
      let itemNow = items[0]
      items.slice(1, -1).forEach((item, itemIndex) => {
        const itemNew = `_${ruleIndex}_${itemIndex}`
        binaryRules.push([itemNew, itemNow, item])
        itemNow = itemNew
      })
      binaryRules.push([rule[0], itemNow, items[items.length - 1]])
    }
  })

  // CKY-parse
  const extend = (firstNode) => {
    let nodes = [firstNode]
    let i = 0
    while (i < nodes.length) {
      for (let rule of binaryRules)
        if (rule[1] === nodes[i].xStr && rule[2] === "")
          nodes.push({ xStr: rule[0], yNode: nodes[i], zNode: null, from: firstNode.from, to: firstNode.to })
      i ++
    }
    return nodes
  }

  const traceBack = (node) => {
    if (node.yNode === null)
      return <>{(props.quot.length === 0) ? node.xStr : node.xStr.slice(props.quot.length, -props.quot.length)}</>
    if (node.zNode === null)
      return <>[<sub><em>{node.xStr}</em></sub> {traceBack(node.yNode)}]</>
    if (node.xStr[0] === "_")
      return <>{traceBack(node.yNode)} {traceBack(node.zNode)}</>
    return <>[<sub><em>{node.xStr}</em></sub> {traceBack(node.yNode)} {traceBack(node.zNode)}]</>
  }
  
  let results = []
  let trees = []
  props.samples.forEach((sample, index) => {
    const words = sample.split(" ")
    let t = []
    for (let j = 1; j <= words.length; j++) {
      t[j - 1] = []
      t[j - 1][j] = extend({xStr: props.quot + words[j - 1] + props.quot, yNode: null, zNode: null, from: j - 1, to: j})
      for (let i = j - 2; i >= 0; i--) {
        t[i][j] = []
        for (let k = i + 1; k < j; k++)
          for (let rule of binaryRules)
            for (let yNode of t[i][k].filter((node) => node.xStr === rule[1]))
              for (let zNode of t[k][j].filter((node) => node.xStr === rule[2]))
                t[i][j].push(...extend({xStr: rule[0], yNode: yNode, zNode: zNode, from: i, to: j }))
      }
    }
    results[index] = []
    trees[index] = []
    for (let node of t[0][words.length].filter((node) => node.xStr === props.root)) {
      results[index].push(traceBack(node))
      trees[index].push(<Tree rootNode={node} quot={props.quot}></Tree>)
    }
  })

  return <Tab.Pane>
    <Table compact="very">
      {/* <Table.Header><Table.Row>
        <Table.HeaderCell colSpan="2">Total: {props.samples.length} samples</Table.HeaderCell>
      </Table.Row></Table.Header> */}
      <Table.Body>{props.samples.map((sample, sampleIndex) =>
        <Fragment key={sampleIndex}>
          <Table.Row positive={results[sampleIndex].length > 0} negative={results[sampleIndex].length === 0}>
            <Table.Cell>{sample}</Table.Cell>
            <Table.Cell>{results[sampleIndex].length === 0 ? "No" : results[sampleIndex].length} result{results[sampleIndex].length === 1 ? "" : "s"}</Table.Cell>
          </Table.Row>
          {results[sampleIndex].map((result, resultIndex) => <Table.Row key={resultIndex}>
            <Table.Cell>{result}</Table.Cell>
            <Table.Cell collapsing><Modal basic size="fullscreen" trigger={<MyButton>Show tree</MyButton>} content={trees[sampleIndex][resultIndex]} actions={['Close']} /></Table.Cell>
          </Table.Row>)}
        </Fragment>)}
      </Table.Body>
    </Table>
  </Tab.Pane>
}