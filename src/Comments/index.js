import React, { useEffect, useState, useRef, Fragment, useReducer } from 'react'
import { bindActionCreators } from "redux";
import { commentsActions } from "store/modules/comments";
import { countersActions } from "store/modules/counters";
import { connect } from "react-redux";
import moment from 'moment'
import ps from 'utils/ps'
import reverse from 'lodash/reverse'
import cx from 'classnames'
import useOnClickOutside from 'use-onclickoutside'
import { counters as countersStatuses, roles } from 'constants/index'

import InputComment from "./InputComment";
import Comment from './Comment'

import sendIcon from './misc/send.svg'
import dotsIcon from './misc/dots.svg'
import chevronIcon from './misc/chevron.svg'
import pencilIcon from './misc/pencil.svg'
import trashIcon from './misc/trash.svg'
import st from './index.module.less'

function useMenu(){
  const [ bottomMenu, changeBottomMenu ] = useState(false)

  return [ bottomMenu, changeBottomMenu ]
}

const PAGINATION_LENGTH = 5

const Comments = ({
  courseId,
  taskId,
  user,
  actions,
  isAdmin,
  comments,
  commentsRenderData = [],
  dataAnswerRender = [],
  className = '',
  userId,
  counter
}) => {
  const { data = [] } = comments
  const { getComments, sendComments, changeComment, deleteComment, resetCounters2 } = actions

  const [ value, setValue ] = useState('')
  const [ valueAnswerComment, setValueAnswerComment ] = useState('')
  const [ pagination, setPagination ] = useState(PAGINATION_LENGTH)
  const [ showCommentMenu, setShowCommentMenu ] = useState(true)
  const [ highlightGuid, setHighlightGuid ] = useState();
  const [ bottomMenu, changeBottomMenu ] = useMenu()
  const answerInputRef = useRef()
  const bottomMenuRef = useRef()
  const answerOnMessageRef = useRef()

  useOnClickOutside(bottomMenuRef, () => changeBottomMenu(false))

  const [ commentChanged, setCommentChanged ] = useState({
    changed: false,
    guid: null,
    elem: null
  })

  const [ answerForm, setAnswerForm ] = useState({
    show: false,
    guid: null
  })

  useEffect(() => {
    getComments(courseId, taskId)
    setShowCommentMenu(false)
    window.scrollTo(0, 0)
  }, [courseId, taskId])

  useEffect(() => {
    window.commentsClient.addListener('message', actions.newCommentWs);
    window.commentsClient.addListener('update', actions.changeCommentWs);
    window.commentsClient.addListener('delete', actions.deleteCommentWs);

    return () => {
      window.commentsClient.removeListener('message', actions.newCommentWs);
      window.commentsClient.removeListener('update', actions.changeCommentWs);
      window.commentsClient.removeListener('delete', actions.deleteCommentWs);
    }
  }, [])

  useEffect(() => {
    showCommentMenu && resetCounters2({
      courseId,
      taskId,
      type: countersStatuses.comments
    })
  }, [dataAnswerRender])

  useEffect(() => {
    if(highlightGuid){
      setTimeout(() => setHighlightGuid(''), 5000)
    }
  }, [highlightGuid])

  const onDeleteComment = (commentGuid) => {
    deleteComment(commentGuid)
    setCommentChanged({ changed: false, guid: null })
    setValue('')
    changeBottomMenu(false)
  }

  const onChangeComment = (commentGuid, ev) => {
    const comment = data.find(item => item.commentGuid === commentGuid)
    setCommentChanged({ changed: true, guid: comment.commentGuid, elem: ev.target.closest('.parentComment') })
    setValue(comment.content)
    changeBottomMenu(false)

    answerInputRef.current.scrollIntoView(true)
    answerInputRef.current.focus()
  }

  const onAnswer = (guid) => {
    setAnswerForm({ show: true, guid })
  }

  const cancelAnswer = () => {
    setValue('');
    changeBottomMenu(false)
    answerForm.show && setValueAnswerComment('')
    setAnswerForm({ show: false, guid: null })
  }

  const onSendComment = () => {
    const data = {
      courseId,
      taskId,
      userId,
      content: value,
      userPhotoLink: user.photoLink
    }

    if (answerForm.show) {
      data.parentCommentGuid = answerForm.guid
      data.content = valueAnswerComment
    }

    if(commentChanged.changed){
      data.commentGuid = commentChanged.guid
      changeComment(data).then(() => {
        commentChanged.elem.scrollIntoView({ block: "center", behavior: "smooth" })
        setHighlightGuid(commentChanged.guid)
        setValue('');
        changeBottomMenu(false)
        setCommentChanged({ changed: false, guid: null })
        setAnswerForm({ show: false, guid: null })
        answerForm.show && setValueAnswerComment('')
      })
    }else{
      sendComments(data).then(() => {
        setValue('');
        changeBottomMenu(false)
        answerForm.show && setValueAnswerComment('')
        setAnswerForm({ show: false, guid: null })
        answerInputRef.current.scrollIntoView(true)
      })
    }
  }

  const commentProps = (comment) => ({
    isAdmin,
    comment,
    onDeleteComment,
    onChangeComment,
    onAnswer,
    withButtons: comment.userId === userId,
    withoutAnswer: comment.answerData,
    isHighlight: highlightGuid == comment.commentGuid,
    isShowBottomMenu: bottomMenu == comment.commentGuid,
    setHighlightGuid,
    changeBottomMenu,
    forwardedRef: bottomMenuRef
  })

  console.log(dataAnswerRender, 'dataAnswerRender')

  return (
    <div className={cx(st.comments, className)}>
      <div
        className={cx(st.title, showCommentMenu && st.visible)}
        onClick={() => {
          setShowCommentMenu(!showCommentMenu)
          resetCounters2({ courseId, taskId, type: countersStatuses.comments })
        }}
      />
      <Fragment>
        {(dataAnswerRender.length > pagination) &&
          <div
            className={st.pagination}
            onClick={() => setPagination((prevState) => prevState + PAGINATION_LENGTH)}
          >
            Загрузить предыдущие
          </div>
        }
        {reverse(dataAnswerRender.slice(0, pagination)).map((comment, ix) => (
          <div
            key={ix}
          >
            <Comment
              {...commentProps(comment)}
              withButtons={comment.userId === userId}
              withoutAnswer={comment.answerData}
              isHighlight={highlightGuid == comment.commentGuid}
              isShowBottomMenu={bottomMenu == comment.commentGuid}
            />
            {comment.commentGuid === answerForm.guid &&
              <InputComment
                value={valueAnswerComment}
                sendComment={onSendComment}
                setValue={setValueAnswerComment}
                className={st.nextBranch}
                placeholder="Написать ответ..."
                forwardedRef={answerOnMessageRef}
                cancelAnswer={cancelAnswer}
              />
            }
          </div>
        ))}
        <InputComment
          value={value}
          sendComment={onSendComment}
          setHighlightGuid={setHighlightGuid}
          changedGuid={commentChanged.guid}
          forwardedRef={answerInputRef}
          setValue={setValue}
          placeholder="Написать комментарий..."
          isChanged={commentChanged.changed}
          cancelAnswer={cancelAnswer}
          style={{ marginTop: 25 }}
        />
      </Fragment>
    </div>
  )
}

const mapStateToProps = ({ comments, user, counters: { commentsCounters } }) => {
  const dataAnswerRender = comments.dataAnswerRender || []

  return {
    comments,
    dataAnswerRender,
    commentsRenderData: comments.dataRender,
    user,
    userId: user.id,
    isAdmin: user.role === roles.ADMINISTRATOR,
    commentsCounters
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions: {
    ...bindActionCreators(commentsActions, dispatch),
    ...bindActionCreators({
      resetCounters2: countersActions.resetCounters2
    }, dispatch)
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Comments);
