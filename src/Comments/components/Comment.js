import React, { useEffect, useState } from 'react'
import cx from "classnames";
import moment from "moment";

import dotsIcon from "../misc/dots.svg";
import pencilIcon from "../misc/pencil.svg";
import trashIcon from "../misc/trash.svg";
import adminLogo from "styles/assets/adminLogo.svg";
import st from "../index.module.less";

const Comment = ({
                   comment,
                   isAdmin,
                   isHighlight,
                   isShowBottomMenu,
                   className,
                   forwardedRef,
                   withoutAnswer,
                   withButtons,

                   onAnswer,
                   changeBottomMenu,
                   onDeleteComment,
                   onChangeComment,
                   setHighlightGuid,
                 }) => {
  const { userPhotoLink = '', userName, content, date, commentGuid, answerData, parentCommentGuid } = comment

  return (
    <div className={cx(st.comment, 'parentComment', className, isHighlight && st.highlight)}>
      <div className={st.header}>
        <div className={st.left}>
          {parentCommentGuid ?
            <img src={adminLogo} alt=""/> :
            <img src={userPhotoLink} alt=""/>
          }
        </div>
        <div className={st.right}>
          <div className={cx(st.name, parentCommentGuid && st.admin)}>
            {parentCommentGuid ? "Admin" : userName}
          </div>
          <div className={st.date}>
            {moment(date).format('HH:MM DD.MM.YYYY')}
          </div>
        </div>
      </div>
      <div className={st.content}>
        {answerData &&
          <span
            className={st.answerUserName}
            onClick={() => setHighlightGuid(answerData.commentGuid)}
          >
            {`${answerData.userName}, `}
          </span>
        }
        {content}
      </div>
      <div className={st.bottom}>
        {(isAdmin && !withoutAnswer) &&
          <span
            className={st.adminAnswer}
            onClick={() => onAnswer(commentGuid)}
          >
            Ответить
          </span>
        }
        {withButtons &&
          <div className={st.bottomMenu}>
            <img
              alt=""
              src={dotsIcon}
              onClick={() => changeBottomMenu(commentGuid)}
            />
            {isShowBottomMenu &&
              <div ref={forwardedRef} className={st.bottomButtons}>
                <div onClick={(ev) => onChangeComment(commentGuid, ev)}>
                  <img src={pencilIcon} alt="" />
                  Редактировать
                </div>
                <div onClick={() => onDeleteComment(commentGuid)}>
                  <img src={trashIcon} alt="" />
                  Удалить
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  )
}

export default Comment
