const Post = require('./../models/Post');
const User = require('./../models/User');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.addPost = catchAsync(async (req, res, next) => {
  const user = User.findById(req.user.id).select('-password');
  const post = await Post.create({
    text: req.body.text,
    name: user.name,
    avatar: user.avatar,
    user: req.user.id,
  });
  res.status(201).json({
    status: 'success',
    data: post,
  });
});

exports.getPosts = catchAsync(async (req, res, next) => {
  const posts = await Posts.find().sort({ date: -1 });

  res.status(200).json({
    status: 'success',
    data: posts,
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Posts.findById(req.params.id);
  if (!post) return next(new AppError('No post found with that id', 404));
  res.status(200).json({
    status: 'success',
    data: post,
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const post = await Posts.findById(req.params.id);
  if (!post) return next(new AppError('No post found with that id', 404));

  if (post.user.id.toString() !== req.user.id)
    return next(new AppError('user is not authorized', 401));

  await post.remove();
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.likeUnlikePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new AppError('No post found with that id', 400));
  if (
    post.likes.fliter((like) => like.user.toString() === req.user.id).length > 0
  ) {
    removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);
    return res.status(204).json({
      status: 'success',
      data: null,
    });
  }

  post.likes.unshift({ user: req.user.id });

  await post.save();

  res.status(201).json({
    status: 'success',
    data: post.likes,
  });
});

exports.addComment = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  const user = await User.findById(req.user.id);
  const newComment = {
    user: req.user.id,
    text: req.body.text,
    name: user.name,
    avatar: user.avatar,
  };
  post.comments.unshift(newComment);
  await post.save();

  res.status(200).json({
    status: 'success',
    data: {
      data: profile,
    },
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  const comment = post.comments.find(
    (comment) => comment.id === req.params.commentId
  );

  if (!commemt) return next(new AppError('No comment with that id', 400));
  if (comment.user.toString() !== req.user.id)
    return next(new AppError('unauthorized user', 401));

  const removeIndex = post.comments
    .map((comment) => comment.user.toString())
    .indexOf(req.user.id);

  post.comments.splice(removeIndex, 1);
  await post.save();

  res.status(200).json({
    status: 'success',
    data: {
      data: post.comments,
    },
  });
});
