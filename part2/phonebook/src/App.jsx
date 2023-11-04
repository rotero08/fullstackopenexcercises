/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";

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

const Persons = ({ person }) => {
  return (
    <li>
      {person.name} {person.number}
    </li>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3002/persons")
      .then((response) => setPersons(response.data));
  }, []);

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

    const nameDuplicate = (person) =>
      JSON.stringify(person.name) === JSON.stringify(newName);

    const duplicate = persons.some(nameDuplicate);

    if (duplicate) {
      return alert(`${newName} is already added to phonebook`);
    }

    const newPerson = {
      name: newName,
      number: newNumber,
    };

    setPersons(persons.concat(newPerson));
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().startsWith(newFilter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
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
          <Persons key={person.name} person={person} />
        ))}
      </ul>
    </div>
  );
};

export default App;
