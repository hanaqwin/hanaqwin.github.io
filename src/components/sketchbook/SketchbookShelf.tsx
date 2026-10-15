import { drawingRefs, stillDrying } from "../../lib/drawings";
import { SKETCHBOOK_HREF } from "../../lib/routes";
import { sentStore } from "../../lib/sketchStore";
import PageCanvas from "./PageCanvas";
import { PencilIcon } from "./icons";
import { usePublishedDrawing } from "./usePublishedDrawing";
import "./sketchbook.css";

/**
 * The sketchbook lying on the party table under the envelope, its newest page
 * tucked into the cover. Shown even while it is blank — an invitation to draw
 * the first page.
 */
export default function SketchbookShelf() {
  const drying = stillDrying(sentStore.use());
  const newest = drying[0];
  const latest = usePublishedDrawing(newest ? null : (drawingRefs[0]?.id ?? null));
  const cover = newest?.drawing.strokes ?? latest?.strokes ?? null;
  const count = drawingRefs.length + drying.length;

  return (
    <a className="sketch-shelf" href={SKETCHBOOK_HREF}>
      <span className="sketch-shelf__book">
        <span className="sketch-shelf__cover" aria-hidden="true" />
        <span className="sketch-shelf__coil" aria-hidden="true" />
        <span className="sketch-shelf__peek sketch-paper" aria-hidden="true">
          <PageCanvas strokes={cover} />
          {count === 0 && (
            <span className="sketch-shelf__pencil">
              <PencilIcon />
            </span>
          )}
        </span>
        <span className="sketch-shelf__label">our sketchbook</span>
      </span>
      <span className="sketch-shelf__count">
        {count === 0
          ? "blank so far — draw the first page ✏️"
          : `${count} page${count === 1 ? "" : "s"} inside`}
        {drying.length > 0 && ` · ${drying.length} drying`}
      </span>
    </a>
  );
}
