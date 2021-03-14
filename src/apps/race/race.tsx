import React, { useState } from "react"
import useSound from "use-sound"

import {randomNumber} from "../../utilities/randomNumber"
import nyan from "../../assets/sound/nyan.mp3"

/**
 * Race component
 * Structure:
 *  Race: main component
 *    Form: add participants/change settings
 *    List: wrapper around Racer
 *      Racer: racer details
 *
 *  @TODO: use redux for state management to avoid having to pass data to grand children over children
 *  @TODO: set ease method random for each racer
 */

interface SettingsProps {
  duration: number
  sound: boolean
}

interface RacersProps {
  name?: string
  score?: number
}

interface RaceProps {
  started: boolean
  settings: SettingsProps
  racerList: RacersProps[]
  availableScores: number[]
}

export default class Race extends React.Component<any, RaceProps> {
  constructor(props) {
    super(props)
    this.state = {
      started: false,
      settings: {
        duration: 15,
        sound: false,
      },
      racerList: [],
      availableScores: Array.from({ length: 71 }, (_, i) => i + 15), // possible scores at start: [15-85]
    }

    this.addRacer = this.addRacer.bind(this)
    this.deleteRacer = this.deleteRacer.bind(this)
    this.startRace = this.startRace.bind(this)
    this.changeSettings = this.changeSettings.bind(this)
  }

  deleteRacer(name: string) {
    // @TODO: Add the score back to the availble ones

    // Delete the racer
    const racerList = this.state.racerList.reduce(function (filtered, racer) {
      if (racer.name !== name) {
        filtered.push(racer)
      }
      return filtered
    }, [])

    this.setState({ racerList }, () => console.log("this.state"))
  }

  addRacer(newName: string) {
    // See if there are any scores left
    if (this.state.availableScores.length === 1) {
      // All possible scores have been used, start the game!
      console.log("max number of racers reached, game starts now!")
      this.setState({ started: true })
    }
    // Check if we have a duplicate
    else if (this.state.racerList.some(racer => racer.name === newName)) {
      console.log("duplicate!")
      return null
    }
    // Ok, allow the racer to the game
    else {
      this.setState(
        state => {
          // Select a random score from the availble ones
          const racerScore = this.state.availableScores[
            randomNumber(0, this.state.availableScores.length)
          ]

          // That score is no longer available
          const availableScores = this.state.availableScores.filter(
            score => score !== racerScore
          )

          // Assing score to player
          const racerList = [
            ...state.racerList,
            { name: newName, score: racerScore },
          ]

          return {
            started: false,
            racerList,
            availableScores,
          }
        },
        () => console.log("this.state.availableScores")
      )
    }
  }

  startRace() {
    this.setState({ started: true })
  }

  changeSettings(duration: number, sound: boolean) {
    this.setState({
      settings: { duration: duration, sound: sound },
    })
  }

  render() {
    return (
      <>
        <Form
          addRacer={this.addRacer}
          startRace={this.startRace}
          nrOfRacers={this.state.racerList.length}
          raceStarted={this.state.started}
          changeSettings={this.changeSettings}
          duration={this.state.settings.duration}
          sound={this.state.settings.sound}
        />

        <div
          className={`race-canvas ${this.state.started ? "race-started" : ""}`}
        >
          <List
            racers={this.state.racerList}
            started={this.state.started}
            deleteRacer={this.deleteRacer}
            settings={this.state.settings}
          />
        </div>
      </>
    )
  }
}

function Form(props) {
  const [formData, setFormData] = useState({
    racerName: "",
    duration: props.duration,
    sound: props.sound,
  })

  const handleChange = e => {
    // we need to check on type checkbox:
    // https://stackoverflow.com/a/61488140/14375887

    const { name, value, type } = e.target

    setFormData(prevState => ({
      ...prevState,
      [name]: type === "checkbox" ? !prevState[name] : value,
    }))
  }

  const saveSettings = e => {
    e.preventDefault()
    props.changeSettings(formData.duration, formData.sound)
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!formData.racerName.trim()) {
      return
    }
    props.addRacer(formData.racerName)
    setFormData(prevState => ({
      ...prevState,
      racerName: "",
    }))
  }

  const startRace = e => {
    props.startRace()
  }

  return (
    <form>
      <div className="row">
        <input
          type="text"
          name="racerName"
          autoComplete="off"
          value={formData.racerName}
          onChange={handleChange}
          className="input"
          placeholder="Racer name"
        />
        <button
          type="submit"
          className="button"
          onClick={handleSubmit}
          disabled={props.raceStarted}
        >
          Add
        </button>
        <StartRace
          startRace={startRace}
          isDisabled={props.nrOfRacers === 0 ? true : false}
          playSound={props.sound}
        />
      </div>

      <div className="row">
        <details>
          <summary>Settings</summary>

          <label className="checkbox" htmlFor="sound">
            <input
              type="checkbox"
              id="sound"
              name="sound"
              onChange={handleChange}
              value={formData.sound}
            />
            <span>
              Enable sound (warning: doesn't end until you reload the page)
            </span>
          </label>

          <div className="row">
            <label htmlFor="duration">Duration (seconds):</label>
          </div>
          <div className="row">
            <input
              type="number"
              id="duration"
              name="duration"
              min="0"
              max="1800"
              required={true}
              value={formData.duration}
              onChange={handleChange}
            ></input>
          </div>
          <button
            type="submit"
            className="button"
            onClick={saveSettings}
            disabled={props.raceStarted}
          >
            Save settings
          </button>
        </details>
      </div>
    </form>
  )
}

function List(props) {
  if (props.racers.length === 0) {
    return null
  }

  return (
    <ul role="list" className="list-none">
      {props.racers.map(racer => (
        <Racer
          name={racer.name}
          score={racer.score}
          key={racer.name}
          deleteRacer={data => props.deleteRacer(data)}
          started={props.started}
          duration={props.settings.duration}
        />
      ))}
    </ul>
  )
}

/**
 * Racer is a grandchild of Race. We have to pass the delete function as props:
 * parent => child => grandchild
 * https://stackoverflow.com/questions/40109698/react-call-parent-method-in-child-component
 */
function Racer(props) {
  let duration = {
    transitionDuration: props.duration + "s",
  }

  let size = {}
  if (props.started) {
    size = { width: props.score + "%" }
  }

  return (
    <li>
      <button
        type="button"
        onClick={() => props.deleteRacer(props.name)}
        className="button__reset icon"
        aria-label="Remove participant"
        title="Remove participant"
      >
        <svg
          className="w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="black"
          width="48px"
          height="48px"
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z" />
        </svg>
      </button>
      {props.name}{" "}
      <span
        style={{
          ...{
            transitionDelay: props.duration + "s",
            transitionProperty: "visibility",
          },
          ...{ visibility: props.started ? "visible" : "hidden" },
          ...{},
        }}
      >
        ({props.score})
      </span>
      <div className="box" style={{ ...duration, ...size }}></div>
      <div
        className="cat"
        style={{
          ...duration,
          ...{ visibility: props.started ? "visible" : "hidden" },
        }}
      ></div>
    </li>
  )
}

/**
 * Start race - must be a component to call useSound
 */
const StartRace = props => {
  const [play] = useSound(nyan)
  const [started, setStarted] = useState(false)

  const handler = e => {
    e.preventDefault()
    props.startRace()
    if (props.playSound) {
      play()
    }
    setStarted(true)
  }

  return (
    <button
      onClick={handler}
      className="button"
      disabled={props.isDisabled || started}
    >
      Start!
    </button>
  )
}
