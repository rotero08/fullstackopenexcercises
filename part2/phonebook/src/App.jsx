/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import personsService from "./services/persons";

const Notification = ({ notificationMessage, isError }) => {
  if (notificationMessage === null) {
    return null;
  }

  if (!isError) {
    return <div className="success">{notificationMessage}</div>;
  }

  return <div className="error">{notificationMessage}</div>;
};

const Filter = ({ newFilter, handleFilterInput }) => {
  return (
    <div>
      filter shown with <input value={newFilter} onChange={handleFilterInput} />
    </div>
  );
};

const PersonForm = (props) => {
  return (
    <div>
      <form onSubmit={props.handleSubmit}>
        <div>
          name: <input value={props.newName} onChange={props.handleNameInput} />
        </div>
        <div>
          number:{" "}
          <input value={props.newNumber} onChange={props.handleNumberInput} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  );
};

const Persons = ({ person, handleDelete }) => {
  return (
    <li>
      {person.name} {person.number}{" "}
      <button onClick={handleDelete}>delete</button>
    </li>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    personsService.getAll().then((response) => {
      setPersons(response.data);
    });
  }, [newName]);

  const handleNameInput = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberInput = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterInput = (event) => {
    setNewFilter(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newPerson = {
      name: newName,
      number: newNumber,
    };

    const nameDuplicate = (person) =>
      JSON.stringify(person.name) === JSON.stringify(newName);

    const isDuplicate = persons.some(nameDuplicate);

    if (isDuplicate) {
      const duplicateId = persons.filter(nameDuplicate)[0].id;

      if (
        !window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        return;
      }

      personsService
        .update(duplicateId, newPerson)
        .then((response) => {
          setPersons(
            persons.map((person) =>
              person.id === duplicateId ? newPerson : person
            )
          );
          setNewName("");
          setNewNumber("");
          setIsError(false);
          setNotificationMessage(`${response.data.name} changed number`);
          setTimeout(() => {
            setNotificationMessage(null);
          }, 5000);
        })
        .catch((error) => {
          setIsError(true);
          setNotificationMessage(
            `Information of ${newPerson.name} has already been removed from server`
          );
          setTimeout(() => {
            setNotificationMessage(null);
          }, 5000);
        });
      return;
    }

    personsService
      .create(newPerson)
      .then((response) => {
        setPersons(persons.concat(response.data));
        setNewName("");
        setNewNumber("");
        setIsError(false);
        setNotificationMessage(`Added ${response.data.name}`);
        setTimeout(() => {
          setNotificationMessage(null);
        }, 5000);
      })
      .catch((error) => {
        setIsError(true);
        setNotificationMessage(`${error.response.data.error}`);
        setTimeout(() => {
          setNotificationMessage(null);
        }, 5000);
      });
  };

  const handleDelete = (person) => {
    if (!window.confirm(`Delete ${person.name}`)) {
      return console.log(person.id);
    }
    personsService
      .deletes(person.id)
      .then((response) => {
        setPersons(persons.filter((per) => per.id !== person.id));
      })
      .catch((error) => {
        console.log(person.id);
        setIsError(true);
        setNotificationMessage(
          `Information of ${person.name} has already been removed from server`
        );
        setTimeout(() => {
          setNotificationMessage(null);
        }, 5000);
      });
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().startsWith(newFilter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        notificationMessage={notificationMessage}
        isError={isError}
      />
      <Filter newFilter={newFilter} handleFilterInput={handleFilterInput} />
      <h2>add a new</h2>
      <PersonForm
        handleSubmit={handleSubmit}
        handleFilterInput={handleFilterInput}
        handleNameInput={handleNameInput}
        handleNumberInput={handleNumberInput}
        newName={newName}
        newNumber={newNumber}
      />
      <h2>Numbers</h2>
      <ul>
        {filteredPersons.map((person) => (
          <Persons
            key={person.name}
            person={person}
            handleDelete={() => handleDelete(person)}
          />
        ))}
      </ul>
    </div>
  );
};

export default App;
