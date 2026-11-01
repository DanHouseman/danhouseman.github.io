/*
 * cross-browser/cross-platform browser-based network scanner and local ip detector
 * by samy kamkar 2020/11/07
 * https://samy.pl
 *
 * Patched for efficiency. Public API unchanged.
 * by dan houseman 2026/11/01
 */

(function(window, document) {

const DEFAULT_SCANNER = 'fetch'

const DEFAULT_CONF = {
  block: 10,
  timeout: 2000,
  logger: line => console.log(line),
  ports: [1337, 1338, 1339],
  forceHttp: false,          // [FIX 6] opt-in protocol downgrade, not default
  subnets: null,             // [FIX 8] null => use built-in list
}

// ---------------------------------------------------------------------------
// Scanners
// ---------------------------------------------------------------------------
// Contract (unchanged from original, just now enforced):
//   start(ips)   - prepare; may allocate per-ip state
//   scan(ip)     - MUST return a promise that settles when this ip is done
//                  (either via isLive() or because it failed/dead)
//   stop(ips)    - abort everything; MUST cause outstanding scan() promises
//                  to settle (resolve or reject) so block accounting drains
//   live(ip)     - called when an ip is confirmed alive
//   local(ip)    - called when an ip is confirmed local
// ---------------------------------------------------------------------------

let scanners = {

  fetch: {
    async start(ips) {
      this.controller = new AbortController()
      this.fetchConf = {
        signal: this.controller.signal,
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'omit',
        headers: {},
        redirect: 'manual',   // required: live host that 3xx's must still settle
        referrerPolicy: 'no-referrer',
      }
    },

    // [FIX 5] no per-ip closure pre-allocation; build the catch inline.
    // [FIX 1] returns a promise that always settles, so the block can
    //         early-resolve instead of waiting for the full timeout.
    async scan(ip) {
      try {
        await fetch(`//${ip}:${port}/samyscan`, this.fetchConf)
        // A resolved fetch here means the host responded (even with an
        // opaque/redirect response under manual redirects). Live.
        isLive(ip)
      } catch (e) {
        if (e.name !== 'AbortError')
          isLive(ip)   // connection refused / network error == host present
        // AbortError: timed out by us -> not live, do nothing
      }
    },

    async stop(ips) {
      this.controller.abort()
    },

    async live(ip) {
      console.log(`flive(${ip})`)
      if (conf.rtc !== false)
        await connectPeers(ip, ip => isLocal(ip))
    },

    async local(ip) {
      console.log(`flocal(${ip})`)
    },
  },

  img: {
    async start(ips) {
      this.imgs = {}
      this.resolvers = {}   // [FIX 4] per-ip resolve handles
    },

    // [FIX 4] promise-based so the block can early-resolve and stop() can
    //         drain outstanding scans deterministically.
    async scan(ip) {
      const img = new Image()
      this.imgs[ip] = img
      img.id = `webscanimg${ip}`

      return new Promise(resolve => {
        this.resolvers[ip] = resolve
        img.onload = img.onerror = () => {
          isLive(ip)     // error still means the host answered
          resolve()
        }
        img.src = `//${ip}:${port}/samyscan.png`
      })
    },

    async stop(ips) {
      for (const ip of ips) {
        const img = this.imgs[ip]
        if (img) {
          img.onload = img.onerror = () => {}
          img.src = pixel_img
          img.remove()
        }
        const r = this.resolvers[ip]
        if (r) { r(); this.resolvers[ip] = null }   // [FIX 4] drain
      }
    },

    async live(ip) {
      if (conf.rtc !== false)
        await connectPeers(ip, ip => isLocal(ip))
    },

    async local(ip) {
      console.log(`ilocal(${ip})`)
    },
  },
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

// [FIX 3] immutable merge. DEFAULT_CONF is never mutated. Merge happens once
// per top-level call, not per block.
let conf = Object.assign({}, DEFAULT_CONF)

function setConf(c) {
  if (c && typeof c === 'object')
    conf = Object.assign({}, conf, c)
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

let scan
let port = DEFAULT_CONF.ports[0]

// [FIX 2] key scanned by ip:port so retrying on a second port re-tries
let scanned = {}

let liveIps = {}
let scans = []

let subnets = [
  '10.0.0.1','10.0.0.138','10.0.0.2','10.0.1.1','10.1.1.1','10.1.10.1',
  '10.10.1.1','10.90.90.90','192.168.100.1','192.168.*.1','192.168.0.10',
  '192.168.0.100','192.168.0.101','192.168.0.227','192.168.0.254',
  '192.168.0.3','192.168.0.30','192.168.0.50','192.168.1.10',
  '192.168.1.100','192.168.1.20','192.168.1.200','192.168.1.210',
  '192.168.1.254','192.168.1.99','192.168.10.10','192.168.10.100',
  '192.168.10.50','192.168.100.100','192.168.123.254','192.168.168.168',
  '192.168.2.254','192.168.223.100','192.168.254.254',
]

let candidateKeys = ["address","candidate","component","foundation","port",
  "priority","protocol","relatedAddress","relatedPort","sdpMLineIndex",
  "sdpMid","tcpType","type","usernameFragment"]

const pixel_img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

// [FIX 9] precompiled regex for the candidate guard
const LOCAL_TOKEN_RE = /[\w\-]+\.local|127\.0\.0\.1/

// ---------------------------------------------------------------------------
// WebRTC loopback probe (unchanged behavior; [FIX 9] guard added)
// ---------------------------------------------------------------------------

window.connectPeers = async function(ip, success) {
  let localConnection = null
  let remoteConnection = null
  let sendChannel = null
  let receiveChannel = null

  function sendMessage() { if (sendChannel) sendChannel.send('test') }

  function handleSendChannelStatusChange() {
    if (sendChannel && sendChannel.readyState === 'open')
      sendMessage()
  }

  let handleReceiveMessage = async function(event) {
    success(ip)
  }

  let receiveChannelCallback = async function(event) {
    receiveChannel = event.channel
    receiveChannel.onmessage = handleReceiveMessage
    receiveChannel.onopen = handleReceiveChannelStatusChange
    receiveChannel.onclose = handleReceiveChannelStatusChange
  }

  function handleReceiveChannelStatusChange() {}

  const config = { iceServers: [], iceTransportPolicy: 'all', iceCandidatePoolSize: 0 }
  localConnection = new RTCPeerConnection(config)

  if (localConnection.createDataChannel) {
    sendChannel = localConnection.createDataChannel("sendChannel")
    sendChannel.onopen = handleSendChannelStatusChange
    sendChannel.onclose = handleSendChannelStatusChange
  }

  remoteConnection = new RTCPeerConnection(config)
  remoteConnection.ondatachannel = receiveChannelCallback

  let iceCan = function(con) {
    return function(e) {
      try {
        if (e.candidate) {
          // [FIX 9] fast path: no local/mDNS token -> pass through untouched,
          // skip the candidate object rebuild entirely.
          if (!LOCAL_TOKEN_RE.test(e.candidate.candidate))
            return con.addIceCandidate(e.candidate)

          let newcan = {}
          for (let key of candidateKeys)
            newcan[key] = e.candidate[key]
          newcan.candidate = newcan.candidate.replaceAll(LOCAL_TOKEN_RE, ip)
          newcan.address = ip
          return con.addIceCandidate(newcan)
        }
        return !e.candidate || con.addIceCandidate(e.candidate)
      } catch (err) { console.log('err', err) }
    }
  }

  localConnection.onicecandidate = iceCan(remoteConnection)
  remoteConnection.onicecandidate = iceCan(localConnection)

  localConnection.createOffer()
    .then(offer => localConnection.setLocalDescription(offer))
    .then(() => remoteConnection.setRemoteDescription(localConnection.localDescription))
    .then(() => remoteConnection.createAnswer())
    .then(answer => remoteConnection.setLocalDescription(answer))
    .then(() => localConnection.setRemoteDescription(remoteConnection.localDescription))
    .catch(error => console.log("Unable to create an offer: " + error.toString()))
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// [FIX 7] O(n) expansion, single '*' per string (documented), no concat loop.
window.unroll_ips = function(ips, min, max) {
  const lo = (min == null) ? 0 : min
  const hi = (max == null) ? 256 : max
  const base = typeof ips === 'string' ? [ips] : ips
  const out = []
  for (const ip of base) {
    const star = ip.indexOf('*')
    if (star === -1) { out.push(ip); continue }
    const pre = ip.slice(0, star)
    const suf = ip.slice(star + 1)
    for (let i = lo; i < hi; i++) out.push(pre + i + suf)
  }
  return out
}

// [FIX 9] Date.now()
function now() { return Date.now() }

function getSubnet(ip) {
  return ip.substr(0, ip.indexOf('.', ip.indexOf('.', ip.indexOf('.') + 1) + 1) + 1)
}

// ---------------------------------------------------------------------------
// Detection callbacks
// ---------------------------------------------------------------------------

async function isLocal(ip) {
  console.log('is local!')
  live[ip] = 0
  conf.logger(`<b><span style='color:tomato;'>found LOCAL ip address: ${ip}</span> (localCallback called)</b>`)
  if (conf.localCallback) conf.localCallback(ip)
  if (scan.local) scan.local(ip)
}

async function isLive(ip) {
  // [FIX 2] record timing keyed by ip:port as well as the per-block live map
  live[ip] = now()
  if (conf.networkCallback) conf.networkCallback(ip)
  conf.logger(`<b>found host: ${ip}</b> ${live[ip] - scanned[`${ip}:${port}`]}ms (networkCallback called)`)
  if (scan.live) scan.live(ip)
}

// ---------------------------------------------------------------------------
// Block scanner
// ---------------------------------------------------------------------------

// `live` is now per-block local state, not a shared global. [FIX 2]
let live = {}

window.scanIpsBlock = async function(ips, c, subnet) {
  setConf(c)
  conf.logger(`scanIpsBlock(${ips})`)

  scan = scanners[conf.scanner] || scanners[DEFAULT_SCANNER]
  scans = []
  live = {}

  await scan.start(ips)

  // [FIX 1] Track outstanding scans; resolve the block as soon as all settle.
  let pending = 0
  let resolveAllDone
  const allDone = new Promise(r => { resolveAllDone = r })
  const onSettle = () => { if (--pending === 0) resolveAllDone() }

  let timer
  const timeout = new Promise(r => {
    timer = setTimeout(() => {
      console.log('stopped')
      scan.stop(ips)      // aborts fetches / drains img promises
      r()
    }, conf.timeout)
  })

  for (const ip of ips) {
    const key = `${ip}:${port}`          // [FIX 2]
    if (scanned[key]) continue
    scanned[key] = now()
    pending++
    const p = scan.scan(ip)
    scans.push(p)
    p.finally(onSettle)                  // [FIX 1]
  }

  // [FIX 1] If nothing was pending (all ips already scanned), don't wait.
  if (pending === 0) resolveAllDone()

  await Promise.race([timeout, allDone])
  clearTimeout(timer)

  // Defensive: if allDone won the race, ensure the controller is torn down.
  if (pending === 0) { try { await scan.stop(ips) } catch (_) {} }

  // compute per-ip elapsed times
  for (const ip of Object.keys(live))
    if (live[ip]) live[ip] -= scanned[`${ip}:${port}`]

  // subnet recursion
  if (subnet)
    for (const net of Object.keys(live)) {
      if (conf.subnetCallback) conf.subnetCallback(net)
      conf.logger(`scanIps(${getSubnet(net)}, subnet=false) (subnetCallback called)`)
      Object.assign(live, await scanIps(unroll_ips(getSubnet(net) + '*', 1, 254)))
    }

  return live
}

// ---------------------------------------------------------------------------
// Multi-block driver
// ---------------------------------------------------------------------------

window.scanIps = async function(ips, c, subnet) {
  setConf(c)
  conf.logger(`scanIps() started, subnet=${!!subnet}`)

  // [FIX 2] return a fresh accumulator rather than mutating a shared one
  const result = {}
  for (let i = 0; i < ips.length; i += conf.block) {
    Object.assign(result, await scanIpsBlock(ips.slice(i, i + conf.block), null, subnet))
  }
  // merge into the caller-visible liveIps without aliasing
  Object.assign(liveIps, result)
  return result
}

// ---------------------------------------------------------------------------
// Top-level entry
// ---------------------------------------------------------------------------

window.webScanAll = async function(nets, c) {
  // [FIX 3] merge config once, up front
  setConf(c)

  // [FIX 6] protocol downgrade is now opt-in
  if (conf.forceHttp && location.protocol === 'https:' && !c?.noRedirect)
    return location.protocol = 'http:'

  // [FIX 2] fresh scan set per top-level run
  scanned = {}
  liveIps = {}
  port = conf.ports[0]

  const ips = { network: {}, local: [] }
  const netList = nets || conf.subnets || subnets

  conf.logger(`webScanAll() started`)

  async function scanNets() {
    ips.network = await scanIps(unroll_ips(netList), null, true)
    ips.local = Object.keys(ips.network).filter(ip => ips.network[ip] == 0)
  }
  await scanNets()

  if (!ips.local.length) {
    port = conf.ports[1]
    conf.logger('no local ips found, scanning once more')
    // [FIX 2] keying is ip:port, so we no longer need to wipe scanned here
    await scanNets()
  }
  return ips
}

// [FIX 9] removed eval(document.currentScript.innerText) — re-executing the
// whole IIFE is a correctness hazard (double-runs connectPeers definitions,
// double-initializes state) and gains nothing. The IIFE already ran.

})(this, document)
