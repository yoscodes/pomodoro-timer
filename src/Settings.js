import React from "react";
import { connect } from "react-redux";
import { stop, edit, updateForm, save, start, cancel } from "./actions";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import SettingsIcon from "@mui/icons-material/Settings";
import { grey } from "@mui/material/colors";

const Setting = ({
  workTime,
  breakTime,
  isEditing,
  onFormValueChange,
  onSave,
  onCancel,
  onEdit,
}) => {
  const handleChange = (key, event) => {
    // 入力を変更する際のイベントハンドラー
    const value = event.target.value;
    onFormValueChange(key, value);
  };

  const selectTarget = (event) => {
    event.target.select(); // テキストフィールドをクリックするとテキストを選択
  };

  return (
    <span style={{ lineHeight: "24px" }}>
      {/* クリックすると、onEditが呼び出され、設定ダイアログを表示 */}
      <SettingsIcon
        onClick={onEdit}
        color={grey[100]}
        style={{
          position: "relative",
          top: "14px",
          margin: "0 6px",
          size: "18px",
        }}
      />
      <Dialog open={isEditing} onClose={onCancel}>
        <DialogTitle>時間設定</DialogTitle>
        <div style={{ padding: "20px" }}>
          {/* 作業時間と休憩時間を設定するための入力フィールド */}
          <TextField
            type="number"
            style={{ marginRight: 12 }}
            value={workTime || ""} // 初期値がnullの場合、空文字列にする
            // ユーザーがフィールドに入力するたびに、handleChange 関数が呼び出される
            onChange={(event) => handleChange("workTime", event)}
            // selectTarget は、ユーザーが TextField をクリックしたときに、入力フィールドの中のテキストを選択状態にするための関数
            onClick={selectTarget}
            label="作業時間(分)"
            fullWidth
          />
          <TextField
            type="number"
            style={{ marginTop: 12 }}
            value={breakTime || ""} // 初期値がnullの場合、空文字列にする
            onChange={(event) => handleChange("breakTime", event)}
            onClick={selectTarget}
            label="休憩時間(分)"
            fullWidth
          />
        </div>
        <div style={{ padding: "10px" }}>
          <Button onClick={onSave} color="primary">
            OK
          </Button>
          <Button onClick={onCancel} color="secondary">
            Cancel
          </Button>
        </div>
      </Dialog>
    </span>
  );
};

// Reduxのstateをコンポーネントのpropsにマッピング
const mapStateToProps = (state) => {
  const isEditing = !!state.form;
  return {
    currentWorkTime: state.setting.workTime,
    currentBreakTime: state.setting.breakTime,
    isEditing,
    // 初期値を空文字列に設定して、ユーザーが変更できるようにする
    workTime: isEditing ? state.form.workTime : "",
    breakTime: isEditing ? state.form.breakTime : "",
  };
};

// Reduxのアクションをコンポーネントのpropsにマッピング
const mapDispatchToProps = (dispatch) => ({
  onEdit: () => {
    dispatch(stop());
    dispatch(edit());
  },
  onSave: () => {
    dispatch(save());
    dispatch(start());
  },
  onCancel: () => {
    dispatch(cancel());
  },
  onFormValueChange: (key, value) => {
    dispatch(updateForm(key, value));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Setting);
