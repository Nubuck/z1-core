import z from '@z1/lib-state-box-node'
import os from 'os'
import sysInfo from 'systeminformation'
import hasha from 'hasha'

// parts
const hashCtx = z.fn(t => async ctx => {
  const hashVals = t.values(ctx)
  const hashData = t.tags.oneLineInlineLists`
    ${t.mapIndexed(
      (val, index) =>
        `${t.to.constantCase(val)}${
          t.eq(t.len(hashVals) - 1, index) ? '' : '_'
        }`,
      hashVals
    )}
  `.replace(/\s/g, '')
  return await hasha(hashData, { algorithm: 'sha1' })
})

// main
export const machine = z.fn(t => async ({ role }) => {
  const systemInfo = await sysInfo.system()
  const machCtx = {
    hardwareuuid: systemInfo.uuid,
    serialnumber: systemInfo.serial,
    sku: systemInfo.sku,
    manufacturer: systemInfo.manufacturer,
    model: systemInfo.model,
  }
  const machineHashId = await hashCtx(machCtx)
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
  const userCtx = {
    hardwareuuid: systemInfo.uuid,
    hostname: os.hostname(),
    username: t.to.lowerCase(os.userInfo().username),
    role,
  }
  const hashId = await hashCtx(userCtx)
  return {
    machine: t.mergeAll([
      machCtx,
      hardwareCtx,
      osCtx,
      { hashId: machineHashId },
    ]),
    user: t.merge(t.omit(['hardwareuuid'], userCtx), { machineHashId, hashId }),
  }
})
