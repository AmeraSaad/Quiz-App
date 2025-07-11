const mongoose = require("mongoose");
const Joi = require("joi");

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  answer: {
    type: mongoose.Schema.Types.Mixed, // string, boolean, etc.
    required: true,
  },
});

const submissionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answers: [answerSchema],
    score: {
      type: Number,
      required: true,
    },
    timeTaken: {
      type: Number, // in seconds
      required: true,
    },
  },
  { timestamps: true }
);

function validateSubmission(obj) {
  const schema = Joi.object({
    quizId: Joi.string().required(),
    studentId: Joi.string().required(),
    answers: Joi.array()
      .items(
        Joi.object({
          questionId: Joi.string().required(),
          answer: Joi.any().required(),
        })
      )
      .required(),
    // score is not required from client
    timeTaken: Joi.number().required(),
  });
  return schema.validate(obj);
}

const Submission = mongoose.model("Submission", submissionSchema);

module.exports = { Submission, validateSubmission }; 