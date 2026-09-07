import React from "react";

const MessagesDB = () => {
  const messages = [
    { id: 1, user: "John", message: "Inquiry about product A" },
    { id: 2, user: "Jane", message: "Request for refund" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <ul className="space-y-2">
        {messages.map((m) => (
          <li key={m.id} className="bg-white p-4 rounded shadow">
            <p className="font-semibold">{m.user}</p>
            <p>{m.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessagesDB;
