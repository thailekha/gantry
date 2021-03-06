const express	= require('express');
const controllers = require('./controllers');
const jwtAuthenticate = require('../middleware/jwt-authenticate').jwtAuthenticate;
const container = controllers.container;
const image = controllers.image;
const network = controllers.network;
const volume = controllers.volume;
const docker = controllers.docker;

const router = express.Router();

require('dotenv').config();

if (process.env.GANTRY_SECRET) {
  console.log('Using secret from dotenv');
}

if (process.env.IGNORE_AUTH === 'TRUE') {
  console.log('Dev mode, not using JWT middleware');
} else {
  if (process.env.DD_AGENT_SECRET) {
    console.log('Using secret from dotenv');
  }
  router.use(jwtAuthenticate({ secret: process.env.GANTRY_SECRET || 'secret' }));
}

/* Container Routes */
router.get('/api/containers/running', container.listRunningContainers);
router.get('/api/containers/all', container.listContainers);
router.get('/api/containers/:id/', container.listSpecificContainer);
router.get('/api/containers/:id/stats', container.listContainerStats);
router.post('/api/containers/:id/start', container.startContainer);
router.post('/api/containers/:id/stop', container.stopContainer);
router.post('/api/containers/:id/pause', container.pauseContainer);
router.post('/api/containers/:id/unpause', container.unpauseContainer);
router.post('/api/containers/:id/restart', container.restartContainer);
router.post('/api/containers/create', container.createContainer);
router.delete('/api/containers/:id/remove', container.removeContainer);

/* Image Routes */
router.get('/api/images', image.listImages);
router.get('/api/images/:id', image.listSpecificImage);
router.delete('/api/images/:id', image.removeImage);
router.get('/api/images/:id/history', image.imageHistory);
router.post('/api/images/pull/', image.pullImage);
router.post('/api/images/push/:id', image.pushImage);
router.post('/api/images/:id/tag', image.tagImage);

/* Network Routes */
router.post('/api/networks', network.createNetwork);
router.get('/api/networks', network.listNetworks);
router.get('/api/networks/:id', network.listSpecificNetwork);
router.delete('/api/networks/:id', network.removeNetwork);

/* Volume Routes */
router.post('/api/volumes', volume.createVolume);
router.get('/api/volumes', volume.listVolumes);
router.get('/api/volumes/:id', volume.listSpecificVolume);
router.delete('/api/volumes/:id', volume.removeVolume);


/* Docker System Routes */
router.post('/api/docker/upload', docker.upload);
router.get('/api/docker/info', docker.getInfo);
router.get('/api/docker/events', docker.getEvents);
router.get('/api/docker/logs/:id', docker.getLogs);
router.post('/api/docker/build', docker.build);
router.post('/api/docker/search', docker.search);

module.exports = router;
