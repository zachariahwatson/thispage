export class QueryError extends Error {
	code?: string

	constructor(message: string, code?: string) {
		// Call the parent constructor (Error) with the message
		super(message)

		// Set the status code
		this.code = code

		// Maintains proper stack trace for where the error was thrown (only available in V8)
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, QueryError)
		}
	}
}
