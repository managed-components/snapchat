import { ComponentSettings, Manager, MCEvent } from '@managed-components/types'

export type RequestBodyType = {
  v: string
  if: string
  ts: string
  rf: string
  pl: string
  bt: string
  ev: string
  m_sl: string
  m_rd: string
  m_pi: string
  m_pl: string
  m_ic: string
  pid: string
  u_c1?: string
}

export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min //The maximum is exclusive and the minimum is inclusive
}

export const getRequestBody = (
  eventType: string,
  event: MCEvent,
  settings: ComponentSettings
) => {
  const { client, payload } = event
  const pid = settings.pid

  const m_rd = getRandomInt(2000, 3000)
  const m_sl = getRandomInt(m_rd - 500, m_rd)
  const m_pi = getRandomInt(m_sl - 1000, m_sl)
  const m_pl = m_pi + getRandomInt(1, 100)

  const requestBody: RequestBodyType = {
    v: '1.5',
    if: 'false',
    ts: new Date().valueOf().toString(),
    rf: client.referer,
    pl: client.url.href,
    bt: '__LIVE__',
    ev: eventType,
    m_sl: m_rd.toString(),
    m_rd: m_sl.toString(),
    m_pi: m_pi.toString(),
    m_pl: m_pl.toString(),
    m_ic: '0',
    pid: payload.pid || pid,
  }

  const uuidCookie = client.get('scid')
  if (uuidCookie) {
    requestBody.u_c1 = uuidCookie
  } else {
    requestBody.u_c1 = crypto.randomUUID()
    client.set('scid', requestBody.u_c1)
  }

  return requestBody
}

export const handler = (
  eventType: string,
  event: MCEvent,
  settings: ComponentSettings
) => {
  const requestBody = getRequestBody(eventType, event, settings)
  const pid = settings.pid

  event.client.fetch(`https://tr.snapchat.com/cm/i?pid=${pid}`, {
    credentials: 'include',
    keepalive: true,
    mode: 'no-cors',
  })

  event.client.fetch(`https://tr.snapchat.com/p`, {
    credentials: 'include',
    keepalive: true,
    mode: 'no-cors',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(requestBody).toString(),
  })
}

export default async function (manager: Manager, settings: ComponentSettings) {
  manager.addEventListener('event', event => {
    const eventType = event.payload.ev
    handler(eventType, event, settings)
  })

  manager.addEventListener('pageview', event => {
    const eventType = event.payload.ev
    handler(eventType, event, settings)
  })
}
