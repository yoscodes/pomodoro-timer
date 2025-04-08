const MIN_IN_MILLIS = 60 * 1000;

// Redux ストアの初期状態
const initialState = {
  timer: {
    remainingTime: 25 * MIN_IN_MILLIS, // 残り時間
    isWorking: true, // 作業中
    count: 0, // 作業回数
    startedAt: null,
  },
  setting: {
    workTime: 25, // 作業時間設定（分）
    breakTime: 5, // 休憩時間設定（分）
  },
  form: null, // ユーザーの編集
};

const updateTimer = (state, updatedFields) => ({
  ...state,
  timer: {
    ...state.timer,
    ...updatedFields,
  },
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "START": {
      if (state.timer.startedAt) return state; // タイマーが既に開始されている場合は何もしない

      const isWorking =
        state.timer.remainingTime === 0
          ? !state.timer.isWorking
          : state.timer.isWorking;
      const remainingTime =
        state.timer.remainingTime === 0
          ? (isWorking ? state.setting.workTime : state.setting.breakTime) *
            MIN_IN_MILLIS
          : state.timer.remainingTime;

      return updateTimer(state, {
        startedAt: action.startedAt,
        isWorking,
        remainingTime,
      });
    }

    case "STOP": {
      if (!state.timer.startedAt) return state; // タイマーが開始されていない場合は何もしない

      const elapsedTime = new Date().getTime() - state.timer.startedAt;
      return updateTimer(state, {
        remainingTime: state.timer.remainingTime - elapsedTime,
        startedAt: null,
      });
    }

    case "FINISH": {
      return updateTimer(state, {
        remainingTime: 0,
        startedAt: null,
        isWorking: state.timer.isWorking,
      });
    }

    case "SET_COUNT": {
      return updateTimer(state, {
        count: action.count,
      });
    }

    case "EDIT": {
      return {
        ...state,
        form: { ...state.setting }, // 作業時間、休憩時間をフォームに反映
      };
    }

    case "SAVE": {
      if (!state.form) return state; // formが存在しない場合は何もしない

      const workTime = Number.parseInt(state.form.workTime, 10);
      const breakTime = Number.parseInt(state.form.breakTime, 10);

      // NaNチェックを追加
      if (isNaN(workTime) || isNaN(breakTime)) {
        return state; // 数値に変換できない場合は変更を適用しない
      }

      return {
        ...state,
        timer: {
          ...state.timer,
          startedAt: null,
          isWorking: true,
          remainingTime: workTime * MIN_IN_MILLIS,
        },
        setting: {
          ...state.setting,
          workTime,
          breakTime,
        },
        form: null,
      };
    }

    case "CANCEL": {
      return {
        ...state,
        form: null, // 編集キャンセル
      };
    }

    case "UPDATE_FORM": {
      if (!state.form) return state; // formが存在しない場合は何もしない

      return {
        ...state,
        form: {
          ...state.form,
          [action.key]: action.value, // 更新するキーを動的に指定
        },
      };
    }

    default:
      return state;
  }
};

export default reducer;
