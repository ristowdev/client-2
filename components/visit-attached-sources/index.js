import React from 'react'
import { renderAttachedSourceIcon, renderModalTypeBySource } from '@utils/helpers'
import { useLang } from '@hooks/useLang'
import qs from 'querystring'

function VisitAttachedSources(
  {
    data,
    setSelectedSourceKey,
    translations,
    setModalType,
  }
) {
  const T = translations
  const { lang } = useLang()

  const generateRankerChart = (data) => {
    const query = qs.stringify({
      rank_colors: data.colors_preview,
      rank_levels: data.levels_preview,
      measured: data?.measured_value,
      target: data?.target_value,
      height: '30',
      width: '300',
      show_axis: false,
    })

    return `https://clinicchartapi.azurewebsites.net/rankingchart/singlecategory?${query}`
  }

  return (
    <>
      {data.map((source, idx) => (
        <div key={idx}>
          {source.is_displayed && (
            <span
              key={idx}
              className="flex items-center text-primary hover:underline text-sm mt-4 cursor-pointer"
              onClick={() => {
                renderModalTypeBySource(source, setModalType)
                setSelectedSourceKey(source.source_key)
              }}
            >
            <i className={renderAttachedSourceIcon(source.source_type_key)}/>
            <span className={lang === 'Heb' ? 'mr-1' : 'ml-1'}>{T[source.source_trans_key]}</span>
          </span>
          )}
          {source.is_displayed && source.ranker && <img src={generateRankerChart(source.ranker)}/>}
        </div>
      ))}
      {data.filter(item => item.is_displayed).length <= 0 && (
        <p
          className="-mt-3"
          style={lang === 'Heb' ? { textAlign: 'right' } : { textAlign: 'left' }}
        >
          -
        </p>
      )}
    </>
  )
}

export default VisitAttachedSources
