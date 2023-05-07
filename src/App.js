import React from "react"
import { Container, Header, Icon, Input, List, Message, Tab, Radio, Label, Form } from 'semantic-ui-react'
import { InputTable } from "./InputTable"
import { OutputPane } from "./OutputPane"

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { rules: [], samples: [], root: "S", quot: '' }
  }

  handleRulesChange = (newRules) => this.setState({ rules: newRules })

  handleSamplesChange = (newSamples) => this.setState({ samples: newSamples })

  handleQuotChange = (e, { value }) => this.setState({ quot: value })

  rulePaneRender = () => <Tab.Pane>
    <Message><Message.List>
      <Message.Item>
        <Form>
          <Form.Field>Non-terminal symbols are:</Form.Field>
          <Form.Field><Radio
            label={<label>bare, e.g. <Label>{`DP -> the NP`}</Label>.</label>}
            name='quotRadioGroup' value='' checked={this.state.quot === ''} onChange={this.handleQuotChange}
          /></Form.Field>
          <Form.Field><Radio
            label={<label>wrapped in ASCII quotation marks ("), e.g. <Label>{`DP -> "the" NP`}</Label>.</label>}
            name='quotRadioGroup' value='"' checked={this.state.quot === '"'} onChange={this.handleQuotChange}
          /></Form.Field>
        </Form>
      </Message.Item>
      <Message.Item>Rules with the same left-hand side can be joined with vertical lines (|), e.g. <Label>{`NP -> N | AdjP N | N PP | AdjP N PP`}</Label>.</Message.Item>
    </Message.List></Message>
    <InputTable key="rule" kind="rule" items={this.state.rules} onItemsChange={this.handleRulesChange} />
  </Tab.Pane>

  samplePaneRender = () => <Tab.Pane>
    <Message><Message.List>
      <Message.Item>Terminal symbols should be space-separated, e.g. <Label>在 黑板 上 写 字</Label>.</Message.Item>
    </Message.List></Message>
    <InputTable key="sample" kind="sample" items={this.state.samples} onItemsChange={this.handleSamplesChange} />
  </Tab.Pane>

  rootPaneRender = () => <Tab.Pane>
    <Input labelPosition='left' value={this.state.root} onChange={event => this.setState({ root: event.target.value })}><Label>Start symbol</Label><input /></Input>
  </Tab.Pane>

  resultPaneRender = () => <OutputPane rules={this.state.rules} samples={this.state.samples} root={this.state.root} quot={this.state.quot} />

  render = () =>
    <Container>
      <br />
      <Header as="h1">CFG parser</Header>
      <Tab panes={[
        { menuItem: "Rules?", render: this.rulePaneRender },
        { menuItem: "Samples?", render: this.samplePaneRender },
        { menuItem: "Start symbol?", render: this.rootPaneRender },
        { menuItem: "Parse!", render: this.resultPaneRender }
      ]} />

      <Container textAlign='center'>
        <br />
        <List horizontal>
          <List.Item>v{process.env.REACT_APP_VERSION}</List.Item>
          {/* <List.Item>{new Date().getFullYear() + (new Date().getMonth() + 1).toString().padStart(2, '0') + new Date().getDate().toString().padStart(2, '0')}</List.Item> */}
          <List.Item>20230507</List.Item>
          <List.Item as="a" href="https://sereni.casa/">SERENI·CASA</List.Item>
          <List.Item as="a" href="https://github.com/sereni-casa/cfg-parser"><Icon name='github' /></List.Item>
        </List>
        <br />
      </Container>

    </Container>
}

export default App;
