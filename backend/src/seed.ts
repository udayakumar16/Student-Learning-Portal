import { connectDb } from "./config/db.js";
import { QuestionModel } from "./models/Question.js";

async function seed() {
  await connectDb();

  await QuestionModel.deleteMany({});

  await QuestionModel.insertMany([
    // Python (5)
    {
      subject: "Python",
      question: "Which keyword is used to define a function in Python?",
      options: ["func", "def", "function", "define"],
      correctOption: 1
    },
    {
      subject: "Python",
      question: "What is the output type of input() in Python 3?",
      options: ["int", "float", "str", "bool"],
      correctOption: 2
    },
    {
      subject: "Python",
      question: "Which data structure is immutable?",
      options: ["list", "dict", "set", "tuple"],
      correctOption: 3
    },
    {
      subject: "Python",
      question: "What does PEP 8 describe?",
      options: ["Packaging", "Style guide", "Concurrency", "Testing"],
      correctOption: 1
    },
    {
      subject: "Python",
      question: "Which operator is used for floor division?",
      options: ["/", "//", "%", "**"],
      correctOption: 1
    },

    // AI (5)
    {
      subject: "Artificial Intelligence",
      question: "Which search algorithm uses a heuristic function?",
      options: ["BFS", "DFS", "A*", "Linear search"],
      correctOption: 2
    },
    {
      subject: "Artificial Intelligence",
      question: "In machine learning, overfitting means:",
      options: [
        "Model performs well on unseen data",
        "Model learns noise and performs poorly on unseen data",
        "Model cannot learn patterns",
        "Model has too little capacity"
      ],
      correctOption: 1
    },
    {
      subject: "Artificial Intelligence",
      question: "A perceptron is mainly used for:",
      options: ["Clustering", "Linear classification", "Sorting", "Compression"],
      correctOption: 1
    },
    {
      subject: "Artificial Intelligence",
      question: "Which is a common evaluation metric for classification?",
      options: ["MSE", "Accuracy", "Silhouette score", "RMSE only"],
      correctOption: 1
    },
    {
      subject: "Artificial Intelligence",
      question: "A confusion matrix is used to:",
      options: [
        "Visualize regression residuals",
        "Summarize classification performance",
        "Reduce dimensionality",
        "Store training data"
      ],
      correctOption: 1
    },

    // DBMS (5)
    {
      subject: "DBMS",
      question: "Which SQL clause is used to filter rows?",
      options: ["WHERE", "GROUP BY", "ORDER BY", "HAVING"],
      correctOption: 0
    },
    {
      subject: "DBMS",
      question: "A primary key is:",
      options: [
        "A key that can be NULL",
        "A unique identifier for a row",
        "A foreign key in another table",
        "An index only"
      ],
      correctOption: 1
    },
    {
      subject: "DBMS",
      question: "Normalization primarily reduces:",
      options: ["Redundancy", "Security", "Latency", "Indexing"],
      correctOption: 0
    },
    {
      subject: "DBMS",
      question: "Which normal form removes partial dependency?",
      options: ["1NF", "2NF", "3NF", "BCNF"],
      correctOption: 1
    },
    {
      subject: "DBMS",
      question: "Which join returns only matching rows?",
      options: ["LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN", "INNER JOIN"],
      correctOption: 3
    }
  ]);

  console.log("Seeded questions successfully.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
