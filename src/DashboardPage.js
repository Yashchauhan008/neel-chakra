import { useState } from "react";
import questions from "../src/data/question";
export default function Dashboard() {
  const [selectedTopic, setSelectedTopic] = useState("oop");

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Topics</h2>
        <ul>
          {Object.keys(questions).map((topic) => (
            <li
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`cursor-pointer p-2 rounded-lg mb-2 transition-all duration-300 
                ${selectedTopic === topic ? "bg-purple-600" : "hover:bg-gray-700"}`}
            >
              {topic.toUpperCase()}
            </li>
          ))}
        </ul>
      </div>

      {/* Content */}
      <div className="w-full md:w-3/4 p-6 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">{selectedTopic.toUpperCase()} Questions</h2>
        {questions[selectedTopic] && questions[selectedTopic].length > 0 ? (
          questions[selectedTopic].map((q, i) => (
            <div
              key={i}
              className="mb-4 p-4 border rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <h3 className="font-semibold text-lg">{q.question}</h3>
              <p className="text-gray-700 mt-2">{q.answer}</p>
            </div>
          ))
        ) : (
          <p>No questions available for this topic.</p>
        )}
      </div>
    </div>
  );
}
