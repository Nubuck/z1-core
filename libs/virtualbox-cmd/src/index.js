import { task } from '@z1/preset-task'
import { Fs, Execa } from '@z1/preset-tools'

const vBoxManageBinary = () => {
  const hostPlatform = process.platform
  // Host operating system
  if (/^win/.test(hostPlatform)) {
    // Path may not contain VBoxManage.exe but it provides this environment variable
    const vBoxInstallPath = process.env.VBOX_INSTALL_PATH || process.env.VBOX_MSI_INSTALL_PATH
    return `"${vBoxInstallPath}\\VBoxManage.exe" `
  }
  else if (/^darwin/.test(hostPlatform) || /^linux/.test(hostPlatform)) {
    // Mac OS X and most Linux use the same binary name, in the path
    return 'vboxmanage '
  }
  // Otherwise (e.g., SunOS) hope it's in the path
  return 'vboxmanage '
}
export const vBoxCommand = cmd => `${vBoxManageBinary()}${cmd}`

export const startCommand = (vmName, options = { gui: true }) => {
  return vBoxCommand(`-nologo startvm "${vmName}" --type ${options.gui ? 'gui' : 'headless'}`)
}
export const powerOffCommand = (vmName) => {
  return vBoxCommand(`controlvm "${vmName}" poweroff`)
}
export const listVMCommand = () => {
  return vBoxCommand('list "vms"')
}
export const listRunningCommand = () => {
  return vBoxCommand('list "runningvms"')
}
export const infoCommand = (vmName) => {
  return vBoxCommand(`showvminfo "${vmName}"`)
}
export const setExtraDataCommand = (vmName, key, value) => {
  return vBoxCommand(`setextradata "${vmName}" ${key} ${value}`)
}

