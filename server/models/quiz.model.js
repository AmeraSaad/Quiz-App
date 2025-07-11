const mongoose = require("mongoose");
const Joi = require("joi");
const { questionSchema, validateQuestion } = require("./question.model");

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    questions: [questionSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

function validateQuiz(obj) {
  const schema = Joi.object({
    title: Joi.string().trim().required(),
    description: Joi.string().trim().allow(""),
    duration: Joi.number().min(1).required(),
    questions: Joi.array().items(Joi.custom((value, helpers) => {
      const { error } = validateQuestion(value);
      if (error) return helpers.error("any.invalid");
      return value;
    })).min(1).required(),
    createdBy: Joi.any(), // usually set from req.user, not required in client payload
  });
  return schema.validate(obj);
}

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = { Quiz, validateQuiz }; 