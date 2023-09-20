import React, { useState } from 'react';
import './style.css';

const Admin = () => {
  const [topics, setTopics] = useState([]);
  const [currentTopic, setCurrentTopic] = useState('');
  const [currentThread, setCurrentThread] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedThread, setSelectedThread] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  const createTopic = () => {
    if (currentTopic !== '') {
      setTopics([...topics, { name: currentTopic, threads: [] }]);
      setCurrentTopic('');
    }
  };

  const deleteTopic = (topicIndex) => {
    const updatedTopics = topics.filter((_, index) => index !== topicIndex);
    setTopics(updatedTopics);
    setSelectedTopic(null); // Reset selected topic
  };

  const createThread = (topicIndex) => {
    if (currentThread !== '') {
      const updatedTopics = [...topics];
      updatedTopics[topicIndex].threads.push({
        text: currentThread,
        images: [],
        date: new Date(),
        messages: [],
      });
      setTopics(updatedTopics);
      setCurrentThread('');
    }
  };

  const deleteThread = (topicIndex, threadIndex) => {
    const updatedTopics = [...topics];
    updatedTopics[topicIndex].threads.splice(threadIndex, 1);
    setTopics(updatedTopics);
    setSelectedThread(null); // Reset selected thread
  };

  const createMessage = (topicIndex, threadIndex) => {
    if (currentMessage !== '') {
      const updatedTopics = [...topics];
      updatedTopics[topicIndex].threads[threadIndex].messages.push({
        date: new Date(),
        content: currentMessage,
      });
      setTopics(updatedTopics);
      setCurrentMessage('');
    }
  };

  const deleteMessage = (topicIndex, threadIndex, messageIndex) => {
    const updatedTopics = [...topics];
    updatedTopics[topicIndex].threads[threadIndex].messages.splice(messageIndex, 1);
    setTopics(updatedTopics);
  };

  const filteredTopics = topics.filter(topic =>
    topic.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="center-container">
      <div className="center-content">
        <div>
          <h1>Forum Home</h1>
          <div>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search Topics"
            />
          </div>
          <div>
            <h2>Create Topic</h2>
            <input
              type="text"
              value={currentTopic}
              onChange={(e) => setCurrentTopic(e.target.value)}
            />
            <button className="btn btn-outline-success" onClick={createTopic}>Create</button>
          </div>
          <div>
            <h2>Topics</h2>
            {filteredTopics.map((topic, topicIndex) => (
              <div key={topicIndex} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
                <h3 onClick={() => setSelectedTopic(topicIndex)} style={{ cursor: 'pointer' }}>{topic.name}</h3>
                <button className="btn btn-outline-danger" onClick={() => deleteTopic(topicIndex)}>Delete</button>
                {selectedTopic === topicIndex && (
                  <div>
                    <h4>Create Thread</h4>
                    <input
                      type="text"
                      value={currentThread}
                      onChange={(e) => setCurrentThread(e.target.value)}
                    />
                    <button className="btn btn-outline-success" onClick={() => createThread(topicIndex)}>Create</button>
                    {topic.threads.map((thread, threadIndex) => (
                      <div key={threadIndex} style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
                        <p>{thread.text}</p>
                        <p>Date: {thread.date.toString()}</p>
                        <div>
                          <h5 onClick={() => setSelectedThread({ topicIndex, threadIndex })} style={{ cursor: 'pointer' }}>View Messages</h5>
                          <button className="btn btn-outline-danger" onClick={() => deleteThread(topicIndex, threadIndex)}>Delete Thread</button>
                          {selectedThread && selectedThread.topicIndex === topicIndex && selectedThread.threadIndex === threadIndex && (
                            <div>
                              <input
                                type="text"
                                value={currentMessage}
                                onChange={(e) => setCurrentMessage(e.target.value)}
                              />
                              <button className="btn btn-outline-success" onClick={() => createMessage(topicIndex, threadIndex)}>Add Message</button>
                              {thread.messages.map((message, messageIndex) => (
                                <div key={messageIndex} style={{ border: '1px solid lightgray', margin: '10px', padding: '10px' }}>
                                  <p>Date: {message.date.toString()}</p>
                                  <p>{message.content}</p>
                                  <button className="btn btn-outline-danger" onClick={() => deleteMessage(topicIndex, threadIndex, messageIndex)}>Delete Message</button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
