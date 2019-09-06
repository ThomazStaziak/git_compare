import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaPlus, FaSpinner } from 'react-icons/fa';

import api from '../../services/api';

import Container from '../../components/Container';
import { Form, SubmitButton, List } from './styles';

export default function Main() {
  const [newRepo, setNewRepo] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);

  // componentDidMount
  useEffect(() => {
    const localRepositories = localStorage.getItem('repositories');

    if (localRepositories) {
      setRepositories(JSON.parse(localRepositories));
    }
  }, []);

  // componentDidUpdate
  useEffect(() => {
    localStorage.setItem('repositories', JSON.stringify(repositories));
  }, [repositories]);

  function handleInputChange(evt) {
    setNewRepo(evt.target.value);
  }

  async function handleSubmit(evt) {
    evt.preventDefault();

    setLoading(true);

    if (newRepo === '') {
      setNewRepo('');
      setLoading(false);
    }

    const response = await api.get(`/repos/${newRepo}`);

    const data = {
      name: response.data.full_name,
    };

    setRepositories([...repositories, data]);
    setNewRepo('');
    setLoading(false);
  }

  return (
    <Container>
      <h1>
        <FaGithub />
        Repositories
      </h1>

      <Form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Add a repository"
          value={newRepo}
          onChange={handleInputChange}
        />
        <SubmitButton loading={loading}>
          {loading ? (
            <FaSpinner color="#fff" size={14} />
          ) : (
            <FaPlus color="#fff" size={14} />
          )}
        </SubmitButton>
      </Form>

      <List>
        {repositories.map(repository => (
          <li key={repository.name}>
            <span>{repository.name}</span>
            <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
              Detalhes
            </Link>
          </li>
        ))}
      </List>
    </Container>
  );
}
