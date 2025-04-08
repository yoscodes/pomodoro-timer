// 状態を更新するためのactionを生成(アクションクリエーター)
// 引数として開始時間を返す
// タイマーを開始するアクションを作成
export const start = (startedAt) => ({
    type: "START",
    startedAt, // 引数を payload に格納
  });
  
  // タイマーを停止するアクションを作成
  export const stop = () => ({
    type: "STOP",
  });
  
  // 作業や処理を終了するアクションを作成
  export const finish = () => ({
    type: "FINISH",
  });
  
  // 作業回数を設定するアクションを作成
  export const setCount = (count) => ({
    type: "SET_COUNT",
    count, // 引数を payload に格納
  });
  
  // 編集可能状態にするアクションを作成
  export const edit = () => ({
    type: "EDIT",
  });
  
  // データを保存するアクションを作成
  export const save = () => ({
    type: "SAVE",
  });
  
  // 操作をキャンセルするアクションを作成
  export const cancel = () => ({
    type: "CANCEL",
  });
  
  // フォームの値を更新するアクションを作成
  export const updateForm = (key, value) => ({
    type: "UPDATE_FORM",
    key,
    value, // 引数を payload に格納
  });
  