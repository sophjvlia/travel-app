import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Container, ListGroup, Card, Button, Modal, Form } from 'react-bootstrap'
import { editTrip, editItinerary, deleteItinerary } from '../features/trip/tripSlice';

export default function ViewTrip() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const tripList = useSelector((state) => state.trip.tripList);
  const trip = tripList.find((trip) => trip.id === parseInt(id));
  const [modalOpen, setModalOpen] = useState(false);
  const [tripModalOpen, setTripModalOpen] = useState(false);
  const [currentTripId, setCurrentTripId] = useState(null);
  const [currentItinerary, setCurrentItinerary] = useState(null);
  const [itineraryName, setItineraryName] = useState('');
  const [itineraryDate, setItineraryDate] = useState(''); 
  const [itineraryRemarks, setItineraryRemarks] = useState('');
  const [tripName, setTripName] = useState(trip.tripName);
  const [tripDestination, setTripDestination] = useState(trip.tripDestination);
  const [dateFrom, setDateFrom] = useState(trip.dateFrom);
  const [dateTo, setDateTo] = useState(trip.dateTo);
  const [timers, setTimers] = useState(Array(trip.itineraries?.length || 0).fill(0));
  const [timerIntervals, setTimerIntervals] = useState(Array(trip.itineraries?.length || 0).fill(null));
  const [countries, setCountries] = useState([]);

  if (!trip) {
    return <div>Trip not found!</div>;
  }

  const openModal = (tripId, itinerary) => {
    setCurrentTripId(tripId);
    setCurrentItinerary(itinerary);
    setItineraryName(itinerary.name);  
    setItineraryDate(itinerary.date);  
    setItineraryRemarks(itinerary.remarks);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentItinerary(null);
  }

  const openTripModal = (trip) => {
    setCurrentTripId(trip.id);
    setTripName(trip.tripName);
    setTripDestination(trip.tripDestination);  
    setDateFrom(trip.dateFrom);
    setDateTo(trip.dateTo);
    setTripModalOpen(true);
  };

  const closeTripModal = () => {
    setTripModalOpen(false);
    setCurrentTripId(null);
  }

  const saveTrip = (tripId, trip) => {
    dispatch(editTrip({ tripId, trip }));
    setTripName(trip.name);
    setTripDestination(trip.destination);
    setDateFrom(trip.dateFrom);
    setDateTo(trip.dateTo);
    closeTripModal();
  };

  const saveItinerary = (tripId, itinerary) => {
    dispatch(editItinerary({ tripId, itinerary }));
    closeModal();
  };

  const removeItinerary = (tripId, itineraryId) => {
    dispatch(deleteItinerary({ tripId, itineraryId }));
  };

  const startTimer = (index) => {
    timerIntervals.forEach((intervalID, i) => {
      if (intervalID !== null && i !== index) {
        clearInterval(intervalID);
        setTimerIntervals((prev) => {
          const newIntervals = [...prev];
          newIntervals[i] = null;
          return newIntervals;
        });
      }
    });

    if (timerIntervals[index] === null) {
      const intervalID = setInterval(() => {
        setTimers((prev) => {
          const newTimers = [...prev];
          newTimers[index] += 1;
          return newTimers;
        });
      }, 1000);

      setTimerIntervals((prev) => {
        const newIntervals = [...prev];
        newIntervals[index] = intervalID;
        return newIntervals;
      });
    }
  };

  const pauseTimer = (index) => {
    if (timerIntervals[index] !== null) {
      clearInterval(timerIntervals[index]);
      setTimerIntervals((prev) => {
        const newIntervals = [...prev];
        newIntervals[index] = null;
        return newIntervals;
      });
    }
  };
  
  const resetTimer = (index) => {
    if (timerIntervals[index] !== null) {
      clearInterval(timerIntervals[index]);
    }
    setTimerIntervals((prev) => {
      const newIntervals = [...prev];
      newIntervals[index] = null;
      return newIntervals;
    });
    setTimers((prev) => {
      const newTimers = [...prev];
      newTimers[index] = 0;
      return newTimers;
    });
  };

  useEffect(() => {
    return () => {
      clearInterval(timerIntervals);
    }
  }, [timerIntervals]);

  useEffect(() => {
    async function fetchCountries() {
      try {
        const url = "https://countriesnow.space/api/v0.1/countries/info?returns=name";
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const data = await response.json();
        setCountries(data.data);
      } catch (error) {
        console.log("Error fetching data:", error.message);
      }
    }
    fetchCountries();
  }, []);

  return (
    <Container className="mt-5">
      <Card className="w-100">
        <Card.Body>
          <Card.Title>{tripName} in {tripDestination}</Card.Title>
          <Card.Subtitle className="mb-3 text-muted fst-italic">
            {new Date(dateFrom).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} - {new Date(dateTo).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
          </Card.Subtitle>

          <strong>Itineraries:</strong>
          {trip.itineraries && trip.itineraries.length > 0 && (
            <ListGroup className="mt-2">
              {trip.itineraries.map((itinerary, index) => (
                <ListGroup.Item key={index}>
                  <p className="m-0">{itinerary.name}</p>
                  <p className="m-0 text-muted fst-italic">{new Date(itinerary.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                  <p className="m-0">{itinerary.remarks}</p>
                  <div>
                    <p>Timer: {timers[index]} seconds</p>
                    <Button size="sm" onClick={() => startTimer(index)}>
                      <i className="bi bi-play"></i>
                    </Button>
                    <Button size="sm" onClick={() => pauseTimer(index)} className="ms-2">
                      <i className="bi bi-pause-fill"></i>
                    </Button>
                    <Button size="sm" onClick={() => resetTimer(index)} className="ms-2">
                      <i className="bi bi-arrow-clockwise"></i>
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => openModal(trip.id, itinerary)} className="ms-2">
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button size="sm" variant="danger" className="ms-2">
                      <i className="bi bi-trash" onClick={() => removeItinerary(trip.id, itinerary.id)}></i>
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}

          {modalOpen && currentItinerary && (
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
                  <Button variant="primary" onClick={() => saveItinerary(currentTripId, { id: currentItinerary.id, name: itineraryName, date: itineraryDate, remarks: itineraryRemarks })} className="mt-4">Save Changes</Button>
                </Form>
              </Modal.Body>
            </Modal>
          )}

          {tripModalOpen && (
            <Modal show={tripModalOpen} onHide={closeTripModal}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Trip</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Trip Name</Form.Label>
                    <Form.Control type="text" value={tripName} onChange={(e) => setTripName(e.target.value)} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Destination</Form.Label>
                    <Form.Control
                      as="select" 
                      value={tripDestination}
                      onChange={(e) => setTripDestination(e.target.value)}
                      required
                    >
                      <option value="">Select a country</option>
                      {countries.map((country, index) => (
                        <option key={index} value={country.name} selected={tripDestination == country.name}>
                          {country.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Date From</Form.Label>
                    <Form.Control type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Date To</Form.Label>
                    <Form.Control type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                  </Form.Group>
                  <Button variant="primary" onClick={() => saveTrip(currentTripId, { id: trip.id, name: tripName, destination: tripDestination, dateFrom, dateTo })} className="mt-4">Save Changes</Button>
                </Form>
              </Modal.Body>
            </Modal>
          )}

          {(!trip.itineraries || trip.itineraries.length === 0) && (
            <div className="text-muted mt-3">No itineraries added yet.</div>
          )}

          <Button variant="primary" onClick={() => openTripModal(trip)} className="mt-4"> Edit Trip</Button>
        </Card.Body>
      </Card>
    </Container>
  );
}