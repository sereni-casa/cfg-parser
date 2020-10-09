import React, { Component } from 'react'
import { Container, Divider, Header, Input, List, Message, Tab } from 'semantic-ui-react'
import { InputPane } from "./InputPane"
import { OutputPane } from "./OutputPane"

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rules: [],
      samples: [],
      root: "S"
    }
  }

  isTerm = item => item[0] === "\"" && item[item.length - 1] === "\""

  getTerm = item => item.slice(1, item.length - 1)

  handleRulesChange = (newRules) => {
    this.setState({ rules: newRules })
  }

  handleSamplesChange = (newSamples) => {
    this.setState({ samples: newSamples })
  }

  rulePaneRender = () => <InputPane key="rule" kind="rule" items={this.state.rules} onItemsChange={this.handleRulesChange}>
    <Message header="N.b." list={[
      <li key="0">Non-terminal symbols should be wrapped in ASCII quotation marks ("), e.g. <code>{`DP -> "the" NP`}</code>.</li>, 
      <li key="1">Multiple rules with the same left-hand side can be joined with vertical lines (|), e.g. <code>{`NP -> N | AdjP N | N PP | AdjP N PP`}</code>.</li>
    ]}/>
  </InputPane>

  samplePaneRender = () => <InputPane key="sample" kind="sample" items={this.state.samples} onItemsChange={this.handleSamplesChange}>
    <Message header="N.b." list={[<li key="0">Terminal symbols should be space-separated, e.g. <code>王冕 死 了 父亲</code>.</li>]}/>
  </InputPane>

  rootPaneRender = () => <Tab.Pane>
    <Input label="Start symbol" value={this.state.root} onChange={event => this.setState({root: event.target.value})}/>
  </Tab.Pane>

  resultPaneRender = () => <OutputPane rules={this.state.rules} samples={this.state.samples} root={this.state.root}/>

  render = () =>
    <Container>
      <br />
      <Header as="h1">CFG parser</Header>
      <Tab panes={[
        { menuItem: "Set rules", render: this.rulePaneRender },
        { menuItem: "Set samples", render: this.samplePaneRender },
        { menuItem: "Set start symbol", render: this.rootPaneRender },
        { menuItem: "Parse", render: this.resultPaneRender }
      ]} />
      
      <Container textAlign='center'><br /><List link horizontal items={["Version 201009"]} /></Container>
      
    </Container>
}
