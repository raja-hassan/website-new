import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";

function CustomOffcanvas({
  show,
  setShow,
  btnText,
  headtitle,
  fields = [],
  onSubmit,
}) {
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button className="btn-light-blue" onClick={handleShow}>
        {btnText}
      </Button>

      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="end"
        style={{ width: "580px" }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{headtitle}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <form onSubmit={(e) => onSubmit(e)}>
            {fields.map((FieldComponent, index) => (
              <div key={index} className="mb-3">
                {FieldComponent}
              </div>
            ))}
            <div className="text-end mt-4">
              <Button type="submit" className="btn-light-blue">
                Save
              </Button>
              <Button className="btn-light-blue ms-2" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default CustomOffcanvas;
