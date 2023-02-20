import { MCEvent } from '@managed-components/types'
import { generateUUID, getRandomInt, getRequestBody } from '.'

describe('Snapchat MC works correctly', () => {
  let fetchedRequests: any = []
  let setCookies: any = []

  const dummyClient = {
    title: 'Zaraz "Test" /t Page',
    timestamp: 1670502437,
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    language: 'en-GB',
    referer: '',
    ip: '127.0.0.1',
    emitter: 'browser',
    url: new URL('http://127.0.0.1:1337'),
    fetch: () => undefined,
    set: () => undefined,
    execute: () => undefined,
    return: () => {},
    get: () => undefined,
    attachEvent: () => {},
    detachEvent: () => {},
  }

  const fakeEvent = new Event('event', {}) as MCEvent
  fakeEvent.payload = {
    pid: 'xyz',
  }
  fakeEvent.client = {
    ...dummyClient,
    fetch: (url, opts) => {
      fetchedRequests.push({ url, opts })
      return undefined
    },
    set: (key, value, opts) => {
      setCookies.push({ key, value, opts })
      return undefined
    },
  }

  const settings = {
    pid: 'xyz',
  }

  it('Random int function generates a random number', () => {
    expect(getRandomInt(1, 10)).toBeTypeOf('number')
  })

  it('Send event and get back correct request body', () => {
    const requestBody = getRequestBody('event', fakeEvent, settings)

    expect(requestBody.pl).toBe('http://127.0.0.1:1337/')
    expect(requestBody.pid).toBe(fakeEvent.payload.pid)
    expect(requestBody.u_c1).toBeTypeOf('string')
    expect(requestBody.m_sl).toBeTypeOf('string')
    expect(requestBody.m_rd).toBeTypeOf('string')
    expect(requestBody.m_pi).toBeTypeOf('string')
    expect(requestBody.m_pl).toBeTypeOf('string')
  })

  it('Generated random integer is between given range', () => {
    const min = 1
    const max = 10
    const randomNum = getRandomInt(min, max)

    expect(randomNum <= max && randomNum >= min).toBe(true)
  })
})
