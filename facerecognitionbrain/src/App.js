import React from 'react';
import Navigation from './components/Navigation/Navigation';
import Clarifai from 'clarifai';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';
import Particles from 'react-particles-js';
import {particlesOptions} from './ParticlesOptions'




const app = new Clarifai.App({
  apiKey: 'b74597eeb8754315819f07f10343934f'
 });

class App extends React.Component {
  constructor(){
    super()
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user : {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) =>{
    this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row *height,
      rightCol: width - (clarifaiFace.right_col*width),
      bottomRow: height - (clarifaiFace.bottom_row* height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box : box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL,
      this.state.input)
    .then(response => {
      if(response){
        fetch('http://localhost:3000/image',{
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        }).then(data => {
          data.json().then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
        })
      }
      this.displayFaceBox(this.calculateFaceLocation(response));
    },err =>{
      alert("Server Error");
    });
  }

  onRouteChange = (route) => {
    if(route === 'register'){
      this.setState({isSignedIn: false});
    }else if(route === 'home'){
      this.setState({isSignedIn: true});
    }else if(route === 'signin'){
      this.setState({isSignedIn: false});
    }else if(route === 'signout'){
      this.setState({isSignedIn: false});
    }
    this.setState({route: route});
  }


  render(){
    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions}/>
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        {
          this.state.route === 'home' ?
          <div>
            <Logo />
            <Rank entries={this.state.user.entries} name={this.state.user.name}/>
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
          </div>
          :
          this.state.route === 'signin'
          ? <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser}/> 
          : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
        }
      </div>
    );
  }
}

export default App;
