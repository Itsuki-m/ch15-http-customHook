// firebaseのURL変える時はNewTask.jsも忘れずに
// App.jsではfirebaseから受け取るコード
// NewTask.jsはfirebaseにユーザ入力をstoreする
import React, { useEffect, useState, useCallback } from 'react';

import Tasks from './components/Tasks/Tasks';
import NewTask from './components/NewTask/NewTask';
import useHttp from './hooks/use-http';

function App() {
  const [tasks, setTasks] = useState([]);

  // use-http.jsのapplyDataの部分
  // custom hookプラスこのApp.js特有のdata specific部分を書いている
  const transformTasks = useCallback((tasksObj) => {
    const loadedTasks = [];

    for (const taskKey in tasksObj) {
      loadedTasks.push({ id: taskKey, text: tasksObj[taskKey].text });
    }

    setTasks(loadedTasks);
  }, []);

  // use-http.js(custom hook)利用する

  const { isLoading, error, sendRequest: fetchTasks } = useHttp(transformTasks);

  useEffect(() => {
    fetchTasks({
      url: 'https://react-hooks-sc15-default-rtdb.asia-southeast1.firebasedatabase.app/tasks.json',
    });
  }, [fetchTasks]);

  const taskAddHandler = (task) => {
    setTasks((prevTasks) => prevTasks.concat(task));
  };

  return (
    <React.Fragment>
      <NewTask onAddTask={taskAddHandler} />
      <Tasks
        items={tasks}
        loading={isLoading}
        error={error}
        onFetch={fetchTasks}
      />
    </React.Fragment>
  );
}

export default App;
