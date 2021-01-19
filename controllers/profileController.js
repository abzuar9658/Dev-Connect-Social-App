const request = require('request');
const Profile = require('./../models/Profile');
const User = require('./../models/User');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllProfiles = catchAsync(async (req, res, next) => {
  const profiles = await Profile.find().populate('User', ['name', 'avatar']);

  res.status(200).json({
    status: 'success',
    data: profiles,
  });
});

exports.getProfile = catchAsync(async (req, res, next) => {
  let query = Profile.find({ user: req.params.id }).populate('User', [
    'name',
    'avatar',
  ]);
  const profile = await query;

  if (!profile) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: profile,
    },
  });
});

exports.createProfile = catchAsync(async (req, res, next) => {
  if (req.body.skills) {
    let skills = [];
    skills = req.body.skills.trim().split(',');
    req.body.skilss = skills;
  }
  const doc = await Profile.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  if (req.body.skills) {
    let skills = [];
    skills = req.body.skills.split(',').trim();
    req.body.skills = skills;
  }

  const doc = await Profile.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.deleteProfile = catchAsync(async (req, res, next) => {
  const doc = await Profle.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.addEducation = catchAsync(async (req, res, next) => {
  const profile = await Profile.findById(req.params.id);
  profile.education.unshift(req.body);
  await profile.save();

  res.status(200).json({
    status: 'success',
    data: {
      data: profile,
    },
  });
});

exports.deleteEducation = catchAsync(async (req, res, next) => {
  const profile = await Profile.findById(req.params.id);
  const removeIndex = profile.education
    .map((item) => item.id)
    .indexOf(req.params.eduId);
  profile.education.splice(removeIndex, 1);
  await profile.save();

  res.status(200).json({
    status: 'success',
    data: {
      data: profile,
    },
  });
});

exports.addExperience = catchAsync(async (req, res, next) => {
  const profile = await Profile.findById(req.params.id);
  profile.experience.unshift(req.body);
  await profile.save();

  res.status(200).json({
    status: 'success',
    data: {
      data: profile,
    },
  });
});

exports.deleteExperience = catchAsync(async (req, res, next) => {
  const profile = await Profile.findById(req.params.id);
  const removeIndex = profile.experience
    .map((item) => item.id)
    .indexOf(req.params.expId);
  profile.experience.splice(removeIndex, 1);
  await profile.save();

  res.status(200).json({
    status: 'success',
    data: {
      data: profile,
    },
  });
});

exports.setGithubRepo = catchAsync(async (req, res, next) => {
  const options = {
    uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}`,
    method: 'get',
    headers: { 'user-agent': 'node.js' },
  };

  request(options, (error, response, body) => {
    if (response.statusCode !== 200)
      return next(new AppError('No Github profile found', 404));
    res.json(JSON.parse(body));
  });
});
