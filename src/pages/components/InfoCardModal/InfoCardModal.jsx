export default function InfoCardModal({ title, text, showImage, imageUrl }) {
  const hasImage = Boolean(showImage && imageUrl && imageUrl !== "error");

  return (
    <article
      className="playground-info-card-modal"
      role="dialog"
      aria-modal="true"
    >
      <header className="playground-info-card-modal__header">
        <h2 className="playground-info-card-modal__title">{title || "Info"}</h2>
      </header>

      <div className="playground-info-card-modal__body">
        {hasImage ? (
          <img
            className="playground-info-card-modal__image"
            src={imageUrl}
            alt={title || "Info"}
          />
        ) : (
          <div
            className="playground-info-card-modal__text"
            dangerouslySetInnerHTML={{ __html: text || "" }}
          />
        )}
      </div>
    </article>
  );
}
