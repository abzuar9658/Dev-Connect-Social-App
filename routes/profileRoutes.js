const express = require('express');
const profileController = require('./../controllers/profileController');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/').get(profileController.getAllProfiles);

router.route(':/id').get(profileController.getProfile);

// Protect all routes after this middleware
router.use(authController.protect);

router.route('/me').get(userController.getMe, profileController.getProfile);

router
  .route('/')
  .post(userController.getMe, profileController.createProfile)
  .patch(userController.getMe, profileController.updateProfile)
  .delete(userController.getMe, profileController.deleteProfile);

router
  .route('/education')
  .patch(userController.getMe, profileController.addEducation);

router
  .route('/education/:eduId')
  .delete(userController.getMe, profileController.deleteEducation);

router
  .route('/experience')
  .patch(userController.getMe, profileController.addExperience);

router
  .route('/experience/:expId')
  .delete(userController.getMe, profileController.deleteExperience);

router
  .route('/github/:username')
  .patch(userController.getMe, profileController.setGithubRepo);

module.exports = router;
