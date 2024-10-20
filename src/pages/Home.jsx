import { Form, Button, Card, Modal } from 'react-bootstrap';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToItinerary, deleteTrip } from '../features/trip/tripSlice';
import '../App.css';

export default function AddTrip() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTripId, setCurrentTripId] = useState(null);
  const [itineraryName, setItineraryName] = useState('');
  const [itineraryDate, setItineraryDate] = useState(''); 
  const [itineraryRemarks, setItineraryRemarks] = useState('');
  const dispatch = useDispatch();
  const { tripList } = useSelector((state) => state.trip);

  const openModal = (tripId) => {
    setCurrentTripId(tripId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentTripId(null);
  }

  const addItinerary = () => {
    const newItinerary = {
      id: Date.now(),
      name: itineraryName,
      date: itineraryDate,
      remarks: itineraryRemarks,
    };
    dispatch(addToItinerary({ tripId: currentTripId, itinerary: newItinerary }));
    setItineraryDate('');
    setItineraryName('');
    setItineraryRemarks('');
    closeModal();
  };

  const deleteTripFromList = (tripId) => {
    dispatch(deleteTrip(tripId));
  };

  return (
    <>
      <div className="my-5 container">
        {tripList.length === 0 ? (
          <div className="text-center">
            <p>No trips at the moment.</p>
          </div>
        ) : (
        tripList.map((trip) => (
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
        )))}
      </div>
    </>
  );
}
