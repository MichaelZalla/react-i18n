import React, { FC } from 'react';

import I18nSettingsContext from '../../contexts/I18nSettingsContext';

import useI18nString from '../../hooks/useI18nString';

export type I18nProps = React.PropsWithChildren<{
  k: string;
  data?: { [key: string]: any };
  skeletonWidth?: number;
  ignoreMissing?: boolean;
}>

const I18n: FC<I18nProps> = ({ k: key, data, skeletonWidth, ignoreMissing }) => {

  const [_, __, settings] = React.useContext(I18nSettingsContext)

  const [str, error, isPending] = useI18nString(key, data, ignoreMissing)

  const [strWidth, setStrWidth] = React.useState<number>(175)
  const [strLines, setStrLines] = React.useState<number>(1)

  const spanRef = React.useRef<HTMLSpanElement>(null)

  const LoadingComponent = (settings.i18nLoadingComponent) ?
    settings.i18nLoadingComponent :
    ({}) => <span>Loading...</span>;

  React.useEffect(() => {

    if(typeof str === `string`) {

      window.setTimeout(() => {

        if(spanRef.current === null)
        {
          return;
        }

        const { width, height } = spanRef.current.getBoundingClientRect()

        const lineHeight = parseInt(window.getComputedStyle(spanRef.current!).lineHeight)

        setStrWidth(width || 64)

        setStrLines(Math.round(height / lineHeight))

      }, 25)

    }

  }, [
    str,
    spanRef,
    setStrWidth,
  ])

  if(isPending)
  {
    return (
      <>
        {
          [...Array(strLines)].map((_, index) => (
            <LoadingComponent key={index} width={skeletonWidth || strWidth} />
          ))
        }
      </>
    )
  }

  if(error)
  {
    if(process.env.NODE_ENV === `development`)
    {
      console.warn(error)
    }

    return <span style={{ color: `red` }}>{settings.keyErrorMessage}</span>
  }

  return (
    <span ref={spanRef} dangerouslySetInnerHTML={{ __html: str || `` }} />
  )

}

export default I18n;
