import { GithubIcon, LiveIcon } from '../icons.jsx'

/* Body of a project window. The chrome around it comes from
   <DraggableWindow>, so this is only the content. */
export default function WorkCardWindow({ data }) {
  const { img, url, modalData } = data

  return (
    <div className="workcard-window">
      <img className="workcard-window__cover" src={img} alt="" />
      <div className="workcard-window__content">
        <h2 className="heading">{modalData.title}</h2>
        <p className="desc" dangerouslySetInnerHTML={{ __html: modalData.desc }} />

        {modalData.infoHeading && <h2 className="heading-2">{modalData.infoHeading}</h2>}
        {modalData.infoArr && (
          <ul className="workcard-window__list">
            {modalData.infoArr.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}

        <div className="modal-cta-row">
          {url?.liveUrl && (
            <button className="btn primary" onClick={() => window.open(url.liveUrl, '_blank', 'noopener')}>
              <LiveIcon />
              <span className="text">Live</span>
            </button>
          )}
          {url?.githubUrl && (
            <button className="btn outline" onClick={() => window.open(url.githubUrl, '_blank', 'noopener')}>
              <GithubIcon />
              <span className="text">Code</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
