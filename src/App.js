// firebaseのURL変える時はNewTask.jsも忘れずに
// App.jsではfirebaseから受け取るコード
// NewTask.jsはfirebaseにユーザ入力をstoreする

// ** useCallbackの代わりにtransformTasksの各場所を変える
import React, { useEffect, useState } from 'react';

import Tasks from './components/Tasks/Tasks';
import NewTask from './components/NewTask/NewTask';
import useHttp from './hooks/use-http';

function App() {
  const [tasks, setTasks] = useState([]);

  // use-http.js(custom hook)利用する
  // 1. useHttp(transformTasks)だったのをuseHttp()にしてuseEffectの第２引数にtransformTasksを入れる
  const { isLoading, error, sendRequest: fetchTasks } = useHttp();

  useEffect(() => {
    // use-http.jsのapplyDataの部分
    // custom hookプラスこのApp.js特有のdata specific部分を書いている
    // 3. useEffectの上に書いていたこの変数transformTasksをuseEffectの中に移す
    const transformTasks = (tasksObj) => {
      const loadedTasks = [];

      for (const taskKey in tasksObj) {
        loadedTasks.push({ id: taskKey, text: tasksObj[taskKey].text });
      }

      setTasks(loadedTasks);
    };
    fetchTasks(
      {
        url: 'https://customhook-http-ch15-99035-default-rtdb.firebaseio.com/tasks.json',
      },
      // 2. transformTasksを第２引数に入れる
      transformTasks
    );
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
