import { useState, useEffect, useCallback } from 'react';

export type PromiseFn<T> = (...args: any[]) => Promise<T>;

const enum Status {
	Idle = `idle`,
	Pending = `pending`,
	Success = `success`,
	Error = `error`,
}

type UseAsyncResult<T> = [
	() => Promise<void>,
	boolean,
	T|undefined,
	Error|undefined
]

const useAsync = <T>(
	callback: PromiseFn<T>|{
		promiseFn: PromiseFn<T>;
		[key: string]: any;
	},
	immediate: boolean = true): UseAsyncResult<T> =>
{

	const { promiseFn, ...args } = (typeof callback !== `function`) ?
		callback :
		{
			promiseFn: callback,
		}

	const [status, setStatus] = useState(Status.Idle)
	const [data, setData] = useState<T|undefined>(undefined)
	const [error, setError] = useState<Error|undefined>(undefined)

	const execute = useCallback(async () => {

		setStatus(Status.Pending)
		setData(undefined)
		setError(undefined)

		return await promiseFn(args)
			.then((res: T) => {
				setData(res)
				setStatus(Status.Success)
			})
			.catch((error) => {
				setError(error)
				setStatus(Status.Error)
			})

	}, [callback])

	useEffect(() => {

		if(immediate) {
			execute()
		}

	}, [execute, immediate])

	return [
		execute,
		(status === Status.Pending),
		data,
		error
	]

}

export default useAsync
