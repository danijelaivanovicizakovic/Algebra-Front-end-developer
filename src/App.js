import React, { Component } from 'react';
import './App.css';
import Messages from "./Messages";
import Input from "./Input";

//odabir nasumičnog imena iz polja
function randomName() {
  const imena = [
    'Ana','Anja','Blanka','Bojana','Blaženka','Danijela',
    'Danica','Dijana','Dina','Dinka','Dragica','Ema','Eva','Gordana',
    'Helena','Ira','Iva','Ivana','Ivanka','Jana','Josipa','Karla','Lara',
    'Lora','Luna','Maja','Mara','Marija','Ozana','Oksana','Ružica','Sandra','Sara',
    'Svjetlana','Štefica','Tanja','Vesna','Vlatka','Zlatica','Žana','Željka'
  ];
  const ime = imena[Math.floor(Math.random() * imena.length)];
  return ime;
}
//generiranje nasumične boje 
function randomColor() {
  const znakovi = '0123456789ABCDEF'.split('');
  let boja = '#';
  for (let i = 0; i < 6; i++ ) {
   
      boja += znakovi[Math.round(Math.random() * 15)];
  }
  return boja;
}

class App extends Component {
  state = {
    messages: [],
    member: {
      username: randomName(),
      color: randomColor(),
    }
  }

  constructor() {
    super();
    this.drone = new window.Scaledrone("jvLEZFOAiVxQVRq3", {
      data: this.state.member
        });
    this.drone.on('open', error => {
      if (error) {
        return console.error(error);
      }
      const member = {...this.state.member};
      member.id = this.drone.clientId;
      this.setState({member});
    });
    const room = this.drone.subscribe("observable-room");
    room.on('data', (data, member) => {
      const messages = this.state.messages;
      messages.push({member, text: data});
      this.setState({messages});
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>Ženski razgovori</h1>
        </div>
        <Messages
          messages={this.state.messages}
          currentMember={this.state.member}
        />
        <Input
          onSendMessage={this.onSendMessage}
        />
      </div>
    );
  }

  onSendMessage = (message) => {
    this.drone.publish({
      room: "observable-room",
      message
    });
  }

}

export default App;
