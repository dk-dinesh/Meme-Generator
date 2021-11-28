
// import Button from '@restart/ui/esm/Button';
import axios from 'axios';
import React from 'react';
import { Col, Container, Form, Button } from 'react-bootstrap';
import './App.css';
import Footer from './Footer';
import Meme from './Meme';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allTemp: [],
      memeSelect: null,
      showMarque: true,
      result: null,
      input1: "",
      input2: "",
      input3: "",
      input4: "",
      input5: ""
    }
  }
  componentDidMount() {
    fetch('https://api.imgflip.com/get_memes')
      .then((data) => data.json())
      .then((res) => this.setState({ allTemp: res.data.memes }))
      .catch((err) => console.log(err))
  }

  objectToQuery = (obj) => {
    const params = Object.entries(obj).map(([key, value]) => `${key}=${value}`)
    return '?' + params.join('&');
  }
  render() {
    var { allTemp, memeSelect, showMarque, input1, input2, input3, input4, input5, result } = this.state;
    console.log(allTemp)
    return (
      <div className="App">
        <div id="heading">
          <h1>Create your own Meme</h1>
        </div><br /><br />
        {showMarque && <marquee style={{ color: 'white', paddingTop: '50px' }}>Click on any template to select</marquee>}
        <Container>
          <div id="contain1">
            {!memeSelect && allTemp.map(item => {
              return <Meme item={item} onClick={() => this.setState({ memeSelect: item, showMarque: false })} />
            })}
          </div>
          {memeSelect &&
            <>
              <h3>Fill {memeSelect.box_count} input boxes</h3>
              <Container id="contain2">
                <Col>
                  <img id="raw-img" src={memeSelect.url} width="100%" alt="meme" />
                  <Form onSubmit={async (e) => {
                    e.preventDefault();
                    var boxes;
                    switch (memeSelect.box_count) {
                      case 1: boxes = [{ text: input1 }]; break;
                      case 2: boxes = [{ text: input1 }, { text: input2 }]; break;
                      case 3: boxes = [{ text: input1 }, { text: input2 }, { text: input3 }]; break;
                      case 4: boxes = [{ text: input1 }, { text: input2 }, { text: input3 }, { text: input4 }]; break;
                      case 5: boxes = [
                        { text: input1 },
                        { text: input2 },
                        { text: input3 },
                        { text: input4 },
                        { text: input5 }]; break;
                      default: boxes = []
                        break;
                    }

                    const params = {
                      template_id: memeSelect.id,
                      username: '',
                      password: '',
                      boxes: boxes
                    };
                    var url = `https://api.imgflip.com/caption_image${this.objectToQuery(params)}`;
                    boxes.map((item, index) => {
                      url += `&boxes[${index}][text]=${item.text}`;
                    })
                    // console.log(url);
                    const res = await fetch(url);
                    var data = await res.json();
                    console.log(data);
                    this.setState({ result: data.data });
                  }}>
                    <div class="input-group mb-3">
                      <input type="text" onChange={(e) => this.setState({ input1: e.target.value })} className="form-control" placeholder="Enter Text1" />
                    </div>
                    {memeSelect.box_count > 1 && <div className="input-group mb-3">
                      <input type="text" onChange={(e) => this.setState({ input2: e.target.value })} className="form-control" placeholder="Enter Text2" />
                    </div>}
                    {memeSelect.box_count > 2 && <div className="input-group mb-3">
                      <input type="text" onChange={(e) => this.setState({ input3: e.target.value })} className="form-control" placeholder="Enter Text3" />
                    </div>}
                    {memeSelect.box_count > 3 && <div className="input-group mb-3">
                      <input type="text" onChange={(e) => this.setState({ input4: e.target.value })} className="form-control" placeholder="Enter Text4" />
                    </div>}
                    {memeSelect.box_count > 4 && <div className="input-group mb-3">
                      <input type="text" onChange={(e) => this.setState({ input5: e.target.value })} className="form-control" placeholder="Enter Text5" />
                    </div>}
                    <div style={{display:'flex',justifyContent:'space-evenly'}}>
                    <Button type="submit" variant="success">Create Meme</Button>
                    <Button className="ms-5" onClick={()=>this.setState({ memeSelect: null, showMarque: true, result:null })} variant="success">Change Template</Button>
                    </div>
                  </Form>
                </Col>
                <Col xs={2}></Col>
                <Col>
                  {result && <img id="result" src={result.url} width="100%" alt="meme" />}
                  {result && <Button onClick={() => {
                    axios({
                      url: result.url,
                      method: 'GET',
                      responseType: 'blob',
                    }).then((response) => {
                      const url = window.URL.createObjectURL(new Blob([response.data]));
                      const link = document.createElement('a');
                      link.href = url;
                      link.setAttribute('download', 'Meme.jpg');
                      document.body.appendChild(link);
                      link.click();
                    });
                  }} variant="success">Download Meme</Button>}
                </Col>
              </Container>
            </>
          }
        </Container>
        <Footer />
      </div>
    );
  }
}

export default App;
