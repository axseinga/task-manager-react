import React from "react";
import "regenerator-runtime";
import "whatwg-fetch";

class TasksManager extends React.Component {
    state = {
        task: "",
        tasks: [],
    };

    // handlers

    onClick = () => {
        const { tasks } = this.state;
        console.log(tasks);
    };

    handleChange = (e) => {
        this.setState({ task: e.target.value });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.addItem(this.state.task);
        this.setState({ task: "" });
    };

    handleToggle = (id) => {
        this.state.tasks.forEach((item) => {
            if (item.id === id && item.isRunning === false) {
                this.timer = setInterval(() => {
                    item.isRunning = true;
                    this.incrementTime(item.id);
                }, 1000);
            } else if (item.id === id && item.isRunning === true) {
                item.isRunning = !item.isRunning;
                clearInterval(this.timer);
                this.updateAPI(item);
            }
        });
    };

    handleFinish = (id) => {
        this.state.tasks.forEach((item) => {
            if (item.id === id) {
                this.setState((state) => {
                    const newTasks = state.tasks.map((task) => {
                        if (task.id === id) {
                            clearInterval(this.timer);
                            return { ...task, isDone: true, isRunning: false };
                        } else {
                            return task;
                        }
                    });

                    return {
                        tasks: newTasks,
                    };
                });
            } else return;
        });
    };

    handleDelete = (id) => {
        this.state.tasks.forEach((item) => {
            if (item.id === id) {
                this.setState((state) => {
                    const newTasks = state.tasks.map((task) => {
                        if (task.id === id) {
                            return { ...task, isRemoved: true };
                        } else return task;
                    });

                    return { tasks: newTasks };
                });
            }
        });
    };

    // API

    addToAPI(item) {
        const options = {
            method: "POST",
            body: JSON.stringify(item),
            headers: { "Content-Type": "application/json" },
        };
        const url = "http://localhost:3005/data";

        const promise = fetch(url, options);

        promise
            .then((resp) => {
                if (resp.ok) {
                    return resp.json();
                }
                return Promise.reject(resp);
            })
            .then((data) => {
                const newItem = data;
                this.setState((state) => {
                    return {
                        tasks: [...state.tasks, newItem],
                    };
                });
            })
            .catch((err) => console.log(err));
    }

    updateAPI(task) {
        const options = {
            method: "PUT",
            body: JSON.stringify(task),
            headers: { "Content-Type": "application/json" },
        };

        const url = `http://localhost:3005/data/${task.id}`;

        const promise = fetch(url, options);

        promise
            .then((resp) => {
                if (resp.ok) {
                    return resp.json();
                }
                return Promise.reject(resp);
            })
            .catch((err) => console.error(err));
    }

    addItem = (task) => {
        const item = {
            name: task,
            time: 0,
            isRunning: false,
            isDone: false,
            isRemoved: false,
        };
        this.addToAPI(item);
    };

    incrementTime = (id) => {
        this.setState((state) => {
            const newTasks = state.tasks.map((task) => {
                if (task.id === id) {
                    return { ...task, time: task.time + 1 };
                } else {
                    return task;
                }
            });

            return {
                tasks: newTasks,
            };
        });
    };

    formatTime = (time) => {
        let hrs = Math.floor(time / 3600);
        let mins = Math.floor((time % 3600) / 60);
        let secs = Math.floor(time % 60);

        let ret = "";

        ret += "" + (hrs < 10 ? "0" : "");
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    };

    render() {
        return (
            <div>
                <h1 onClick={this.onClick}>TasksManager</h1>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="task">Zadanie:</label>
                    <input
                        name="task"
                        value={this.state.task}
                        onChange={this.handleChange}
                    ></input>
                    <button>Dodaj zadanie</button>
                </form>
                {this.state.tasks.map((item) => {
                    if (item.isRemoved === false) {
                        return (
                            <section key={item.id}>
                                <header>
                                    Zadanie 1, {this.formatTime(item.time)}
                                </header>
                                <footer>
                                    <button
                                        disabled={
                                            item.isDone === true ? true : false
                                        }
                                        onClick={() =>
                                            this.handleToggle(item.id)
                                        }
                                    >
                                        start/stop
                                    </button>
                                    <button
                                        disabled={
                                            item.isDone === true ? true : false
                                        }
                                        onClick={() =>
                                            this.handleFinish(item.id)
                                        }
                                    >
                                        zakończone
                                    </button>
                                    <button
                                        disabled={
                                            item.isDone === true ? false : true
                                        }
                                        onClick={() =>
                                            this.handleDelete(item.id)
                                        }
                                    >
                                        usuń
                                    </button>
                                </footer>
                            </section>
                        );
                    }
                })}
            </div>
        );
    }
}

export default TasksManager;
