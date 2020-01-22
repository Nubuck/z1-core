import { task } from '@z1/preset-task'
import os from 'os'
import sysInfo from 'systeminformation'
import hasha from 'hasha'

// parts
const hashCtx = task(t => async ctx => {
  const hashVals = t.values(ctx)
  const hashData = t.replace(
    /\s/g,
    '',
    t.tags.oneLineInlineLists`
    ${t.mapIndexed(
      (val, index) =>
        `${t.to.constantCase(val)}${
          t.eq(t.len(hashVals) - 1, index) ? '' : '_'
        }`,
      hashVals
    )}
  `
  )
  return await hasha(hashData, { algorithm: 'sha1' })
})

// main
const account = task(t => async ({ role, system }) => {
  const systemInfo = await sysInfo.system()
  const machCtx = {
    hardwareuuid: systemInfo.uuid,
    serialnumber: systemInfo.serial,
    manufacturer: systemInfo.manufacturer,
    model: systemInfo.model,
  }
  const machineHashId = await hashCtx(machCtx)
  const userCtx = {
    hardwareuuid: systemInfo.uuid,
    hostname: os.hostname(),
    username: t.to.lowerCase(os.userInfo().username),
    role,
  }
  const hashId = await hashCtx(userCtx)
  const user = t.merge(t.omit(['hardwareuuid'], userCtx), {
    machineHashId,
    hashId,
  })
  if (t.eq(system, true)) {
    const cpuInfo = await sysInfo.cpu()
    const timeInfo = await sysInfo.time()
    const hardwareCtx = {
      cpus: cpuInfo.physicalCores,
      cores: cpuInfo.cores,
      timezone: timeInfo.timezone,
    }
    const osInfo = await sysInfo.osInfo()
    const osCtx = {
      type: os.type(),
      platform: os.platform(),
      release: osInfo.release,
      arch: osInfo.arch,
      distro: osInfo.distro,
      hostSerialnumber: osInfo.serial,
    }
    return {
      machine: t.mergeAll([
        machCtx,
        hardwareCtx,
        osCtx,
        { hashId: machineHashId },
      ]),
      user,
    }
  }
  return {
    machine: t.mergeAll([machCtx, { hashId: machineHashId }]),
    user,
  }
})

const system = task(t => async machine => {
  const cpuInfo = await sysInfo.cpu()
  const timeInfo = await sysInfo.time()
  const hardwareCtx = {
    cpus: cpuInfo.physicalCores,
    cores: cpuInfo.cores,
    timezone: timeInfo.timezone,
  }
  const osInfo = await sysInfo.osInfo()
  const osCtx = {
    type: os.type(),
    platform: os.platform(),
    release: osInfo.release,
    arch: osInfo.arch,
    distro: osInfo.distro,
    hostSerialnumber: osInfo.serial,
  }
  return t.mergeAll([t.isNil(machine) ? {} : machine, hardwareCtx, osCtx])
})

export const machine = { account, system }
