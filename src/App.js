import React, { Component } from 'react'
import { Container, Header, Input, List, Message, Tab, Radio, Label } from 'semantic-ui-react'
import { InputPane } from "./InputPane"
import { OutputPane } from "./OutputPane"

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {rules: [], samples: [], root: "S", quot: ''}
  }

  handleRulesChange = (newRules) => this.setState({ rules: newRules })

  handleSamplesChange = (newSamples) => this.setState({ samples: newSamples })

  handleQuotChange = (e, { value }) => this.setState({ quot: value })

  rulePaneRender = () => <InputPane key="rule" kind="rule" items={this.state.rules} onItemsChange={this.handleRulesChange}>
    <Message><Message.List>
      <Message.Item>
        Non-terminal symbols are:&emsp;
        <Radio
            label={<label>bare, e.g. <Label>{`DP -> the NP`}</Label>.</label>}
            name='quotRadioGroup' value='' checked={this.state.quot === ''} onChange={this.handleQuotChange}
        />
        &emsp;
        <Radio
          label={<label>wrapped in ASCII quotation marks ("), e.g. <Label>{`DP -> "the" NP`}</Label>.</label>}
          name='quotRadioGroup' value='"' checked={this.state.quot === '"'} onChange={this.handleQuotChange}
        />
      </Message.Item>
      <Message.Item>Rules with the same left-hand side can be joined with vertical lines (|), e.g. <Label>{`NP -> N | AdjP N | N PP | AdjP N PP`}</Label>.</Message.Item>
    </Message.List></Message>
  </InputPane>

  samplePaneRender = () => <InputPane key="sample" kind="sample" items={this.state.samples} onItemsChange={this.handleSamplesChange}>
    <Message><Message.List><Message.Item>Terminal symbols should be space-separated, e.g. <Label>王冕 死 了 父亲</Label>.</Message.Item></Message.List></Message>
  </InputPane>

  rootPaneRender = () => <Tab.Pane>
    <Input labelPosition='left' value={this.state.root} onChange={event => this.setState({root: event.target.value})}><Label>Start symbol</Label><input /></Input>
  </Tab.Pane>

  resultPaneRender = () => <OutputPane rules={this.state.rules} samples={this.state.samples} root={this.state.root} quot={this.state.quot} />

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
      
      <Container textAlign='center'><br /><List link horizontal><List.Item>Version 201021</List.Item></List></Container>
      
    </Container>
}
