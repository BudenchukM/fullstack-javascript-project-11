import axios from 'axios'
import uniqueId from 'lodash/uniqueId'
import { string, setLocale } from 'yup'
import parseRss from './parser.js'

// Константы
const REQUEST_TIMEOUT_MS = 5000
const UPDATE_INTERVAL_MS = 5000

// Хелпер для обработки ошибок
const handleError = (state, errorKey, error = null) => {
  console.error(error)
  Object.assign(state.loadingProcess, { status: 'failed', errorKey })
}

const createSchema = (rssLinks) => {
  return string().required().url().notOneOf(rssLinks)
}

const setYupLocale = () => {
  setLocale({
    mixed: {
      required: () => ({ key: 'formFeedback.errors.validation.required' }),
      notOneOf: () => ({ key: 'formFeedback.errors.validation.alreadyExists' }),
    },
    string: {
      url: () => ({ key: 'formFeedback.errors.validation.invalidUrl' }),
    },
  })
}

const getProxiedUrl = (url) => {
  const proxiedUrl = new URL('/get', 'https://allorigins.hexlet.app')
  proxiedUrl.searchParams.set('url', url)
  proxiedUrl.searchParams.set('disableCache', 'true')
  return proxiedUrl.toString()
}

const getNewPosts = (posts, feedId, state) => {
  const currentFeedIdPosts = state.posts.allPosts.filter(post => post.feedId === feedId)
  return posts.filter(newPost => !currentFeedIdPosts.some(oldPost => newPost.postLink === oldPost.postLink))
}

const getRssData = (rssLink, state) => {
  const proxiedUrl = getProxiedUrl(rssLink)
  return axios.get(proxiedUrl, { timeout: REQUEST_TIMEOUT_MS })
    .then((response) => {
      const { contents } = response.data
      const { channel: feed, items } = parseRss(contents)

      const currentFeed = state.feeds.find(({ feedLink }) => feedLink === rssLink)
      const feedId = currentFeed ? currentFeed.feedId : uniqueId()

      const newFeed = {
        feedId,
        feedTitle: feed.title,
        feedDescription: feed.description,
        feedLink: rssLink,
      }

      const posts = items.map(item => ({
        feedId,
        postTitle: item.title,
        postDescription: item.description,
        postLink: item.link,
      }))

      const newPosts = getNewPosts(posts, feedId, state)
      newPosts.forEach((post) => {
        post.postId = uniqueId()
      })

      return { newFeed, newPosts }
    })
}

const updatePosts = (rssLink, state) => {
  return getRssData(rssLink, state)
    .then(({ newPosts }) => {
      if (newPosts.length === 0) return
      Object.assign(state.posts, {
        allPosts: state.posts.allPosts.concat(newPosts),
        newPosts,
      })
    })
    .catch(error => {
      handleError(state, 'networkError', error)
    })
}

const addFeed = (rssLink, state) => {
  Object.assign(state.loadingProcess, { status: 'loading', errorKey: null })

  return getRssData(rssLink, state)
    .then(({ newFeed, newPosts }) => {
      state.rssLinks.push(rssLink)
      state.feeds.push(newFeed)

      Object.assign(state.form, { status: 'valid', errorKey: null })
      Object.assign(state.loadingProcess, { status: 'success', errorKey: null })

      Object.assign(state.posts, {
        allPosts: state.posts.allPosts.concat(newPosts),
        newPosts,
      })
    })
    .catch(error => {
      handleError(state, 'networkError', error)
    })
}

const runUpdatingPosts = (state) => {
  const promises = state.rssLinks.map(rssLink => updatePosts(rssLink, state))

  Promise.allSettled(promises)
    .then(results => {
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          handleError(state, 'networkError', result.reason)
          console.error(`Ошибка обновления фида ${state.rssLinks[index]}:`, result.reason)
        }
      })
    })
    .finally(() => setTimeout(() => runUpdatingPosts(state), UPDATE_INTERVAL_MS))
}

const handleCheckPost = (state, targetElementId) => {
  const { viewedPostsIds } = state.uiState
  if (!viewedPostsIds.includes(targetElementId)) {
    viewedPostsIds.push(targetElementId)
  }
}

export {
  createSchema,
  setYupLocale,
  addFeed,
  runUpdatingPosts,
  handleCheckPost,
}
