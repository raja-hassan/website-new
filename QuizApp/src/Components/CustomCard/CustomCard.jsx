import React from 'react';
import Card from 'react-bootstrap/Card';

function CustomCard(props) {
  return (
    <Card className="custom-card">
      <Card.Img 
        variant="top" 
        src={props.cardimg} 
        className="custom-card-img" 
      />
      <Card.Body>
        <Card.Title>{props.cardTitle}</Card.Title>
        <Card.Text>
          {props.cardText}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default CustomCard;
