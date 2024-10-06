import { Container, Form, Button, Card, Modal } from 'react-bootstrap';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToTrip, addToItinerary, deleteTrip } from '../features/trip/tripSlice';
import '../App.css';

export default function AddTrip() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTripId, setCurrentTripId] = useState(null);
  const [tripName, setTripName] = useState('');
  const [tripDestination, setTripDestination] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [itineraryName, setItineraryName] = useState('');
  const [itineraryDate, setItineraryDate] = useState(''); 
  const [itineraryRemarks, setItineraryRemarks] = useState(''); 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tripList } = useSelector((state) => state.trip);

  const openModal = (tripId) => {
    setCurrentTripId(tripId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentTripId(null);
  }

  const addTrip = (e) => {
    e.preventDefault();
    const newTrip = {
      id: Date.now(),
      tripName,
      tripDestination,
      dateFrom,
      dateTo,
    };
    dispatch(addToTrip(newTrip));
    navigate('/trip/add');
  };

  const addItinerary = () => {
    const newItinerary = {
      id: Date.now(),
      name: itineraryName,
      date: itineraryDate,
      remarks: itineraryRemarks,
    };
    dispatch(addToItinerary({ tripId: currentTripId, itinerary: newItinerary }));
    closeModal();
    navigate('/trip/add');
  };

  const deleteTripFromList = (tripId) => {
    dispatch(deleteTrip(tripId));
  };

  return (
    <>
      <Container className="mt-4">
        <Container fluid className="trip_form rounded rounded-lg">
          <Form onSubmit={addTrip}>
            <Form.Group className="mb-3">
              <Form.Label>Trip Name:</Form.Label>
              <Form.Control
                type="text"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Destination:</Form.Label>
              <Form.Control
                type="text"
                value={tripDestination}
                onChange={(e) => setTripDestination(e.target.value)}
                required
              />
            </Form.Group>
            <div className="date d-flex justify-content-between mb-5">
              <Form.Group className="date_input">
                <Form.Label>From:</Form.Label>
                <Form.Control
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="date_input">
                <Form.Label>To:</Form.Label>
                <Form.Control
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  required
                />
              </Form.Group>
            </div>
            <Button type="submit" className="btn btn-primary w-25">
              Submit
            </Button>
          </Form>
        </Container>
      </Container>

      <div className="my-5 container">
        {tripList.map((trip) => (
          <Card className="w-100 mb-4" key={trip.id}>
            <Card.Body>
              <Card.Title>
                {trip.tripName} in {trip.tripDestination}
              </Card.Title>
              <Card.Subtitle className="mb-2 text-muted fst-italic">
                {new Date(trip.dateFrom).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} - {new Date(trip.dateTo).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
              </Card.Subtitle>
              <div className="mt-4">
                <Button variant="primary"><a href={`/trip/view/${trip.id}`} className="text-white">View Details</a></Button>
                <Button variant="success" onClick={() => openModal(trip.id)} className="mx-2">Add Itinerary</Button>

                {modalOpen && (
                  <Modal show={modalOpen} onHide={closeModal}>
                    <Modal.Header closeButton>
                      <Modal.Title>Add Itinerary</Modal.Title>
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
                        <Button variant="primary" onClick={() => addItinerary(trip.id)} className="mt-4">Add Itinerary</Button>
                      </Form>
                    </Modal.Body>
                  </Modal>
                )}
                
                <Button variant="danger" onClick={() => deleteTripFromList(trip.id)}>Delete</Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </>
  );
}
