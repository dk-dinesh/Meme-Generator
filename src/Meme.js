import React from "react";
import { Card } from "react-bootstrap";
import './App.css';
class Meme extends React.Component {

    render() {
        return (
            <Card onClick={this.props.onClick} id="card">
                <Card.Img className="cardimg" src={this.props.item.url} alt='meme' />
            </Card>
        );
    }
}

export default Meme;
