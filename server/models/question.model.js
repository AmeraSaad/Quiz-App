const mongoose = require("mongoose");
const Joi = require("joi");

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["multiple-choice", "true-false", "short-answer"],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  options: [String], // Only for multiple-choice
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed, // String or Array (for future flexibility)
    required: true,
  },
});

function validateQuestion(obj) {
  const schema = Joi.object({
    type: Joi.string().valid("multiple-choice", "true-false", "short-answer").required(),
    text: Joi.string().required(),
    options: Joi.when('type', {
      is: 'multiple-choice',
      then: Joi.array().items(Joi.string()).min(2).required(),
      otherwise: Joi.forbidden()
    }),
    correctAnswer: Joi.alternatives().conditional('type', [
      { is: 'multiple-choice', then: Joi.string().required() },
      { is: 'true-false', then: Joi.string().valid('true', 'false').required() },
      { is: 'short-answer', then: Joi.string().required() },
    ]),
  });
  return schema.validate(obj);
}

const Question = mongoose.model("Question", questionSchema);

module.exports = { Question, questionSchema, validateQuestion }; 