import React from "react"

function copyText(text) {
  navigator.clipboard.writeText(text)
}

interface CopyButtonProps {
  id?: string
  text?: string
  copiedText?: string
  copied?: boolean
}

export default class CopyButton extends React.Component<any, CopyButtonProps> {
  constructor(props) {
    super(props)
    this.state = { copiedText: "" }
  }

  handleClick = data => {
    this.setState(
      {
        copiedText: "text",
        copied: true,
      },
      this.copyText
    )
  }

  copyText = () => {
    let element = document.getElementById(this.props.data)

    if (element) {
      let elementText = element.textContent
      copyText(elementText)
    } else {
      this.setState({ copied: false })
    }
  }

  render() {
    return (
      <>
        <button
          onClick={this.handleClick}
          className="button__reset icon"
          aria-label="copy text"
          title="Copy text"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="black"
            width="48px"
            height="48px"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
          </svg>
        </button>
      </>
    )
  }
}
