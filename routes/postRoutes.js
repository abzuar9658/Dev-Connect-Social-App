const express = require('express');
const postController = require('./../controllers/postController');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router.route('/').get(postController.getPosts).post(postController.addPost);

router
  .route('/:id')
  .get(postController.getPost)
  .delete(postController.deletePost);

router.route('/like/:id').patch(postController.likeUnlikePost);
router.route('/comment/:id').patch(postController.addComment);
router.route('/:id/comment/:commentId').delete(postController.deleteComment);
module.exports = router;
