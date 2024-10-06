import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Container, ListGroup, Card, Button, Modal, Form } from 'react-bootstrap'
import { editItinerary } from '../features/trip/tripSlice';

export default function ViewTrip() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTripId, setCurrentTripId] = useState(null);
  const [itineraryName, setItineraryName] = useState('');
  const [itineraryDate, setItineraryDate] = useState(''); 
  const [itineraryRemarks, setItineraryRemarks] = useState('');
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const { id } = useParams();
  const dispatch = useDispatch();
  const tripList = useSelector((state) => state.trip.tripList);

  const trip = tripList.find((trip) => trip.id === parseInt(id));

  if (!trip) {
    return <div>Trip not found!</div>;
  }

  const openModal = (tripId) => {
    setCurrentTripId(tripId);
    setModalOpen(true);
    setItineraryName(itinerary.name);
    setItineraryDate(itinerary.date);
    setItineraryRemarks(itinerary.remarks);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentTripId(null);
  }

  const editItinerary = (tripId, itinerary) => {
    dispatch(editItinerary({ tripId, itinerary }));
    closeModal();
    navigate('/trip/add');
  };

  const startTimer = () => {
    if (timerInterval === null) {
      const intervalID = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
      setTimerInterval(intervalID);
    }
  };

  const pauseTimer = () => {
    clearInterval(timerInterval);
    setTimerInterval(null);
  };

  const resetTimer = () => {
    clearInterval(timerInterval);
    setTimerInterval(null);
    setTimer(0);
  };

  useEffect(() => {
    return () => {
      clearInterval(timerInterval);
    }
  }, [timerInterval]);

  return (
    <Container className="mt-5">
      <Card className="w-100">
        <Card.Body>
          <Card.Title>{trip.tripName} in {trip.tripDestination}</Card.Title>
          <Card.Subtitle className="mb-3 text-muted">
            {trip.dateFrom} - {trip.dateTo}
          </Card.Subtitle>

          <strong>Itineraries:</strong>
          {trip.itineraries && trip.itineraries.length > 0 && (
            <ListGroup className="mt-2">
              {trip.itineraries.map((itinerary, index) => (
                <ListGroup.Item key={index}>
                  {itinerary.name} {itinerary.date} - {itinerary.remarks}
                  <div>
                    <p>Timer: {timer} seconds</p>
                    <Button size="sm" onClick={startTimer}>
                      <i className="bi bi-play"></i>
                    </Button>
                    <Button size="sm" onClick={pauseTimer} className="ms-2">
                      <i className="bi bi-pause-fill"></i>
                    </Button>
                    <Button size="sm" onClick={resetTimer} className="ms-2">
                      <i className="bi bi-arrow-clockwise"></i>
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => openModal(itinerary)} className="ms-2">
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button size="sm" variant="danger" className="ms-2">
                      <i className="bi bi-trash"></i>
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}

          {modalOpen && (
            <Modal show={modalOpen} onHide={closeModal}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Itinerary</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Itinerary Name</Form.Label>
                    <Form.Control type="text" value={itineraryName} onChange={(e) => setItineraryName(e.target.value)} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="date" value={itineraryDate} onChange={(e) => setItineraryDate(e.target.value)} />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Remarks</Form.Label>
                    <Form.Control as="textarea" rows={3} value={itineraryRemarks} onChange={(e) => setItineraryRemarks(e.target.value)} />
                  </Form.Group>
                  <Button variant="primary" onClick={() => editItinerary(trip.id, { name: itineraryName, date: itineraryDate, remarks: itineraryRemarks })} className="mt-4">Save Changes</Button>
                </Form>
              </Modal.Body>
            </Modal>
          )}

          {(!trip.itineraries || trip.itineraries.length === 0) && (
            <div className="text-muted mt-3">No itineraries added yet.</div>
          )}

          <Button variant="primary" onClick={() => console.log('Edit trip clicked')} className="mt-4"> Edit Trip</Button>
        </Card.Body>
      </Card>
    </Container>
  );
}