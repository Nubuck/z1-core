import { createServer } from 'http'
import { Fs } from '@z1/preset-tools'
import { task } from '@z1/preset-task'

const gracefulShutdown = task((t) => (server, props, config) => {
	console.log('Received SIGINT or SIGTERM. Shutting down gracefully...')
	server.close(() => {
		console.log('Closed out remaining connections.')
		if (t.equals(t.type(t.path([ 'onStop' ], props)), 'Function')) {
			props.onStop(config)
		}
		process.exit()
	})

	// force stop after timeout
	setTimeout(() => {
		console.log('Could not close connections in time, forcefully shutting down')
		process.exit()
	}, 20000)
})

export const service = task((t) => async (props) => {
	const configPath = !t.has('configPath')(props)
		? 'config/default.json'
		: props.configPath
	const config = await Fs.readAsync(Fs.path(configPath), 'json')
	const server = createServer(props.app || undefined).listen(config.port, () => {
		if (t.equals(t.type(t.path([ 'onStart' ], props)), 'Function')) {
			props.onStart(config)
		}
	})

	// e.g. kill
	process.on('SIGTERM', () => gracefulShutdown(server, props, config))

	// e.g. Ctrl + C
	process.on('SIGINT', () => gracefulShutdown(server, props, config))

	// yield
	server.config = config
	return server
})
