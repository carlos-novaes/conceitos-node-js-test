const express = require('express');
const cors = require('cors');

const { v4: uuid, validate: isUuid, validate } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) => {
  return response.status(200).json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const newRepo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(newRepo);

  return response.status(200).json(newRepo);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const findRepositoryIndex = repositories.findIndex((repository) => repository.id === id);

  if (findRepositoryIndex === -1) {
    return response.status(400).json({ error: 'Repository does not exist' });
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[findRepositoryIndex].likes,
  };

  repositories[findRepositoryIndex] = repository;

  return response.json(repository);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((r) => r.id === id);

  if (repoIndex === -1) {
    return response.status(400).json({ error: 'Repository does not exist' });
  } else {
    repositories.splice(repoIndex, 1);
    return response.status(204).send();
  }
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const findRepositoryIndex = repositories.findIndex((repository) => repository.id === id);

  if (findRepositoryIndex === -1) {
    return response.status(400).json({ error: 'Repository does not exist' });
  }

  repositories[findRepositoryIndex].likes += 1;

  return response.json(repositories[findRepositoryIndex]);
});

module.exports = app;
