import { requestStatuses } from "constants/index";
import { createActions, createReducer } from "realt";
import api from "../services/api";

const createRenderList = (data) => {
  let commentsRenderList = data.slice()

  commentsRenderList = commentsRenderList.map((item) => {
    if(item.parentCommentGuid) {
      commentsRenderList.forEach(i => {
        if(i.commentGuid == item.parentCommentGuid){
          i.childs = item
        }
      })

      return null
    } else{
      return item
    }
  }).filter(item => !!item)

  return commentsRenderList
}

const createByUser = (data) => {
  let commentsRenderList = data.slice()

  commentsRenderList.map(item => {
    if(item.parentCommentGuid){
      item.answerData = commentsRenderList.find(comment => comment.commentGuid == item.parentCommentGuid)
    }
  })

  return commentsRenderList
}

export const commentsActions = createActions({
  getComments(courseId, taskId) {
    return api.get(`comments?courseId=${courseId}&taskId=${taskId}`)
  },

  sendComments(comment, attachmentsGuids = []) {
    return api.post('comments', {...comment, attachments: attachmentsGuids}).then((data) => ({ data, comment}))
  },

  changeComment(comment, attachmentsGuids = []) {
    return api.put('comments', { ...comment, attachments: attachmentsGuids }).then(data => ({ data, comment }))
  },

  deleteComment(commentGuid){
    return api.delete('comments', { data: { commentGuid } }).then(() => ({ commentGuid }))
  },

  newCommentWs(comment){
    return comment
  },

  deleteCommentWs(comment){
    return comment
  },

  changeCommentWs(comment){
    return comment
  }
});

class CommentsReducer {
  constructor() {
    this.bindAction(commentsActions.getComments, this.handleGetComments)

    this.bindAction(commentsActions.newCommentWs, this.handleGetCommentWs)
    this.bindAction(commentsActions.deleteCommentWs, this.handleDeleteCommentWs)
    this.bindAction(commentsActions.changeCommentWs, this.handleChangeCommentWs)
  }

  get initialState() {
    return {
      data: [],
      totalCount: 0
    }
  }

  handleGetComments(state, result) {
    if (result.status === requestStatuses.SUCCESS) {
      const { data: { data, totalCount } } = result.payload;

      return {
        ...state,
        data,
        dataRender: createRenderList(data),
        dataAnswerRender: createByUser(data),
        totalCount
      }
    }

    return state
  }

  handleSendComments(state, result) {
    const { status, loading } = result;

    if (status === requestStatuses.SUCCESS) {
      const { data: { data: commentGuid }, comment } = result.payload;
      const data = [{...comment, commentGuid}, ...state.data]

      return {
        ...state,
        data,
        dataRender: createRenderList(data),
        dataAnswerRender: createByUser(data),
        status,
        loading
      }
    }

    return state
  }

  handleChangeComment(state, result) {
    const { status } = result;

    if (status === requestStatuses.SUCCESS) {
      const { comment } = result.payload;
      const { data, totalCount } = state

      const changedData = data.map(item => item.commentGuid == comment.commentGuid ? { ...item, ...comment } : item)

      return {
        ...state,
        data: changedData,
        dataRender: createRenderList(changedData),
        dataAnswerRender: createByUser(changedData),
      }
    }

    return state
  }

  handleDeleteComment(state, result) {
    const { status, loading, payload } = result;

    if (status === requestStatuses.SUCCESS) {
      const { commentGuid } = result.payload;
      const { data, totalCount } = state

      const changedData = data.filter(comment => comment.commentGuid != commentGuid)

      return {
        ...state,
        data: data.filter(comment => comment.commentGuid != commentGuid),
        dataRender: createRenderList(changedData),
        dataAnswerRender: createByUser(changedData),
        totalCount: totalCount - 1
      }
    }

    return state
  }

  handleGetCommentWs(state, comment) {
    if(comment){
      const { data, totalCount } = state
      const newComments = [].concat(comment, data)

      return {
        ...state,
        data: newComments,
        dataRender: createRenderList(newComments),
        dataAnswerRender: createByUser(newComments),
        totalCount: totalCount + 1
      }
    }

    return state
  }

  handleDeleteCommentWs(state, comment) {
    if(comment){
      const { commentGuid } = comment;
      const { data, totalCount } = state

      const changedData = data.filter(item => item.commentGuid != commentGuid)

      return {
        ...state,
        data: data.filter(item => item.commentGuid != commentGuid),
        dataRender: createRenderList(changedData),
        dataAnswerRender: createByUser(changedData),
        totalCount: totalCount - 1
      }
    }

    return state
  }

  handleChangeCommentWs(state, comment) {
    if (comment) {
      const { data, totalCount } = state

      const changedData = data.map(item => {
        if(item.commentGuid == comment.commentGuid) {
          const { userName, userPhotoLink, userId } = item
          return { ...item, ...comment, userName, userPhotoLink, userId }
        }else{
          return item
        }
      })

      return {
        ...state,
        data: changedData,
        dataRender: createRenderList(changedData),
        dataAnswerRender: createByUser(changedData)
      }
    }

    return state
  }
}

export default createReducer(CommentsReducer);
