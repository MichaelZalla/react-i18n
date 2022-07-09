import React from 'react';

import useAsync from './useAync';

const fetchMarkup = async (url: string): Promise<string> => fetch(url).then((res) => res.text())

const useI18nHtml = (
	includeUrl: string): [string|undefined, Error|undefined, boolean] =>
{

	const [prevHtml, setPrevHtml] = React.useState<string>(``)

	const [_, isPending, data, error] = useAsync<string>(
		React.useCallback(
			() => {

				if(!includeUrl)
				{
					return new Promise<string>(resolve => resolve(``))
				}

				return fetchMarkup(includeUrl)
					.then(data => {

						setPrevHtml(data)

						return data

					})

			},
			[includeUrl]
		)
	)

	const markup: string = data as unknown as string

	return [markup || prevHtml || undefined, error, isPending]

}

export default useI18nHtml
