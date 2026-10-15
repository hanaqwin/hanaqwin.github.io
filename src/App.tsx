import { useEffect, useState } from "react";
import { config } from "./config";
import DarkScene from "./components/DarkScene";
import Balloons from "./components/Balloons";
import PhotoFrame from "./components/PhotoFrame";
import Cake from "./components/Cake";
import Mascot from "./components/Mascot";
import Envelope from "./components/Envelope";
import GreetingCard from "./components/GreetingCard";
import Sketchbook from "./components/sketchbook/Sketchbook";
import SketchbookShelf from "./components/sketchbook/SketchbookShelf";
import { sketchRepo } from "./lib/github";
import { playMusic, setMusicMuted, playSfx } from "./lib/audio";
import { fireworks, burst } from "./lib/confetti";
import "./App.css";

type Scene = "dark" | "lit";

function App() {
  const [scene, setScene] = useState<Scene>(config.showIntro ? "dark" : "lit");
  const [flash, setFlash] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [candleLit, setCandleLit] = useState(true);
  const [mascotJump, setMascotJump] = useState(!config.showIntro);

  // With the intro off there's no switch to flip, so the party starts on load.
  // Browsers hold the song back until a gesture, so it also waits for the first tap/key.
  useEffect(() => {
    if (config.showIntro) return;
    playMusic();
    window.addEventListener("pointerdown", playMusic, { once: true });
    window.addEventListener("keydown", playMusic, { once: true });
    const timers = [
      window.setTimeout(fireworks, 300),
      window.setTimeout(() => setMascotJump(false), 1300),
    ];
    return () => {
      window.removeEventListener("pointerdown", playMusic);
      window.removeEventListener("keydown", playMusic);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const turnOnTheLights = () => {
    if (scene === "lit") return;
    setScene("lit");
    setFlash(true);
    playSfx("click");
    playMusic();
    fireworks();
    setMascotJump(true);
    window.setTimeout(() => setFlash(false), 650);
    window.setTimeout(() => setMascotJump(false), 1300);
  };

  const openCard = () => {
    if (cardOpen) return;
    setCardOpen(true);
    playSfx("pop");
    burst(0.5, 0.5);
  };

  const blowCandles = () => {
    if (!candleLit) return;
    setCandleLit(false);
    playSfx("blow");
  };

  const toggleMute = () => {
    setMuted((prev) => {
      const next = !prev;
      setMusicMuted(next);
      return next;
    });
  };

  return (
    <main className={`app scene-${scene}`}>
      {scene === "dark" && <DarkScene onTurnOn={turnOnTheLights} />}

      {scene === "lit" && (
        <>
          {config.showBalloons && <Balloons />}

          <section className="stage">
            <h1 className="banner reveal" style={{ animationDelay: "0.1s" }}>
              <span className="banner-small">Happy Birthday,</span>
              <span className="banner-name">{config.recipientName}!</span>
            </h1>

            <div className="stage-row">
              {config.showMascot && (
                <div className="reveal stage-side" style={{ animationDelay: "0.65s" }}>
                  <Mascot jumping={mascotJump} />
                </div>
              )}

              <div className="reveal stage-center" style={{ animationDelay: "0.35s" }}>
                <PhotoFrame photoUrl={config.photoUrl} name={config.recipientName} />
              </div>

              {config.showCake && (
                <div className="reveal stage-side" style={{ animationDelay: "0.8s" }}>
                  <Cake candleLit={candleLit} onBlow={blowCandles} />
                </div>
              )}
            </div>

            <div className="reveal envelope-slot" style={{ animationDelay: "1.05s" }}>
              <Envelope open={cardOpen} onClick={openCard} />
            </div>

            {sketchRepo && (
              <div className="reveal sketchbook-slot" style={{ animationDelay: "1.3s" }}>
                <SketchbookShelf />
              </div>
            )}
          </section>

          <button
            type="button"
            className="mute-btn"
            onClick={toggleMute}
            aria-label={muted ? "Unmute music" : "Mute music"}
          >
            {muted ? "🔇" : "🔊"}
          </button>
        </>
      )}

      {cardOpen && <GreetingCard onClose={() => setCardOpen(false)} />}

      {/* Mounted for the whole site: it shows itself only when the hash points
          into the sketchbook, so a link to one page works from the dark intro too. */}
      <Sketchbook />

      {flash && <div className="flash" aria-hidden="true" />}
    </main>
  );
}

export default App;
