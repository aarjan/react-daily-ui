import './App.css'
import React from "react";


const Navigation =() => {
  return (
  <div className="Navigation" >
    <nav>
      <ul>
        <li>Browse</li>
        <li>My list</li>
        <li>Top picks</li>
        <li>Recent</li>
      </ul>
    </nav>  
  </div>
  )
}

const Search = ({onChange,onSubmit,value}) => {
  return (
    <div className="Search" >
      <input type="search" placeholder="Search for a title" value={value} onKeyUp={(e)=> onSubmit(e)} onChange={(e) => onChange(e)} />
    </div>
  )
}

const Profile = () => {
  return (
  <div className="UserProfile" >
    <div className="User">
      <div className="name">Sarah Johnson</div>
      <div className="image">
        <img alt="user profile" src="http://preview.byaviators.com/template/superlist/assets/img/tmp/agent-2.jpg"/>
      </div>
    </div>
  </div>
  )
}

const Header = ({onChange,onSubmit,value}) => {
  return (
    <div className="Header">
      <div className="Logo">NETFLIX</div>
      <Navigation/>
      <Search onChange={onChange} onSubmit={onSubmit} value={value}/>
      <Profile/>
    </div>
  )
}

const Hero = () => {
  return (
    <div id="hero" className="Hero" style={{backgroundImage: 'url(https://images.alphacoders.com/633/633643.jpg)'}}>
        <div className="content">
          <img className="logo" src="http://www.returndates.com/backgrounds/narcos.logo.png" alt="narcos background" />
          <h2>Season 2 now available</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque id quam sapiente unde voluptatum alias vero debitis, magnam quis quod.</p>
          <div className="button-wrapper">
            <HeroButton primary={true} text="Watch now" />
            <HeroButton primary={false} text="+ My list" />
          </div>
        </div>
        <div className="overlay"></div>
      </div>
  )
}
const HeroButton = ({primary,text}) => {
    return (
      <a href="#" className="Button" data-primary={primary}>{text}</a>
    );
}

class ListToggle extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      toggled:false
    }
  }
  handleClick = () => {
    const toggleState = this.state.toggled
    this.setState({
      toggled:toggleState?false:true
    })
  }
  render() {
    return (
      <div className="ListToggle" data-toggled={this.state.toggled} onClick={this.handleClick} >
        <div>
        <i className="fa fa-fw fa-plus"></i>
        <i className="fa fa-fw fa-check"></i>
        </div>
      </div>
    ) 
  }
}

const Item = ({title,rating,plot,backDrop}) => {
  return (
    <div className="Item" style={{backgroundImage: 'url(' +backDrop + ')'}} >
      <div className="overlay">
        <div className="title">{title}</div>
        <div className="rating">{rating} / 10</div>
        <div className="plot">{plot}</div>
        <ListToggle/>
      </div>
    </div>
  )
}

class TitleList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      mounted:false,
    };
    // this.loadContent = this.loadContent.bind(this);
  }

  loadContent = () => {
    var requestUrl = 'https://api.themoviedb.org/3/' + this.props.url;
    fetch(requestUrl)
    .then(response => response.json())
    .then(content => this.setState({data:content.results}))
    .catch(err => console.log("error",err));
  }
  
  componentWillReceiveProps(nextProps) {
    if(nextProps.url !== this.props.url && nextProps.url !== ''){
      // not understood; why not as in componentDidMount()
      this.setState({mounted:true},()=>{
        this.loadContent();
      });
    }
  }
  componentDidMount() {
    if (this.props.url!=="") {
      this.loadContent();
      this.setState({mounted:true})
    }
  }

  render() {
    var titles = ""
    if (this.state.data){
      titles = this.state.data.map((d,i)=> {
        if (i<5){
          let backDrop = 'http://image.tmdb.org/t/p/original' + d.backdrop_path;
          return <Item key={d.id} title={d.name} rating={d.vote_average} plot={d.overview} backDrop={backDrop}/>
        }else {
          return <div key={d.id}></div>
        }
      })
    }
    
    return (
    <div  ref="titlecategory" className="TitleList" data-loaded={this.state.mounted}>
      <div className="Title">
        <h1>{this.props.title}</h1>
        <div className="titles-wrapper">
          {titles}
        </div>
      </div>
    </div>
    )
  }
}


export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      searchTerm:"",
      searchUrl:""
    }
    this.apiKey = '87dfa1c669eea853da609d4968d294be'
  }
  
  handleChange = (e) => {
    this.setState({searchTerm:e.target.value})
  }
  
  handleKeyUp = (e) => {
    if (e.key === 'Enter' && this.state.searchTerm !== '') {
      var searchUrl = "search/multi?query=" + this.state.searchTerm + "&api_key=" + this.apiKey;
      this.setState({searchUrl:searchUrl});
    }
  }

  render(){
    return (
      <div>
        <Header onChange={this.handleChange} onSubmit={this.handleKeyUp} value={this.state.searchTerm}/>
        <Hero/>
        <TitleList title="Search Results" url={this.state.searchUrl} />
        <TitleList title="Top TV picks for Jack" url={'discover/tv?sort_by=popularity.desc&page=1&api_key=87dfa1c669eea853da609d4968d294be'}/>
        <TitleList title="Trending now" url={'discover/movie?sort_by=popularity.desc&page=1&api_key=87dfa1c669eea853da609d4968d294be'} />
        <TitleList title="Most watched in Horror" url={'genre/27/movies?sort_by=popularity.desc&page=1&api_key=87dfa1c669eea853da609d4968d294be' } />
        <TitleList title="Sci-Fi greats" url={'genre/878/movies?sort_by=popularity.desc&page=1&api_key=87dfa1c669eea853da609d4968d294be'} />
        <TitleList title="Comedy magic" url={'genre/35/movies?sort_by=popularity.desc&page=1&api_key=87dfa1c669eea853da609d4968d294be'} />
      </div>
    )
  }
}

