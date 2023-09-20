import React, { useEffect, useState } from "react";
import axios from "axios";
import parse from 'html-react-parser';

function Home() {
  const [topics, setTopics] = useState([]);
  const [threads, setThreads] = useState([]);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    const topicsUrl = "/api/all_topics";
    const threadsUrl = "/api/all_threads";
    const messagesUrl = "/api/all_messages";

    axios
      .get("/api/is_logged_in")
      .then((response) => {
        if (response.data.message === "User is not logged in") {
          window.location.href = "/";
        } else if (response.data.message === "User is logged in") {
          setUser({
            id_user: response.data.id_user,
            admin: response.data.admin,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get(topicsUrl)
      .then((response) => {
        if (response.data.m === "All topics") {
          setTopics(response.data.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get(threadsUrl)
      .then((response) => {
        if (response.data.m === "All threads") {
          setThreads(response.data.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get(messagesUrl)
      .then((response) => {
        if (response.data.m === "All messages") {
          setMessages(response.data.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleLogout = () => {
    axios
      .get("/api/logout")
      .then((response) => {
        if (response.data.message === "Logout done") {
          window.location.href = "/";
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const createTopic = (name) => {
    axios
      .post("/api/create/topic", { name })
      .then((response) => {
        window.location.href = "/home";
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const createThread = (name, id_topic) => {
    axios
      .post("/api/create/thread", { name, id_topic })
      .then((response) => {
        window.location.href = "/home";
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const createMessage = (content, id_thread) => {
    axios
      .post("/api/create/message", { content, id_thread })
      .then((response) => {
        window.location.href = "/home";
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteTopic = (id_topic) => {
    axios
      .delete(`/api/delete/topic/${id_topic}`)
      .then((response) => {
        window.location.href = "/home";
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteThread = (id_thread) => {
    axios
      .delete(`/api/delete/thread/${id_thread}`)
      .then((response) => {
        window.location.href = "/home";
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteMessage = (id_message) => {
    axios
      .delete(`/api/delete/message/${id_message}`)
      .then((response) => {
        window.location.href = "/home";
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="container">
      <h1>Hello to home</h1>
      <a href='/profile'>
        <button className="btn btn-primary">Update my info</button>
      </a>
      <button className="btn btn-warning" onClick={handleLogout}>
        Logout
      </button>

      <div className="container mt-5">
        <div id="topics">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createTopic(e.target.name.value);
            }}
          >
            <div className="input-group mb-3">
              <input type="text" className="form-control" name="name" placeholder="Topic name" />
              <div className="input-group-append">
                <button className="btn btn-primary" type="submit">
                  Create topic
                </button>
              </div>
            </div>
          </form>
          {topics.map((topic) => (
            <div className="container topic" key={topic.id}>
              <h2>{parse(topic.name)}</h2>
              <div className="container">
                <div id="threads">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      createThread(e.target.name.value, topic.id);
                    }}
                  >
                    <div className="input-group mb-3">
                      <input type="text" className="form-control" name="name" placeholder="Thread name" />
                      <div className="input-group-append">
                        <button className="btn btn-primary" type="submit">
                          Create thread
                        </button>
                      </div>
                    </div>
                  </form>
                  {threads.map((thread) =>
                    thread.id_topic === topic.id ? (
                      <div className="container thread" key={thread.id}>
                        <div
                          className="thread-header"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <h3>
                            <strong>{parse(thread.pseudo_user)}:</strong> {parse(thread.name)}
                          </h3>
                          {thread.id_user === user.id_user ||
                          user.admin === 1 ? (
                            <button
                              className="btn btn-danger"
                              onClick={() => deleteThread(thread.id)}
                            >
                              Delete
                            </button>
                          ) : null}
                        </div>
                        <div className="container">
                          <div id="messages">
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                createMessage(
                                  e.target.content.value,
                                  thread.id
                                );
                              }}
                            >
                              <div className="input-group mb-3">
                                <input type="text" className="form-control" name="content" placeholder="Message content" />
                                <div className="input-group-append">
                                  <button className="btn btn-primary" type="submit">
                                    Create message
                                  </button>
                                </div>
                              </div>
                            </form>
                            {messages.map((message) =>
                              message.id_thread === thread.id ? (
                                <div
                                  className="container message"
                                  key={message.id}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                  }}
                                >
                                    <strong>{parse(message.pseudo_user)}:</strong>{" "}
                                    {parse(message.content)}
                                  {message.id_user === user.id_user ||
                                  user.admin === 1 ? (
                                    <button
                                      className="btn btn-danger"
                                      onClick={() => deleteMessage(message.id)}
                                    >
                                      Delete
                                    </button>
                                  ) : null}
                                </div>
                              ) : null
                            )}
                          </div>
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
