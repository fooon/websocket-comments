import React, { useEffect, useState, useRef } from 'react';
import cx from "classnames";
import TextareaAutosize from "react-autosize-textarea";

import sendIcon from "../misc/send.svg";
import st from "../index.module.less";

const InputComment = ({
                        value,
                        placeholder,
                        className,
                        style,
                        forwardedRef,
                        isChanged,
                        changedGuid,

                        cancelAnswer,
                        setHighlightGuid,
                        setValue,
                        sendComment,
                      }) => {
  // const ref = useRef();

  return (
    <div
      className={cx(st.answer, className)}
      onKeyDown={ev => ev.keyCode === 13 && sendComment()}
      onClick={() => forwardedRef.current.focus()}
      style={style}
    >
      <div>
        <TextareaAutosize
          className={st.inputComment}
          // defaultValue={value}
          value={value}
          style={{ resize: "none" }}
          ref={forwardedRef}
          onChange={ev => setValue(ev.target.value)}
          placeholder={placeholder}
        />
      </div>
      <div
        className={st.buttons}
      >
        <div
          className={st.cancelButton}
          onClick={(ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            cancelAnswer();
          }}
        >
          Отменить
        </div>
        <div
          className={st.answerButton}
          onClick={(ev) => {
            ev.preventDefault();
            ev.stopPropagation()
            sendComment()
          }}
        >
          Ответить
        </div>
      </div>
    </div>
  )
}

export default InputComment;
