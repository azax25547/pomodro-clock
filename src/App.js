import React, {Component} from 'react';
import './App.css'

const MyContext = React.createContext()

class MyProvider extends Component {
  state = {
    session: 20,
    break : 5,
    isRunning : true,
    reset: true,
    gameStart : false
  }
  render() {
    const checkSecond = (sec) => {
      if (sec < 10 && sec >= 0) {
        sec = "0" + sec;
      }
      if (sec < 0) {
        sec = '59'
      }
      return sec;
    }
    return (<MyContext.Provider value={{
      state : this.state,
      handleIncrement: () =>{
        if(this.state.gameStart){return false}
        else {
          if(this.state.session >= 25) return false
          else{
            this.setState({
              session : this.state.session + 1
            })
          }
        }

      },
      handleDecrement : () => {
        if(this.state.gameStart){return false}
        else{
          if(this.state.session <= 0) return false
          else{
            this.setState({
              session : this.state.session - 1
            })
          }
        }

      },
      showTimer: () => {
        this.setState({
          isRunning : !this.state.isRunning,
          gameStart : true
        })
        var time = setInterval(() => {
          var currentTime = document.getElementById('time-left').innerHTML
          let timeArr = currentTime.split(/[:]+/)
          let m = timeArr[0]
          let s = checkSecond(timeArr[1] - 1)
          // console.log(s)
          if(s == 59){ m -= 1 }
          document.getElementById("time-left").innerHTML = `${m} : ${s}`
          if(m <= 2){
            document.getElementById("time-left").classList.add('red-text')
          }
          if(m < 0){
            document.getElementById("time-left").innerHTML = "00 : 00"
            var audio = document.getElementById('beep')
            audio.play()
            clearInterval(time)
          }
          if(this.state.isRunning) clearInterval(time)
        },1000)
      },
      handleBreakIncrement : () => {
        if(this.state.gameStart) {return false} else
        {
          if(this.state.break >=60) return false
          else{
            this.setState({
              break : this.state.break + 1
            })
          }
        }

      },
      handleBreakDecrement : () => {
        if(this.state.gameStart) {return false} else {
          if(this.state.break <= 1) return false
          else{
            this.setState({
              break : this.state.break - 1
            })
          }
        }
      },
      resetTimer: () => {
        if(this.state.reset)
          window.location.reload()
      }

    }}>
      {this.props.children}
    </MyContext.Provider>)
  }
}

const Break = (props) => (<div>
  <MyContext.Consumer>
    {
      //always pass a function
      (context) => (
        <div>
          <span id='break-label'>Break Length</span><br />
            <div id='session'>
              <button id='break-increment' onClick={context.handleBreakIncrement}>+</button>
            <p id='break-length'>{context.state.break}</p>
              <button id='break-decrement' onClick={context.handleBreakDecrement}>-</button>
            </div>
        </div>
    )
    }
  </MyContext.Consumer>
</div>)


class Session extends Component {

  render() {
    return (
      <div id="wrapper" >

        <MyContext.Consumer>
          {((context) => (
              <div>
                <span id='session-label'>Session Length</span><br />

                <div id='session'>
                  <button id='session-increment' onClick={context.handleIncrement}>+</button>
                <p id='session-label'>{context.state.session}</p>
                  <button id='session-decrement' onClick={context.handleDecrement}>-</button>
                </div>

              </div>
          ))}
        </MyContext.Consumer>

      </div>

    )
  }
}


const Main = () => {
  return (
    <MyContext.Consumer>

      {
        (context) => {
          return (
            <React.Fragment>
              <span id='time-label'>Session</span>
              <p id='time-left' >{context.state.session}:00</p>
                <button id='start-stop' onClick={context.showTimer}>start</button>
              <button id='reset' onClick={context.resetTimer}>Reset</button>
                <audio id="beep" preload="auto"
             src="https://goo.gl/65cBl1"
             />
            </React.Fragment>
          )
        }
      }

    </MyContext.Consumer>
  )
}


class App extends Component {

  render() {
    return (<MyProvider>
      <div className="App">
        <Session />
        <Break />
        <Main />
      </div>
    </MyProvider>);
  }
}

export default App;
