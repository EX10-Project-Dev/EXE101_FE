import { Fragment } from 'react'

export default function BrandText({ text = 'FIND&GO' }) {
  return text.split('FIND&GO').map((part, index) => (
    <Fragment key={index}>
      {index > 0 && <>FIND&<span className="brand-go">GO</span></>}
      {part}
    </Fragment>
  ))
}
