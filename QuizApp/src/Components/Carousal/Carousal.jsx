import Carousel from 'react-bootstrap/Carousel';
import "./Carousal.css"
import img6 from './images/6.jpg'
import img9 from './images/9.jpg'
import img8 from './images/8.jpg'
import img13 from './images/13.jpg'
import img14 from './images/14.jpg'

function Carousal() {
  return (
    <Carousel>
      <Carousel.Item>
        <img className='w-100' src={img6} />
      </Carousel.Item>
      <Carousel.Item>
        <img className='w-100' src={img9} />
      </Carousel.Item>
      <Carousel.Item>
        <img className='w-100' src={img8} />
      </Carousel.Item>
      <Carousel.Item>
        <img className='w-100' src={img13} />
      </Carousel.Item>
      <Carousel.Item>
        <img className='w-100' src={img14} />
      </Carousel.Item>
      
    </Carousel>
  );
}

export default Carousal;