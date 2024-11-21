import { useState } from 'react';
import './CustomProfile.scss'
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FaCamera } from "react-icons/fa6";
import CustomTextField from '../../Components/CustomTextField/CustomTextField'
import CustomEmailField from '../../Components/CustomEmailField/CustomEmailField'
import CustomPasswordField from '../../Components/CustomPasswordField/CustomPasswordField'


function CustomProfile(props) {

    const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const [file, setFile] = useState(null);

  const handleChange = (event) => {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
          const fileURL = URL.createObjectURL(selectedFile);
          setFile(fileURL);
      }
  };

  const handleEdit = () => {
      document.getElementById('fileInput').click();
  };

  return (
    <>
        <Button onClick={handleShow} style={{background: 'Transparent', borderColor: 'transparent'}}>
        <img src={props.profileimg} alt="" className='profile-img'/>
      </Button>

      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Profile Details</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
            <div className="profile-img-wrape">
              <img 
                  src={file || "https://via.placeholder.com/100"} 
                  alt="Selected or Placeholder" 
                  style={{ width: '100px', height: '100px', display: 'block', margin: '0 auto', borderRadius: '50%' }} 
              />
              <input
                  id="fileInput"
                  type="file"
                  onChange={handleChange}
                  style={{ display: 'none' }}
              />
              <button className='edit-btn' onClick={handleEdit} style={{ cursor: 'pointer' }}>
              <FaCamera />
              </button>
              <CustomTextField label="User Name" placeholder="Enter User Name" />
              <CustomEmailField label="Email" placeholder="Enter Email" />
              <CustomPasswordField label="Password" placeholder="Enter Password"/>
              <div className="text-end mt-4">
                <button type="button" className="btn-light-blue btn btn-primary">Save Profile</button>
              </div>
            </div>
            
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

export default CustomProfile