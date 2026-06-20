import { useState } from "react";
import { config } from "./config";
import DarkScene from "./components/DarkScene";
import Balloons from "./components/Balloons";
import PhotoFrame from "./components/PhotoFrame";
import Cake from "./components/Cake";
import Mascot from "./components/Mascot";
import Envelope from "./components/Envelope";
import GreetingCard from "./components/GreetingCard";
import { playMusic, setMusicMuted, playSfx } from "./lib/audio";
import { fireworks, burst } from "./lib/confetti";
import "./App.css";

type Scene = "dark" | "lit";

function App() {
  const [scene, setScene] = useState<Scene>("dark");
  const [flash, setFlash] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [candleLit, setCandleLit] = useState(true);
  const [mascotJump, setMascotJump] = useState(false);

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

      {flash && <div className="flash" aria-hidden="true" />}
    </main>
  );
}

export default App;
