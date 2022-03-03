import moment from "moment";
import { reject, reverse, map, each, get, set, cloneDeep } from 'lodash';
import { createActions, createReducer } from "realt";
import { coursesActions } from "store/modules/courses";

import { requestStatuses, counters as countersStatuses } from "constants/index";
import api from "store/services/api";

export const countersActions = createActions({
  getCourseCounters() {
    return api.get('courseMessages/counters')
  },

  getTasksCounters() {
    return api.get('courseTaskMessages/counters')
  },

  getAdminTasksCounters(){
    return api.get('admin/courseTaskMessages/counters')
  },

  getSupportCounters() {
    return api.get('messages/counters')
  },

  getAdminSupport(){
    return api.get('admin/messages/counters')
  },

  getCommentsCounters() {
    return api.get('comments/counters')
  },

  recountCounters(message, user, type){
    return { message, user, type }
  },

  resetCounters2(params){
    return params
  },
})

class CountersReducer {
  constructor() {
    this.bindAction(countersActions.getCourseCounters, this.handleGetCourseCounters)
    this.bindAction(countersActions.getTasksCounters, this.handleGetTasksCounters)
    this.bindAction(countersActions.getSupportCounters, this.handleGetSupportCounters)
    this.bindAction(countersActions.getCommentsCounters, this.handleGetCommentsCounters)
    this.bindAction(countersActions.getAdminTasksCounters, this.handleGetAdminTasksCounters)

    this.bindAction(countersActions.recountCounters, this.handleRecountCounters)
    this.bindAction(countersActions.resetCounters2, this.handleResetCounters2)
    this.bindAction(countersActions.createCourseCounters, this.handleCreateCourseCounters)
  }

  get initialState() {
    return {
      courseCounters: {},
      courseCount: 0,
      tasksCounters: {},
      tasksCount: 0,
      commentsCounters: {},
      commentsCount: 0,
      supportCounters: {},
      supportCount: 0,
      adminTasksCount: 0,
      supportAdminCount: 0,
      supportAdminCounters: {}
    }
  }

  handleGetSupportCounters(state, result) {
    if (result.status === requestStatuses.SUCCESS) {
      const { data, counterKey } = result.payload;
      const { supportMessagesCount, supportMessagesCounters } = data

      return {
        ...state,
        // supportCounters: supportMessagesCounters,
        supportCount: data
      }
    }

    return state
  }

  handleGetAdminSupportCounters(state, result) {
    if (result.status === requestStatuses.SUCCESS) {
      const { data, counterKey } = result.payload;
      const { supportMessagesCount, supportMessagesCounters } = data

      return {
        ...state,
        supportAdminCounters: supportMessagesCounters,
        supportAdminCount: supportMessagesCount
      }
    }

    return state
  }

  handleGetTasksCounters(state, result) {
    if (result.status === requestStatuses.SUCCESS) {
      const { data, counterKey } = result.payload;
      const { coursesTaskMessagesCounters, coursesTasksMessagesCount } = data

      return {
        ...state,
        tasksCounters: coursesTaskMessagesCounters,
        tasksCount: coursesTasksMessagesCount
      }
    }

    return state
  }

  handleGetAdminTasksCounters(state, result) {
    if (result.status === requestStatuses.SUCCESS) {
      const { data } = result.payload;
      const { coursesTaskMessagesCounters, coursesTasksMessagesCount } = data

      return {
        ...state,
        adminTasksCounters: coursesTaskMessagesCounters,
        adminTasksCount: coursesTasksMessagesCount
      }
    }

    return state
  }

  handleGetCourseCounters(state, result) {
    if (result.status === requestStatuses.SUCCESS) {
      const { data, counterKey } = result.payload;
      const { courseMessagesCounters, coursesMessagesCount } = data

      return {
        ...state,
        courseCounters: courseMessagesCounters,
        courseCount: coursesMessagesCount
      }
    }

    return state
  }

  handleGetCommentsCounters(state, result) {
    if (result.status === requestStatuses.SUCCESS) {
      const { data, counterKey } = result.payload;
      const { commentsCounters, commentsCount } = data

      return {
        ...state,
        commentsCounters,
        commentsCount
      }
    }

    return state
  }

}

export default createReducer(CountersReducer);
