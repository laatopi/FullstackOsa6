import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { Container, Table, Grid, Image, Form } from 'semantic-ui-react'

const Menu = ({ style }) => (
  <div style={style}>
    <Link to='/'>anecdotes</Link>&nbsp;
    <Link to='/create'>create new</Link>&nbsp;
    <Link to='/about'>about</Link>&nbsp;
  </div>
)

const Notification = ({ message, style }) => (
  <div style={style}>
    {message}
  </div>
)

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <Table celled striped>
      <Table.Body>
        {anecdotes.map(anecdote =>
          <Table.Row key={anecdote.id}>
            <Table.Cell>
              <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  </div>
)

const Anecdote = ({ anecdote }) => {
  return (
    <div>
      <h3>{anecdote.content}</h3>
      <div>{anecdote.votes} </div>
      <div>for more info see {anecdote.info}</div>
      <p></p>
    </div>
  )
}

const About = () => (
  <div>

    <Grid >
      <Grid.Row>
        <Grid.Column width={13}>
          <h2>About anecdote app</h2>
          <p>According to Wikipedia:</p>

          <em>An anecdote is a brief, revealing account of an individual person or an incident.
            Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
            such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

          <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
        </Grid.Column>
        <Grid.Column width={3}>
          <Image src='https://www.tko-aly.fi/attachments/files/222/hallitus-2018-sami-l.jpg' />
          {/* ?? Ny loppu tollanen */}
        </Grid.Column>
      </Grid.Row>

    </Grid>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://courses.helsinki.fi/fi/TKT21009/121540749'>Full Stack -sovelluskehitys</a>.

    See <a href='https://github.com/mluukkai/routed-anecdotes'>https://github.com/mluukkai/routed-anecdotes</a> for the source code.
    <p>Muutki kirjottaneet koodia tähän ! ! ! ! ! </p>
  </div>
)

class CreateNew extends React.Component {
  constructor() {
    super()
    this.state = {
      content: '',
      author: '',
      info: ''
    }
  }

  handleChange = (e) => {
    console.log(e.target.name, e.target.value)
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.addNew({
      content: this.state.content,
      author: this.state.author,
      info: this.state.info,
      votes: 0
    })
    this.props.history.push('/')
    this.props.notification(`a new anecdote ${this.state.content} created!`)
  }

  render() {
    return (
      <div>
        <h2>create a new anecdote</h2>
        <Form onSubmit={this.handleSubmit}>
          <Form.TextArea name='content' value={this.state.content} onChange={this.handleChange} label='Content' placeholder='What is the anecdote?' />
          <Form.Input name='author' value={this.state.author} onChange={this.handleChange} fluid label='Author' placeholder='Who is the Author?' />
          <Form.Input name='info' value={this.state.info} onChange={this.handleChange} fluid label='Info' placeholder='Where to find more information about this..' />
          <Form.Button>Submit</Form.Button>
        </Form>
      </div>
    )

  }
}

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      anecdotes: [
        {
          content: 'If it hurts, do it more often',
          author: 'Jez Humble',
          info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
          votes: 0,
          id: '1'
        },
        {
          content: 'Premature optimization is the root of all evil',
          author: 'Donald Knuth',
          info: 'http://wiki.c2.com/?PrematureOptimization',
          votes: 0,
          id: '2'
        }
      ],
      notification: ''
    }
  }

  notification = (message) => {
    this.setState({
      notification: message
    })
    setTimeout(() => {
      this.setState({
        notification: ''
      })
    }, 3000)
  }

  addNew = (anecdote) => {
    anecdote.id = (Math.random() * 10000).toFixed(0)
    this.setState({ anecdotes: this.state.anecdotes.concat(anecdote) })
  }

  anecdoteById = (id) =>
    this.state.anecdotes.find(a => a.id === id)

  vote = (id) => {
    const anecdote = this.anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }
    const anecdotes = this.state.anecdotes.map(a => a.id === id ? voted : a)
    this.setState({ anecdotes })
  }

  render() {
    return (
      <Container>
        <div>
          <Router>
            <div>
              <h1>Software anecdotes</h1>
              <Menu style={menuStyle} />
              {this.state.notification === '' ?
                <p></p>
                : <Notification style={notificationStyle} message={this.state.notification} />}
              <Route exact path="/" render={() => <AnecdoteList anecdotes={this.state.anecdotes} />} />
              <Route path="/about" render={() => <About />} />
              <Route path="/create" render={({ history }) => <CreateNew history={history} addNew={this.addNew} notification={this.notification} />} />
              <Route exact path="/anecdotes/:id" render={({ match }) =>
                <Anecdote anecdote={this.anecdoteById(match.params.id)} />} />
              <Footer />
            </div>
          </Router>
        </div>
      </Container>
    );
  }
}

const menuStyle = {
  background: 'orange',
  borderStyle: 'ridge',
  borderRadius: 10,
  fontSize: 24,
  color: 'white'
}

const notificationStyle = {
  color: 'purple',
  fontStyle: 'comic-sans',
  fontSize: 15,
  borderStyle: 'solid',
  borderRadius: 15,
  background: 'hotpink'
}


export default App;
